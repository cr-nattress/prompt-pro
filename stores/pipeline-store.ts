import { create } from "zustand";
import type {
	PipelineStep,
	PipelineStepResult,
} from "@/lib/pipelines/pipeline-types";

interface PipelineState {
	steps: PipelineStep[];
	isRunning: boolean;
	runResults: PipelineStepResult[];
	totalTokens: number;
	totalLatencyMs: number;

	// CRUD actions
	setSteps: (steps: PipelineStep[]) => void;
	addStep: (step: PipelineStep) => void;
	updateStep: (stepId: string, data: Partial<PipelineStep>) => void;
	removeStep: (stepId: string) => void;
	reorderSteps: (fromIndex: number, toIndex: number) => void;

	// Run state
	setRunning: (isRunning: boolean) => void;
	setRunResults: (
		results: PipelineStepResult[],
		totalTokens: number,
		totalLatencyMs: number,
	) => void;
	clearResults: () => void;
	reset: () => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
	steps: [],
	isRunning: false,
	runResults: [],
	totalTokens: 0,
	totalLatencyMs: 0,

	setSteps: (steps) => set({ steps }),

	addStep: (step) => set((state) => ({ steps: [...state.steps, step] })),

	updateStep: (stepId, data) =>
		set((state) => ({
			steps: state.steps.map((s) => (s.id === stepId ? { ...s, ...data } : s)),
		})),

	removeStep: (stepId) =>
		set((state) => ({
			steps: state.steps
				.filter((s) => s.id !== stepId)
				.map((s, i) => ({ ...s, position: i })),
		})),

	reorderSteps: (fromIndex, toIndex) =>
		set((state) => {
			const newSteps = [...state.steps];
			const [moved] = newSteps.splice(fromIndex, 1);
			if (moved) {
				newSteps.splice(toIndex, 0, moved);
			}
			return {
				steps: newSteps.map((s, i) => ({ ...s, position: i })),
			};
		}),

	setRunning: (isRunning) => set({ isRunning }),

	setRunResults: (results, totalTokens, totalLatencyMs) =>
		set({ runResults: results, totalTokens, totalLatencyMs }),

	clearResults: () =>
		set({ runResults: [], totalTokens: 0, totalLatencyMs: 0 }),

	reset: () =>
		set({
			steps: [],
			isRunning: false,
			runResults: [],
			totalTokens: 0,
			totalLatencyMs: 0,
		}),
}));
