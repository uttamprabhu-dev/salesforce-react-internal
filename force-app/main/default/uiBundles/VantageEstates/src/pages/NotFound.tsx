import { Link } from 'react-router';
import { Button } from '../components/ui/button';

export default function NotFound() {
	return (
		<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
			<h1 className="text-3xl font-bold">404</h1>
			<p className="mt-2 text-lg font-medium">Page not found</p>
			<p className="mt-2 text-muted-foreground">
				The page you're looking for doesn't exist or may have been moved.
			</p>
			<Button asChild className="mt-6">
				<Link to="/">Back to Home</Link>
			</Button>
		</div>
	);
}
