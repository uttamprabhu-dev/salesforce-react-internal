/**
 * REST endpoint backing the public Contact Us form. Accepts a POST of
 * {name, email, message} and emails the org's configured recipient list
 * (Contact_Us_Recipient_Emails custom label, semicolon-separated).
 */
@RestResource(urlMapping='/contactus')
global with sharing class ContactUsController {

	private static final Integer MAX_NAME_LENGTH = 255;
	private static final Integer MAX_EMAIL_LENGTH = 255;
	private static final Integer MAX_MESSAGE_LENGTH = 4000;
	private static final Pattern EMAIL_PATTERN = Pattern.compile('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$');

	public class ContactRequest {
		public String name;
		public String email;
		public String message;
	}

	public class ContactResponse {
		public Boolean success;
		public String message;
		public String error;
		public ContactResponse(Boolean success, String message, String error) {
			this.success = success;
			this.message = message;
			this.error = error;
		}
	}

	@HttpPost
	global static void handlePost() {
		RestRequest req = RestContext.request;
		RestResponse res = RestContext.response;
		res.addHeader('Content-Type', 'application/json');

		ContactRequest input;
		try {
			input = (ContactRequest) JSON.deserialize(req.requestBody.toString(), ContactRequest.class);
		} catch (Exception e) {
			writeResponse(res, 400, new ContactResponse(false, null, 'Invalid request body.'));
			return;
		}

		String validationError = validate(input);
		if (validationError != null) {
			writeResponse(res, 400, new ContactResponse(false, null, validationError));
			return;
		}

		List<String> recipients = parseRecipients(Label.Contact_Us_Recipient_Emails);
		if (recipients.isEmpty()) {
			writeResponse(res, 500, new ContactResponse(false, null, 'No recipients configured.'));
			return;
		}

		Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
		email.setToAddresses(recipients);
		email.setSubject('New Contact Us Submission from ' + input.name);
		email.setPlainTextBody(
			'Name: ' + input.name + '\n' +
			'Email: ' + input.email + '\n\n' +
			'Message:\n' + input.message
		);
		email.setSaveAsActivity(false);

		Messaging.SendEmailResult[] results = Messaging.sendEmail(
			new List<Messaging.SingleEmailMessage>{ email }
		);
		if (results == null || results.isEmpty() || !results[0].isSuccess()) {
			String errorMessage =
				(results != null && !results.isEmpty() && !results[0].getErrors().isEmpty())
					? results[0].getErrors()[0].getMessage()
					: 'Failed to send email.';
			writeResponse(res, 500, new ContactResponse(false, null, errorMessage));
			return;
		}

		writeResponse(res, 200, new ContactResponse(true, 'Thank you, your message has been sent.', null));
	}

	private static String validate(ContactRequest input) {
		if (input == null) return 'Request body is required.';
		if (String.isBlank(input.name)) return 'Name is required.';
		if (String.isBlank(input.email)) return 'Email is required.';
		if (String.isBlank(input.message)) return 'Message is required.';
		if (input.name.length() > MAX_NAME_LENGTH) return 'Name is too long.';
		if (input.email.length() > MAX_EMAIL_LENGTH) return 'Email is too long.';
		if (input.message.length() > MAX_MESSAGE_LENGTH) return 'Message is too long.';
		if (!EMAIL_PATTERN.matcher(input.email).matches()) return 'Email address is not valid.';
		return null;
	}

	private static List<String> parseRecipients(String rawLabel) {
		List<String> recipients = new List<String>();
		if (String.isBlank(rawLabel)) return recipients;
		for (String addr : rawLabel.split(';')) {
			String trimmed = addr.trim();
			if (String.isNotBlank(trimmed)) {
				recipients.add(trimmed);
			}
		}
		return recipients;
	}

	private static void writeResponse(RestResponse res, Integer statusCode, ContactResponse body) {
		res.statusCode = statusCode;
		res.responseBody = Blob.valueOf(JSON.serialize(body));
	}
}
