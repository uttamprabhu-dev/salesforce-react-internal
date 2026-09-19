import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { AccountSearchBar } from '../components/AccountSearchBar';
import { AccountTable } from '../components/AccountTable';
import { executeGraphQL } from '../api/graphqlClient';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { AccountListNode, AccountListResponse, UiApiPageInfo } from '../types/account';
import getAccountListQuery from './getAccountList.graphql?raw';

const PAGE_SIZE = 10;

interface AccountListVariables {
	first: number;
	after?: string;
	where: { Name: { like: string } } | null;
	orderBy: { Name: { order: 'ASC' | 'DESC' } };
}

export default function AccountList() {
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
	const [cursorStack, setCursorStack] = useState<string[]>([]);
	const [accounts, setAccounts] = useState<AccountListNode[]>([]);
	const [pageInfo, setPageInfo] = useState<UiApiPageInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// A new search term always starts back at the first page.
	useEffect(() => {
		setCursorStack([]);
	}, [debouncedSearchTerm]);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		const after = cursorStack[cursorStack.length - 1];
		const trimmedTerm = debouncedSearchTerm.trim();
		const variables: AccountListVariables = {
			first: PAGE_SIZE,
			after,
			where: trimmedTerm ? { Name: { like: `%${trimmedTerm}%` } } : null,
			orderBy: { Name: { order: 'ASC' } },
		};

		executeGraphQL<AccountListResponse, AccountListVariables>(getAccountListQuery, variables)
			.then((data) => {
				if (cancelled) return;
				const connection = data.uiapi?.query?.Account;
				const nodes = (connection?.edges ?? [])
					.map((edge) => edge?.node)
					.filter((node): node is AccountListNode => node != null);
				setAccounts(nodes);
				setPageInfo(connection?.pageInfo ?? null);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : 'Failed to load accounts.');
				setAccounts([]);
				setPageInfo(null);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [debouncedSearchTerm, cursorStack]);

	function goToNextPage() {
		if (!pageInfo?.hasNextPage || !pageInfo.endCursor) return;
		setCursorStack((prev) => [...prev, pageInfo.endCursor!]);
	}

	function goToPreviousPage() {
		setCursorStack((prev) => prev.slice(0, -1));
	}

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
			<header>
				<h1 className="text-2xl font-bold">Accounts</h1>
			</header>

			<AccountSearchBar value={searchTerm} onChange={setSearchTerm} />

			{error ? (
				<Alert variant="destructive" role="alert">
					<AlertCircle />
					<AlertTitle>Failed to load accounts</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : (
				<>
					<AccountTable accounts={accounts} loading={loading} />
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">Page {cursorStack.length + 1}</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={goToPreviousPage}
								disabled={cursorStack.length === 0 || loading}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={goToNextPage}
								disabled={!pageInfo?.hasNextPage || loading}
							>
								Next
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
