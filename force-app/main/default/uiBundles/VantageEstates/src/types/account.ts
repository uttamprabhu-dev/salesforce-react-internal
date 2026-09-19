/**
 * Local hand-written uiapi types (no codegen — schema.graphql isn't fetched
 * in this environment). Field values selected with `@optional` come back as
 * `{ value, displayValue }`.
 */
export interface UiApiField<T = string> {
	value?: T | null;
	displayValue?: string | null;
}

export interface UiApiNameHolder {
	Name?: UiApiField | null;
}

export interface AccountListNode {
	Id: string;
	Name?: UiApiField | null;
	Industry?: UiApiField | null;
	Phone?: UiApiField | null;
	Site?: UiApiField | null;
	Type?: UiApiField | null;
	NumberOfEmployees?: UiApiField<number> | null;
}

export interface AccountDetailNode {
	Id: string;
	Name?: UiApiField | null;
	Owner?: UiApiNameHolder | null;
	Phone?: UiApiField | null;
	Fax?: UiApiField | null;
	Parent?: UiApiNameHolder | null;
	Website?: UiApiField | null;
	Type?: UiApiField | null;
	NumberOfEmployees?: UiApiField<number> | null;
	Industry?: UiApiField | null;
	AnnualRevenue?: UiApiField<number> | null;
	Description?: UiApiField | null;
	BillingStreet?: UiApiField | null;
	BillingCity?: UiApiField | null;
	BillingState?: UiApiField | null;
	BillingPostalCode?: UiApiField | null;
	BillingCountry?: UiApiField | null;
	ShippingStreet?: UiApiField | null;
	ShippingCity?: UiApiField | null;
	ShippingState?: UiApiField | null;
	ShippingPostalCode?: UiApiField | null;
	ShippingCountry?: UiApiField | null;
	CreatedBy?: UiApiNameHolder | null;
	CreatedDate?: UiApiField | null;
	LastModifiedBy?: UiApiNameHolder | null;
	LastModifiedDate?: UiApiField | null;
}

export interface UiApiPageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null;
	endCursor: string | null;
}

export interface AccountListResponse {
	uiapi?: {
		query?: {
			Account?: {
				edges?: Array<{ node?: AccountListNode } | null> | null;
				pageInfo?: UiApiPageInfo | null;
				totalCount?: number | null;
			} | null;
		} | null;
	} | null;
}

export interface AccountDetailResponse {
	uiapi?: {
		query?: {
			Account?: {
				edges?: Array<{ node?: AccountDetailNode } | null> | null;
			} | null;
		} | null;
	} | null;
}
