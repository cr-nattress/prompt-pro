"use client";

import { useEffect, useRef, useState } from "react";
import { countTokens, estimateCost } from "@/lib/token-utils";

interface TokenCounterProps {
	text: string;
	model?: string;
}

export function TokenCounter({ text, model = "gpt-4o" }: TokenCounterProps) {
	const [tokens, setTokens] = useState(0);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setTokens(countTokens(text));
		}, 300);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [text]);

	const cost = estimateCost(tokens, model);
	const formattedCost =
		cost < 0.01 ? `<$0.01` : `~$${cost.toFixed(cost < 0.1 ? 3 : 2)}`;

	return (
		<div className="flex items-center gap-2 text-muted-foreground text-xs">
			<span>
				{tokens.toLocaleString()} token{tokens !== 1 ? "s" : ""}
			</span>
			<span className="text-border">|</span>
			<span>{formattedCost}</span>
		</div>
	);
}
