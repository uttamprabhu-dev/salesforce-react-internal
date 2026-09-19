import { Link } from 'react-router';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import { Skeleton } from './ui/skeleton';
import type { AccountListNode } from '../types/account';
import { fieldValue } from '../utils/accountFields';

interface AccountTableProps {
	accounts: AccountListNode[];
	loading: boolean;
}

const COLUMNS = [
	'Account Name',
	'Industry',
	'Phone',
	'Account Site',
	'Type',
	'NumberOfEmployees',
	'',
];

export function AccountTable({ accounts, loading }: AccountTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{COLUMNS.map((column) => (
						<TableHead key={column || 'open'}>{column}</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{loading ? (
					Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i}>
							{COLUMNS.map((column, colIndex) => (
								<TableCell key={column || `open-${colIndex}`}>
									<Skeleton className="h-4 w-24" />
								</TableCell>
							))}
						</TableRow>
					))
				) : accounts.length === 0 ? (
					<TableRow>
						<TableCell colSpan={COLUMNS.length} className="text-center text-muted-foreground py-8">
							No accounts found.
						</TableCell>
					</TableRow>
				) : (
					accounts.map((account) => (
						<TableRow key={account.Id}>
							<TableCell className="font-medium">{fieldValue(account.Name) ?? '—'}</TableCell>
							<TableCell>{fieldValue(account.Industry) ?? '—'}</TableCell>
							<TableCell>{fieldValue(account.Phone) ?? '—'}</TableCell>
							<TableCell>{fieldValue(account.Site) ?? '—'}</TableCell>
							<TableCell>{fieldValue(account.Type) ?? '—'}</TableCell>
							<TableCell>{fieldValue(account.NumberOfEmployees) ?? '—'}</TableCell>
							<TableCell>
								<Link to={`/accounts/${account.Id}`} className="text-primary underline underline-offset-4">
									Open
								</Link>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
