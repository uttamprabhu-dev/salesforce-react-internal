import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface AccountSearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function AccountSearchBar({
	value,
	onChange,
	placeholder = 'Search accounts by name…',
}: AccountSearchBarProps) {
	return (
		<div className="relative max-w-md">
			<Search
				aria-hidden="true"
				className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
			/>
			<Input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="pl-9"
				aria-label="Search accounts"
			/>
		</div>
	);
}
