import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CoachMode = "active" | "subtle" | "off";

export interface CoachSuggestion {
	id: string;
	type:
		| "missing_element"
		| "technique"
		| "complexity"
		| "anti_pattern"
		| "model_fit"
		| "improvement";
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	snippet?: string | undefined;
}

interface CoachState {
	mode: CoachMode;
	suggestions: CoachSuggestion[];
	dismissedIds: Set<string>;
	isLoading: boolean;
	error: string | null;
	setMode: (mode: CoachMode) => void;
	setSuggestions: (suggestions: CoachSuggestion[]) => void;
	dismissSuggestion: (id: string) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

export const useCoachStore = create<CoachState>()(
	persist(
		(set) => ({
			mode: "active",
			suggestions: [],
			dismissedIds: new Set<string>(),
			isLoading: false,
			error: null,
			setMode: (mode) => set({ mode }),
			setSuggestions: (suggestions) =>
				set({ suggestions, isLoading: false, error: null }),
			dismissSuggestion: (id) =>
				set((state) => {
					const next = new Set(state.dismissedIds);
					next.add(id);
					return { dismissedIds: next };
				}),
			setLoading: (isLoading) => set({ isLoading }),
			setError: (error) => set({ error, isLoading: false }),
			reset: () =>
				set({
					suggestions: [],
					dismissedIds: new Set<string>(),
					isLoading: false,
					error: null,
				}),
		}),
		{
			name: "promptvault-coach-settings",
			partialize: (state) => ({ mode: state.mode }),
		},
	),
);
