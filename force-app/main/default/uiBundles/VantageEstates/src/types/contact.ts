export interface ContactFormPayload {
	name: string;
	email: string;
	message: string;
}

export interface ContactSubmitResponse {
	success: boolean;
	message?: string;
	error?: string;
}
