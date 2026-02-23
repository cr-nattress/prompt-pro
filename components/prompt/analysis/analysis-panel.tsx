"use client";

import { GraduationCap, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Analysis } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import {
	AnalysisRadarChart,
	type RadarDataPoint,
} from "./analysis-radar-chart";
import { AnalysisSkeleton } from "./analysis-skeleton";
import { ScoreBreakdown } from "./score-breakdown";
import { WeaknessesList } from "./weaknesses-list";

interface AnalysisPanelProps {
	analysis: Analysis | null;
	isAnalyzing: boolean;
	isEnhancing: boolean;
	isExpertRewriting: boolean;
	error: string | null;
	onAnalyze: () => void;
	onEnhance: () => void;
	onExpertRewrite: () => void;
	onAppendSuggestion?: (text: string) => void;
}

const PRIMARY_DIMENSIONS: Array<{
	key: keyof Analysis;
	label: string;
	radarLabel: string;
}> = [
	{ key: "clarity", label: "Clarity", radarLabel: "Clarity" },
	{ key: "specificity", label: "Specificity", radarLabel: "Specificity" },
	{
		key: "constraintQuality",
		label: "Completeness",
		radarLabel: "Completeness",
	},
	{ key: "roleDefinition", label: "Structure", radarLabel: "Structure" },
	{ key: "errorHandling", label: "Robustness", radarLabel: "Robustness" },
	{ key: "tokenEfficiency", label: "Efficiency", radarLabel: "Efficiency" },
];

const DETAILED_DIMENSIONS: Array<{ key: keyof Analysis; label: string }> = [
	{ key: "contextAdequacy", label: "Context Adequacy" },
	{ key: "exampleUsage", label: "Example Usage" },
	{ key: "outputFormatting", label: "Output Formatting" },
	{ key: "safetyAlignment", label: "Safety Alignment" },
	{ key: "taskDecomposition", label: "Task Decomposition" },
	{ key: "creativityScope", label: "Creativity Scope" },
];

function overallScoreBadgeColor(score: number): string {
	if (score >= 70)
		return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
	if (score >= 40)
		return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
	return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

export function AnalysisPanel({
	analysis,
	isAnalyzing,
	isEnhancing,
	isExpertRewriting,
	error,
	onAnalyze,
	onEnhance,
	onExpertRewrite,
	onAppendSuggestion,
}: AnalysisPanelProps) {
	if (isAnalyzing) {
		return <AnalysisSkeleton />;
	}

	if (!analysis) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
				<div className="rounded-full bg-muted p-4">
					<Sparkles className="h-6 w-6 text-muted-foreground" />
				</div>
				<div className="space-y-1">
					<p className="font-medium text-sm">Analyze your prompt</p>
					<p className="text-muted-foreground text-xs">
						Get AI-powered scoring, feedback, and improvement suggestions
					</p>
				</div>
				{error && <p className="text-destructive text-xs">{error}</p>}
				<Button size="sm" onClick={onAnalyze}>
					<Sparkles className="mr-1.5 h-3.5 w-3.5" />
					Analyze
				</Button>
			</div>
		);
	}

	const overallScore = analysis.overallScore ?? 0;

	const radarData: RadarDataPoint[] = PRIMARY_DIMENSIONS.map((d) => ({
		dimension: d.radarLabel,
		score: (analysis[d.key] as number) ?? 0,
		fullMark: 100,
	}));

	const primaryScores = PRIMARY_DIMENSIONS.map((d) => ({
		label: d.label,
		score: (analysis[d.key] as number) ?? 0,
	}));

	const detailedScores = DETAILED_DIMENSIONS.map((d) => ({
		label: d.label,
		score: (analysis[d.key] as number) ?? 0,
	}));

	return (
		<ScrollArea className="h-full">
			<div className="space-y-6 p-4">
				{/* Action bar */}
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
					<div className="flex gap-1.5">
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
						<Button size="sm" onClick={onEnhance} disabled={isEnhancing}>
							{isEnhancing ? (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							) : (
								<Wand2 className="mr-1.5 h-3.5 w-3.5" />
							)}
							Enhance
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={onExpertRewrite}
							disabled={isExpertRewriting}
						>
							{isExpertRewriting ? (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							) : (
								<GraduationCap className="mr-1.5 h-3.5 w-3.5" />
							)}
							Expert View
						</Button>
					</div>
				</div>

				{error && <p className="text-destructive text-xs">{error}</p>}

				{/* Radar chart */}
				<AnalysisRadarChart data={radarData} />

				{/* Score breakdown */}
				<ScoreBreakdown
					primaryScores={primaryScores}
					detailedScores={detailedScores}
				/>

				{/* Weaknesses and suggestions */}
				<WeaknessesList
					weaknesses={analysis.weaknesses ?? []}
					suggestions={analysis.suggestions ?? []}
					onAppendSuggestion={onAppendSuggestion}
				/>
			</div>
		</ScrollArea>
	);
}
