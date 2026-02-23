"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	analyzePromptAction,
	enhancePromptAction,
} from "@/app/(dashboard)/prompts/analysis-actions";
import { completeOnboardingAction } from "@/app/(onboarding)/onboarding/actions";
import {
	AnalysisRadarChart,
	type RadarDataPoint,
} from "@/components/prompt/analysis/analysis-radar-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Analysis } from "@/lib/db/schema";
import { useOnboardingStore } from "@/stores/onboarding-store";

const RADAR_DIMENSIONS: { key: keyof Analysis; label: string }[] = [
	{ key: "clarity", label: "Clarity" },
	{ key: "specificity", label: "Specificity" },
	{ key: "roleDefinition", label: "Role" },
	{ key: "constraintQuality", label: "Constraints" },
	{ key: "outputFormatting", label: "Output" },
	{ key: "tokenEfficiency", label: "Efficiency" },
];

export function FirstAnalysisStep() {
	const router = useRouter();
	const { createdPromptId, assembledPrompt } = useOnboardingStore();
	const [analysis, setAnalysis] = useState<Analysis | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(true);
	const [isEnhancing, setIsEnhancing] = useState(false);
	const [isCompleting, setIsCompleting] = useState(false);

	const runAnalysis = useCallback(async () => {
		if (!createdPromptId || !assembledPrompt) return;
		setIsAnalyzing(true);
		try {
			const result = await analyzePromptAction(
				createdPromptId,
				assembledPrompt,
			);
			if (result.success) {
				setAnalysis(result.data);
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to analyze prompt");
		} finally {
			setIsAnalyzing(false);
		}
	}, [createdPromptId, assembledPrompt]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
	useEffect(() => {
		runAnalysis();
	}, []);

	const handleEnhance = async () => {
		if (!analysis) return;
		setIsEnhancing(true);
		try {
			const result = await enhancePromptAction(
				createdPromptId,
				assembledPrompt,
				analysis.weaknesses ?? undefined,
				analysis.suggestions ?? undefined,
			);
			if (result.success) {
				toast.success("Prompt enhanced! You can review it on the detail page.");
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to enhance prompt");
		} finally {
			setIsEnhancing(false);
		}
	};

	const handleGoToDashboard = async () => {
		setIsCompleting(true);
		try {
			await completeOnboardingAction();
			router.push("/dashboard");
		} catch {
			toast.error("Failed to complete onboarding");
			setIsCompleting(false);
		}
	};

	const radarData: RadarDataPoint[] = analysis
		? RADAR_DIMENSIONS.map((d) => ({
				dimension: d.label,
				score: (analysis[d.key] as number) ?? 0,
				fullMark: 100 as const,
			}))
		: [];

	const topSuggestions = analysis?.suggestions?.slice(0, 3) ?? [];

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h2 className="font-semibold text-xl">Your prompt analysis</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					See how your prompt scores and get improvement suggestions.
				</p>
			</div>

			{isAnalyzing ? (
				<div className="flex flex-col items-center gap-4 py-8">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					<p className="text-muted-foreground text-sm">
						Analyzing your prompt...
					</p>
					<Skeleton className="h-[250px] w-[250px] rounded" />
				</div>
			) : analysis ? (
				<>
					<div className="flex items-center justify-center gap-3">
						<Badge
							variant={
								(analysis.overallScore ?? 0) >= 70 ? "default" : "secondary"
							}
							className="text-lg"
						>
							Score: {analysis.overallScore ?? 0}/100
						</Badge>
					</div>

					<AnalysisRadarChart data={radarData} />

					{topSuggestions.length > 0 && (
						<div className="flex flex-col gap-2">
							<p className="font-medium text-sm">Top suggestions:</p>
							<ul className="flex flex-col gap-1">
								{topSuggestions.map((suggestion) => (
									<li
										key={suggestion}
										className="text-muted-foreground text-sm"
									>
										&bull; {suggestion}
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="flex flex-wrap justify-center gap-3">
						<Button
							variant="outline"
							onClick={handleEnhance}
							disabled={isEnhancing}
						>
							{isEnhancing ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Sparkles className="mr-2 h-4 w-4" />
							)}
							Apply Top Suggestion
						</Button>
						<Button onClick={handleGoToDashboard} disabled={isCompleting}>
							{isCompleting ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								"Go to Dashboard"
							)}
						</Button>
					</div>
				</>
			) : (
				<div className="py-8 text-center">
					<p className="text-muted-foreground">
						Analysis unavailable. You can still continue to your dashboard.
					</p>
					<Button onClick={handleGoToDashboard} className="mt-4">
						Go to Dashboard
					</Button>
				</div>
			)}
		</div>
	);
}
