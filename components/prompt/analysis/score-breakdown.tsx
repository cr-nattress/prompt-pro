"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScoreItem {
	label: string;
	score: number;
}

interface ScoreBreakdownProps {
	primaryScores: ScoreItem[];
	detailedScores: ScoreItem[];
}

function scoreColor(score: number): string {
	if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
	if (score >= 40) return "text-amber-600 dark:text-amber-400";
	return "text-red-600 dark:text-red-400";
}

function progressColor(score: number): string {
	if (score >= 70) return "[&>div]:bg-emerald-500";
	if (score >= 40) return "[&>div]:bg-amber-500";
	return "[&>div]:bg-red-500";
}

function ScoreBar({ label, score }: ScoreItem) {
	return (
		<div className="flex items-center gap-3">
			<span className="w-28 shrink-0 truncate text-muted-foreground text-xs">
				{label}
			</span>
			<Progress
				value={score}
				className={cn("h-2 flex-1", progressColor(score))}
			/>
			<span
				className={cn("w-8 text-right font-medium text-xs", scoreColor(score))}
			>
				{score}
			</span>
		</div>
	);
}

export function ScoreBreakdown({
	primaryScores,
	detailedScores,
}: ScoreBreakdownProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-3">
			<div className="space-y-2">
				{primaryScores.map((item) => (
					<ScoreBar key={item.label} {...item} />
				))}
			</div>

			{detailedScores.length > 0 && (
				<Collapsible open={open} onOpenChange={setOpen}>
					<CollapsibleTrigger className="flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground">
						<ChevronDown
							className={cn(
								"h-3.5 w-3.5 transition-transform",
								open && "rotate-180",
							)}
						/>
						Detailed Breakdown
					</CollapsibleTrigger>
					<CollapsibleContent className="mt-2 space-y-2">
						{detailedScores.map((item) => (
							<ScoreBar key={item.label} {...item} />
						))}
					</CollapsibleContent>
				</Collapsible>
			)}
		</div>
	);
}
