"use client";

import { AlertTriangle } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlockWarningBadgeProps {
	issueCount: number;
}

export function BlockWarningBadge({ issueCount }: BlockWarningBadgeProps) {
	if (issueCount === 0) return null;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
						<AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{issueCount} {issueCount === 1 ? "issue" : "issues"} found
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
