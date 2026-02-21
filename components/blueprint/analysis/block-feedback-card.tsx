"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlockFeedback } from "@/lib/ai";
import { cn } from "@/lib/utils";

interface BlockFeedbackCardProps {
	feedback: BlockFeedback;
}

function scoreBadgeColor(score: number): string {
	if (score >= 70)
		return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
	if (score >= 40)
		return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
	return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

export function BlockFeedbackCard({ feedback }: BlockFeedbackCardProps) {
	return (
		<div className="rounded-lg border p-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="font-medium text-sm">{feedback.name}</span>
					<span className="text-muted-foreground text-xs">{feedback.slug}</span>
				</div>
				<Badge
					variant="secondary"
					className={cn("text-xs", scoreBadgeColor(feedback.score))}
				>
					{feedback.score}
				</Badge>
			</div>
			{feedback.issues.length > 0 && (
				<ul className="mt-2 space-y-1">
					{feedback.issues.map((issue) => (
						<li
							key={issue}
							className="flex gap-1.5 text-muted-foreground text-xs"
						>
							<AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
							{issue}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
