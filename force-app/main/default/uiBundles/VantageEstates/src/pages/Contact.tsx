import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { submitContactForm } from '../api/contactApi';
import { isValidEmail } from '../utils/validation';

interface FormErrors {
	name?: string;
	email?: string;
	message?: string;
}

export default function Contact() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitting, setSubmitting] = useState(false);

	function validate(): FormErrors {
		const next: FormErrors = {};
		if (!name.trim()) next.name = 'Name is required.';
		if (!email.trim()) next.email = 'Email is required.';
		else if (!isValidEmail(email)) next.email = 'Enter a valid email address.';
		if (!message.trim()) next.message = 'Message is required.';
		return next;
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const validationErrors = validate();
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length > 0) return;

		setSubmitting(true);
		try {
			const response = await submitContactForm({
				name: name.trim(),
				email: email.trim(),
				message: message.trim(),
			});
			toast.success(response.message ?? 'Thank you, your message has been sent.');
			setName('');
			setEmail('');
			setMessage('');
			setErrors({});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Contact Us</CardTitle>
					<CardDescription>
						Have a question about a property or partnership? Send us a message and our team
						will get back to you.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4" noValidate>
						<div className="space-y-1.5">
							<Label htmlFor="contact-name">Name</Label>
							<Input
								id="contact-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								aria-invalid={!!errors.name}
								disabled={submitting}
							/>
							{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="contact-email">Email</Label>
							<Input
								id="contact-email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								aria-invalid={!!errors.email}
								disabled={submitting}
							/>
							{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="contact-message">Message</Label>
							<Textarea
								id="contact-message"
								rows={5}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								aria-invalid={!!errors.message}
								disabled={submitting}
							/>
							{errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
						</div>

						<Button type="submit" disabled={submitting} className="w-full">
							{submitting ? 'Sending…' : 'Submit'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
