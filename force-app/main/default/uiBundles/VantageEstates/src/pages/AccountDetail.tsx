import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AlertCircle, FileQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { DetailField } from '../components/DetailField';
import { executeGraphQL } from '../api/graphqlClient';
import { fieldValue, formatDateTimeField, getAddressFieldLines } from '../utils/accountFields';
import type { AccountDetailNode, AccountDetailResponse } from '../types/account';
import getAccountDetailQuery from './getAccountDetail.graphql?raw';

export default function AccountDetail() {
	const { recordId } = useParams();
	const navigate = useNavigate();
	const [account, setAccount] = useState<AccountDetailNode | null | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!recordId) return;
		let cancelled = false;
		setLoading(true);
		setError(null);

		executeGraphQL<AccountDetailResponse, { id: string }>(getAccountDetailQuery, { id: recordId })
			.then((data) => {
				if (cancelled) return;
				setAccount(data.uiapi?.query?.Account?.edges?.[0]?.node ?? null);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : 'Failed to load account.');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [recordId]);

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
			<Link to="/accounts" className="text-sm text-muted-foreground hover:underline">
				&larr; Back to Accounts
			</Link>

			{loading && <DetailSkeleton />}

			{!loading && error && (
				<>
					<Alert variant="destructive" role="alert">
						<AlertCircle />
						<AlertTitle>Failed to load account</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
					<Button variant="outline" onClick={() => navigate(-1)}>
						&larr; Back
					</Button>
				</>
			)}

			{!loading && !error && !account && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16 text-center">
						<FileQuestion className="size-12 text-muted-foreground mb-4" />
						<h2 className="text-lg font-semibold mb-1">Account not found</h2>
						<p className="text-sm text-muted-foreground mb-6">
							The account you're looking for doesn't exist or may have been deleted.
						</p>
						<Button variant="outline" onClick={() => navigate(-1)}>
							&larr; Go back
						</Button>
					</CardContent>
				</Card>
			)}

			{!loading && !error && account && <AccountDetailContent account={account} />}
		</div>
	);
}

function AccountDetailContent({ account }: { account: AccountDetailNode }) {
	const billingAddress = getAddressFieldLines({
		street: fieldValue(account.BillingStreet),
		city: fieldValue(account.BillingCity),
		state: fieldValue(account.BillingState),
		postalCode: fieldValue(account.BillingPostalCode),
		country: fieldValue(account.BillingCountry),
	});
	const shippingAddress = getAddressFieldLines({
		street: fieldValue(account.ShippingStreet),
		city: fieldValue(account.ShippingCity),
		state: fieldValue(account.ShippingState),
		postalCode: fieldValue(account.ShippingPostalCode),
		country: fieldValue(account.ShippingCountry),
	});
	const dateTimeOptions: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' };
	const createdDate = formatDateTimeField(fieldValue(account.CreatedDate), undefined, dateTimeOptions);
	const lastModifiedDate = formatDateTimeField(
		fieldValue(account.LastModifiedDate),
		undefined,
		dateTimeOptions,
	);

	return (
		<>
			<h1 className="text-2xl font-bold">{fieldValue(account.Name)}</h1>

			<Card>
				<CardContent className="space-y-8 pt-6">
					<FieldRow>
						<DetailField label="Account Owner">{fieldValue(account.Owner?.Name)}</DetailField>
						<DetailField label="Phone">{fieldValue(account.Phone)}</DetailField>
					</FieldRow>
					<FieldRow>
						<DetailField label="Parent Account">{fieldValue(account.Parent?.Name)}</DetailField>
						<DetailField label="Fax">{fieldValue(account.Fax)}</DetailField>
					</FieldRow>
					<FieldRow>
						<DetailField label="Website">{fieldValue(account.Website)}</DetailField>
						<DetailField label="Type">{fieldValue(account.Type)}</DetailField>
					</FieldRow>

					<Section title="Additional Information">
						<FieldRow>
							<DetailField label="Industry">{fieldValue(account.Industry)}</DetailField>
							<DetailField label="Employees">{fieldValue(account.NumberOfEmployees)}</DetailField>
						</FieldRow>
						<FieldRow>
							<DetailField label="Annual Revenue">{fieldValue(account.AnnualRevenue)}</DetailField>
						</FieldRow>
						<dl>
							<DetailField label="Description">{fieldValue(account.Description)}</DetailField>
						</dl>
					</Section>

					<Section title="Address Information">
						<FieldRow>
							<DetailField label="Billing Address">
								{billingAddress ? billingAddress.map((line, i) => <div key={i}>{line}</div>) : null}
							</DetailField>
							<DetailField label="Shipping Address">
								{shippingAddress
									? shippingAddress.map((line, i) => <div key={i}>{line}</div>)
									: null}
							</DetailField>
						</FieldRow>
					</Section>

					<Section title="System Information">
						<FieldRow>
							<DetailField label="Created By">
								{[fieldValue(account.CreatedBy?.Name), createdDate].filter(Boolean).join(' ') ||
									null}
							</DetailField>
							<DetailField label="Last Modified By">
								{[fieldValue(account.LastModifiedBy?.Name), lastModifiedDate]
									.filter(Boolean)
									.join(' ') || null}
							</DetailField>
						</FieldRow>
					</Section>
				</CardContent>
			</Card>
		</>
	);
}

function FieldRow({ children }: { children: React.ReactNode }) {
	return <dl className="grid grid-cols-2 gap-x-8 gap-y-4">{children}</dl>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="border-t pt-6 space-y-4">
			<h2 className="text-lg font-semibold">{title}</h2>
			{children}
		</div>
	);
}

function DetailSkeleton() {
	return (
		<Card>
			<CardContent className="space-y-8 pt-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="grid grid-cols-2 gap-x-8 gap-y-4">
						<div>
							<Skeleton className="h-4 w-24 mb-1.5" />
							<Skeleton className="h-5 w-40" />
						</div>
						<div>
							<Skeleton className="h-4 w-24 mb-1.5" />
							<Skeleton className="h-5 w-40" />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
