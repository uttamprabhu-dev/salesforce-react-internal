import { Outlet, Link, useLocation } from "react-router";
import { getAllRoutes } from "./router-utils";
import { useState } from "react";
import { Building2, Menu, X } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { AgentforceConversationClient } from "./components/AgentforceConversationClient";
import { cn } from "./lib/utils";

export default function AppLayout() {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	const toggleMenu = () => setIsOpen(!isOpen);

	const navigationRoutes: { path: string; label: string }[] = getAllRoutes()
		.filter(
			(route) =>
				route.handle?.showInNavigation === true &&
				route.fullPath !== undefined &&
				route.handle?.label !== undefined,
		)
		.map(
			(route) =>
				({
					path: route.fullPath,
					label: route.handle?.label,
				}) as { path: string; label: string },
		);

	function navLinkClasses(path: string) {
		return cn(
			"rounded-md px-3 py-2 text-sm font-medium transition-colors",
			isActive(path)
				? "bg-primary/10 text-primary"
				: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
		);
	}

	return (
		<>
			<header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
							<Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
							Vantage Estates
						</Link>

						<nav className="hidden md:flex items-center gap-1">
							{navigationRoutes.map((item) => (
								<Link key={item.path} to={item.path} className={navLinkClasses(item.path)}>
									{item.label}
								</Link>
							))}
						</nav>

						<button
							onClick={toggleMenu}
							className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							aria-label="Toggle menu"
							aria-expanded={isOpen}
						>
							{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>

					{isOpen && (
						<nav className="md:hidden pb-4">
							<div className="flex flex-col gap-1">
								{navigationRoutes.map((item) => (
									<Link
										key={item.path}
										to={item.path}
										onClick={() => setIsOpen(false)}
										className={navLinkClasses(item.path)}
									>
										{item.label}
									</Link>
								))}
							</div>
						</nav>
					)}
				</div>
			</header>
			<Outlet />
			<Toaster />
			<AgentforceConversationClient agentId="0XxgL000002bVRtSAM" />
		</>
	);
}
