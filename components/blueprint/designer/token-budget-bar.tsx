"use client";

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { countTokens } from "@/lib/token-utils";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";

interface TokenBudgetBarProps {
	totalBudget: number | null | undefined;
}

export function TokenBudgetBar({ totalBudget }: TokenBudgetBarProps) {
	const { blocks } = useBlueprintDesignerStore();
	const [totalTokens, setTotalTokens] = useState(0);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			const sum = blocks.reduce((acc, block) => {
				return acc + (block.content ? countTokens(block.content) : 0);
			}, 0);
			setTotalTokens(sum);
		}, 300);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [blocks]);

	const budget = totalBudget ?? 0;
	const percentage =
		budget > 0 ? Math.min((totalTokens / budget) * 100, 100) : 0;

	const colorVar =
		percentage < 70
			? "--score-good"
			: percentage < 90
				? "--score-fair"
				: "--score-poor";

	return (
		<div className="flex flex-col gap-1.5 px-4 py-3">
			<div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground">Token budget</span>
				<span className="font-medium">
					{totalTokens.toLocaleString()}
					{budget > 0 && ` / ${budget.toLocaleString()}`} tokens
				</span>
			</div>
			{budget > 0 && (
				<div
					className="[&>div]:transition-colors"
					style={
						{
							"--progress-foreground": `var(${colorVar})`,
						} as React.CSSProperties
					}
				>
					<Progress
						value={percentage}
						className="h-2 [&>div]:bg-[var(--progress-foreground)]"
					/>
				</div>
			)}
		</div>
	);
}
