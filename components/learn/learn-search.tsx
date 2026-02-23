"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface LearnSearchProps {
	placeholder: string;
	basePath: string;
	onSearch?: ((query: string) => void) | undefined;
}

export function LearnSearch({ placeholder, onSearch }: LearnSearchProps) {
	const [query, setQuery] = useState("");

	function handleChange(value: string) {
		setQuery(value);
		onSearch?.(value);
	}

	return (
		<div className="relative max-w-sm">
			<Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder={placeholder}
				value={query}
				onChange={(e) => handleChange(e.target.value)}
				className="pl-9"
			/>
		</div>
	);
}
