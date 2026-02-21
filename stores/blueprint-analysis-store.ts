import { create } from "zustand";
import type { BlockFeedback } from "@/lib/ai";
import type { Analysis } from "@/lib/db/schema";

interface BlueprintAnalysisState {
	analysis: Analysis | null;
	blockFeedback: BlockFeedback[];
	isAnalyzing: boolean;
	error: string | null;
	setAnalysis: (analysis: Analysis | null) => void;
	setBlockFeedback: (feedback: BlockFeedback[]) => void;
	setAnalyzing: (analyzing: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

export const useBlueprintAnalysisStore = create<BlueprintAnalysisState>(
	(set) => ({
		analysis: null,
		blockFeedback: [],
		isAnalyzing: false,
		error: null,
		setAnalysis: (analysis) => set({ analysis, error: null }),
		setBlockFeedback: (blockFeedback) => set({ blockFeedback }),
		setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
		setError: (error) => set({ error }),
		reset: () =>
			set({
				analysis: null,
				blockFeedback: [],
				isAnalyzing: false,
				error: null,
			}),
	}),
);
