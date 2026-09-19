@IsTest
private class ContactUsControllerTest {

	private static RestRequest buildRequest(String body) {
		RestRequest req = new RestRequest();
		req.requestUri = '/services/apexrest/contactus';
		req.httpMethod = 'POST';
		req.requestBody = Blob.valueOf(body);
		return req;
	}

	@IsTest
	static void testSuccessfulSubmission() {
		RestContext.request = buildRequest(
			'{"name":"Jane Doe","email":"jane@example.com","message":"Hello there"}'
		);
		RestContext.response = new RestResponse();

		Test.startTest();
		ContactUsController.handlePost();
		Test.stopTest();

		System.assertEquals(200, RestContext.response.statusCode);
		Map<String, Object> body = (Map<String, Object>) JSON.deserializeUntyped(
			RestContext.response.responseBody.toString()
		);
		System.assertEquals(true, body.get('success'));
	}

	@IsTest
	static void testMissingFields() {
		RestContext.request = buildRequest('{"name":"Jane Doe","email":"jane@example.com"}');
		RestContext.response = new RestResponse();

		Test.startTest();
		ContactUsController.handlePost();
		Test.stopTest();

		System.assertEquals(400, RestContext.response.statusCode);
	}

	@IsTest
	static void testInvalidEmailFormat() {
		RestContext.request = buildRequest(
			'{"name":"Jane Doe","email":"not-an-email","message":"Hi"}'
		);
		RestContext.response = new RestResponse();

		Test.startTest();
		ContactUsController.handlePost();
		Test.stopTest();

		System.assertEquals(400, RestContext.response.statusCode);
	}

	@IsTest
	static void testInvalidJsonBody() {
		RestContext.request = buildRequest('not-json');
		RestContext.response = new RestResponse();

		Test.startTest();
		ContactUsController.handlePost();
		Test.stopTest();

		System.assertEquals(400, RestContext.response.statusCode);
	}
}
