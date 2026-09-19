import type { RouteObject } from 'react-router';
import AppLayout from './appLayout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AccountList from './pages/AccountList';
import AccountDetail from './pages/AccountDetail';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <Home />,
				handle: { showInNavigation: true, label: 'Home' },
			},
			{
				path: 'contact',
				element: <Contact />,
				handle: { showInNavigation: true, label: 'Contact' },
			},
			{
				path: 'accounts',
				element: <AccountList />,
				handle: { showInNavigation: true, label: 'Accounts' },
			},
			{
				path: 'accounts/:recordId',
				element: <AccountDetail />,
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
];
