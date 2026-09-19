/**
 * REST client for the Contact Us Apex endpoint. GraphQL (uiapi) has no
 * concept of a custom Apex REST resource, so this goes through the data
 * SDK's `fetch` escape hatch instead of `graphqlClient`.
 */
import { createDataSDK } from '@salesforce/platform-sdk';
import type { ContactFormPayload, ContactSubmitResponse } from '../types/contact';

const CONTACT_US_ENDPOINT = '/services/apexrest/contactus';

export async function submitContactForm(
	payload: ContactFormPayload,
): Promise<ContactSubmitResponse> {
	const sdk = await createDataSDK();
	if (!sdk?.fetch) {
		throw new Error('Failed to initialize data SDK for REST call');
	}

	const response = await sdk.fetch(CONTACT_US_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const json = (await response.json()) as ContactSubmitResponse;
	if (!response.ok || !json.success) {
		throw new Error(json.error ?? `Request failed: ${response.status}`);
	}
	return json;
}
