import type { UiApiField } from '../types/account';

/** Unwraps a uiapi `{ value, displayValue }` field to a printable string, or null. */
export function fieldValue<T>(field?: UiApiField<T> | null): string | null {
	if (!field) return null;
	if (field.displayValue != null && field.displayValue !== '') return field.displayValue;
	if (field.value == null || field.value === '') return null;
	return String(field.value);
}

interface AddressParts {
	street?: string | null;
	city?: string | null;
	state?: string | null;
	postalCode?: string | null;
	country?: string | null;
}

/** Formats a billing/shipping address into printable lines, or null if entirely empty. */
export function getAddressFieldLines(parts: AddressParts): string[] | null {
	const { street, city, state, postalCode, country } = parts;
	const cityLine = [city, state, postalCode].filter(Boolean).join(', ');
	const lines = [street, cityLine, country].filter((line): line is string => !!line && line.trim() !== '');
	return lines.length > 0 ? lines : null;
}

/** Formats a uiapi date/datetime field's raw value with Intl.DateTimeFormat. */
export function formatDateTimeField(
	value?: string | null,
	locale?: string,
	options?: Intl.DateTimeFormatOptions,
): string | null {
	if (!value) return null;
	const date = new Date(value);
	if (isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat(locale, options).format(date);
}
