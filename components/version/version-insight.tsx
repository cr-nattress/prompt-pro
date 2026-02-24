"use client";

import { Lightbulb, Loader2 } from "lucide-react";
import { useState } from "react";
import {
	explainVersionChangesAction,
	type VersionInsight,
} from "@/app/(dashboard)/prompts/compare-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

const ASSESSMENT_STYLES: Record<string, string> = {
	positive: "bg-green-500/10 text-green-600 dark:text-green-400",
	negative: "bg-red-500/10 text-red-600 dark:text-red-400",
	neutral: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	mixed: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

interface VersionInsightPanelProps {
	oldText: string;
	newText: string;
}

export function VersionInsightPanel({
	oldText,
	newText,
}: VersionInsightPanelProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [insight, setInsight] = useState<VersionInsight | null>(null);

	async function handleExplain() {
		setIsLoading(true);
		const result = await explainVersionChangesAction(oldText, newText);
		setIsLoading(false);
		if (result.success) {
			setInsight(result.data);
		} else {
			showToast("error", result.error);
		}
	}

	if (!insight) {
		return (
			<div className="flex items-center justify-center border-t p-4">
				<Button
					variant="outline"
					size="sm"
					onClick={handleExplain}
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
					) : (
						<Lightbulb className="mr-1.5 h-3.5 w-3.5" />
					)}
					{isLoading ? "Analyzing..." : "Explain Changes"}
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-3 border-t p-4">
			<div className="flex items-start gap-3">
				<Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<p className="font-medium text-sm">AI Analysis</p>
						<Badge
							variant="outline"
							className={ASSESSMENT_STYLES[insight.assessment] ?? ""}
						>
							{insight.assessment}
						</Badge>
					</div>
					<p className="text-sm">{insight.summary}</p>
					{insight.details.length > 0 && (
						<ul className="space-y-1">
							{insight.details.map((detail) => (
								<li
									key={detail}
									className="flex items-start gap-1.5 text-muted-foreground text-xs"
								>
									<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
									{detail}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
