import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { homeContent } from '../data/homeContent';

export default function Home() {
	return (
		<div>
			{/* Hero */}
			<section className="border-b bg-secondary/40">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
					<p className="text-sm font-medium text-primary uppercase tracking-wide">
						{homeContent.tagline}
					</p>
					<h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
						{homeContent.heading}
					</h1>
					<p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-lg">
						{homeContent.intro}
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Button asChild size="lg">
							<Link to="/accounts">Browse Accounts</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link to="/contact">Contact Us</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{homeContent.stats.map((stat) => (
						<Card key={stat.label}>
							<CardContent className="text-center py-6">
								<p className="text-3xl font-bold">{stat.value}</p>
								<p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Projects */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
				<h2 className="text-2xl font-bold mb-6">Future &amp; In-Progress Projects</h2>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{homeContent.projects.map((project) => (
						<Card key={project.name}>
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<CardTitle>{project.name}</CardTitle>
									<Badge variant="secondary">{project.status}</Badge>
								</div>
								<p className="text-sm text-muted-foreground">{project.location}</p>
							</CardHeader>
							<CardContent>
								<p className="text-sm">{project.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Closing CTA */}
			<section className="border-t bg-secondary/40">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
					<h2 className="text-2xl font-bold">{homeContent.closingHeading}</h2>
					<p className="mt-3 text-muted-foreground">{homeContent.closingBody}</p>
					<Button asChild className="mt-6" size="lg">
						<Link to="/contact">Get in Touch</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}
