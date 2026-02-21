import { create } from "zustand";
import type { Analysis } from "@/lib/db/schema";

interface AnalysisState {
	analysis: Analysis | null;
	isAnalyzing: boolean;
	isEnhancing: boolean;
	enhancedText: string | null;
	changesSummary: string[];
	error: string | null;
	setAnalysis: (analysis: Analysis | null) => void;
	setAnalyzing: (analyzing: boolean) => void;
	setEnhancing: (enhancing: boolean) => void;
	setEnhancedText: (text: string | null, changes: string[]) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
	analysis: null,
	isAnalyzing: false,
	isEnhancing: false,
	enhancedText: null,
	changesSummary: [],
	error: null,
	setAnalysis: (analysis) => set({ analysis, error: null }),
	setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
	setEnhancing: (isEnhancing) => set({ isEnhancing }),
	setEnhancedText: (enhancedText, changesSummary) =>
		set({ enhancedText, changesSummary }),
	setError: (error) => set({ error }),
	reset: () =>
		set({
			analysis: null,
			isAnalyzing: false,
			isEnhancing: false,
			enhancedText: null,
			changesSummary: [],
			error: null,
		}),
}));
