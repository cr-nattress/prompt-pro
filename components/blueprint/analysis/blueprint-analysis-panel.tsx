"use client";

import { Loader2, Sparkles } from "lucide-react";
import { WeaknessesList } from "@/components/prompt/analysis/weaknesses-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlockFeedback } from "@/lib/ai";
import type { Analysis } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { BlockFeedbackCard } from "./block-feedback-card";
import {
	BlueprintRadarChart,
	type BlueprintRadarDataPoint,
} from "./blueprint-radar-chart";

interface BlueprintAnalysisPanelProps {
	analysis: Analysis | null;
	blockFeedback: BlockFeedback[];
	isAnalyzing: boolean;
	error: string | null;
	onAnalyze: () => void;
}

/** The 7 blueprint-specific dimensions mapped to the reused DB columns */
const BLUEPRINT_DIMENSIONS: Array<{
	key: keyof Analysis;
	label: string;
}> = [
	{ key: "clarity", label: "Sufficiency" },
	{ key: "specificity", label: "Relevance" },
	{ key: "contextAdequacy", label: "Grounding" },
	{ key: "roleDefinition", label: "Coherence" },
	{ key: "constraintQuality", label: "Placement" },
	{ key: "tokenEfficiency", label: "Budget Efficiency" },
	{ key: "errorHandling", label: "Adaptability" },
];

function overallScoreBadgeColor(score: number): string {
	if (score >= 70)
		return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
	if (score >= 40)
		return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
	return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

function BlueprintAnalysisSkeleton() {
	return (
		<div className="space-y-6 p-4">
			<div className="flex items-center gap-3">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-1.5">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-16" />
				</div>
			</div>
			<Skeleton className="mx-auto h-[250px] w-[250px] rounded" />
			<div className="space-y-2">
				<Skeleton className="h-16 w-full rounded-md" />
				<Skeleton className="h-16 w-full rounded-md" />
			</div>
		</div>
	);
}

export function BlueprintAnalysisPanel({
	analysis,
	blockFeedback,
	isAnalyzing,
	error,
	onAnalyze,
}: BlueprintAnalysisPanelProps) {
	if (isAnalyzing) {
		return <BlueprintAnalysisSkeleton />;
	}

	if (!analysis) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
				<div className="rounded-full bg-muted p-4">
					<Sparkles className="h-6 w-6 text-muted-foreground" />
				</div>
				<div className="space-y-1">
					<p className="font-medium text-sm">Analyze your blueprint</p>
					<p className="text-muted-foreground text-xs">
						Get context quality scores and per-block feedback
					</p>
				</div>
				{error && <p className="text-destructive text-xs">{error}</p>}
				<Button size="sm" onClick={onAnalyze}>
					<Sparkles className="mr-1.5 h-3.5 w-3.5" />
					Analyze Blueprint
				</Button>
			</div>
		);
	}

	const overallScore = analysis.overallScore ?? 0;

	const radarData: BlueprintRadarDataPoint[] = BLUEPRINT_DIMENSIONS.map(
		(d) => ({
			dimension: d.label,
			score: (analysis[d.key] as number) ?? 0,
			fullMark: 100,
		}),
	);

	return (
		<ScrollArea className="h-full">
			<div className="space-y-6 p-4">
				{/* Header with score + re-analyze */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Badge
							variant="secondary"
							className={cn(
								"px-2.5 py-1 font-bold text-lg",
								overallScoreBadgeColor(overallScore),
							)}
						>
							{overallScore}
						</Badge>
						<div>
							<p className="font-medium text-sm">Overall Score</p>
							<p className="text-muted-foreground text-xs">
								{overallScore >= 70
									? "Good quality"
									: overallScore >= 40
										? "Needs improvement"
										: "Significant issues"}
							</p>
						</div>
					</div>
					<Button
						size="sm"
						variant="outline"
						onClick={onAnalyze}
						disabled={isAnalyzing}
					>
						{isAnalyzing ? (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						) : (
							<Sparkles className="mr-1.5 h-3.5 w-3.5" />
						)}
						Re-analyze
					</Button>
				</div>

				{error && <p className="text-destructive text-xs">{error}</p>}

				{/* Radar chart */}
				<BlueprintRadarChart data={radarData} />

				{/* Per-block feedback */}
				{blockFeedback.length > 0 && (
					<div className="space-y-2">
						<h4 className="font-medium text-sm">Block Feedback</h4>
						<div className="space-y-2">
							{blockFeedback.map((fb) => (
								<BlockFeedbackCard key={fb.slug} feedback={fb} />
							))}
						</div>
					</div>
				)}

				{/* Weaknesses and suggestions */}
				<WeaknessesList
					weaknesses={analysis.weaknesses ?? []}
					suggestions={analysis.suggestions ?? []}
				/>
			</div>
		</ScrollArea>
	);
}
