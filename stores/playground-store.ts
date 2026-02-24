import { create } from "zustand";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

export interface PlaygroundRunResult {
	id: string;
	resolvedText: string;
	parameters: Record<string, string>;
	modelId: string;
	responseText: string;
	inputTokens: number;
	outputTokens: number;
	latencyMs: number;
	status: "running" | "completed" | "error";
	error?: string | undefined;
	createdAt: Date;
}

interface PlaygroundState {
	/** Source selection */
	sourceType: "raw" | "prompt" | "blueprint";
	promptId: string | null;
	promptVersionId: string | null;
	blueprintId: string | null;

	/** Editor content */
	rawText: string;
	resolvedText: string;
	parameters: Record<string, string>;

	/** Model settings */
	modelId: string;
	temperature: number;
	maxTokens: number;

	/** Run state */
	isRunning: boolean;
	streamingText: string;
	runs: PlaygroundRunResult[];

	/** A/B mode */
	abMode: boolean;
	abModelId: string;
	abStreamingText: string;
	abIsRunning: boolean;

	/** Actions */
	setSourceType: (type: "raw" | "prompt" | "blueprint") => void;
	setPromptId: (id: string | null) => void;
	setPromptVersionId: (id: string | null) => void;
	setBlueprintId: (id: string | null) => void;
	setRawText: (text: string) => void;
	setResolvedText: (text: string) => void;
	setParameter: (key: string, value: string) => void;
	setParameters: (params: Record<string, string>) => void;
	setModelId: (id: string) => void;
	setTemperature: (temp: number) => void;
	setMaxTokens: (tokens: number) => void;
	setRunning: (running: boolean) => void;
	setStreamingText: (text: string) => void;
	appendStreamingText: (chunk: string) => void;
	addRun: (run: PlaygroundRunResult) => void;
	updateRun: (
		id: string,
		updates: Partial<
			Pick<
				PlaygroundRunResult,
				| "responseText"
				| "inputTokens"
				| "outputTokens"
				| "latencyMs"
				| "status"
				| "error"
			>
		>,
	) => void;
	setAbMode: (enabled: boolean) => void;
	setAbModelId: (id: string) => void;
	setAbStreamingText: (text: string) => void;
	appendAbStreamingText: (chunk: string) => void;
	setAbRunning: (running: boolean) => void;
	reset: () => void;
}

const initialState = {
	sourceType: "raw" as const,
	promptId: null,
	promptVersionId: null,
	blueprintId: null,
	rawText: "",
	resolvedText: "",
	parameters: {} as Record<string, string>,
	modelId: DEFAULT_MODEL_ID,
	temperature: 1.0,
	maxTokens: 4096,
	isRunning: false,
	streamingText: "",
	runs: [] as PlaygroundRunResult[],
	abMode: false,
	abModelId: "claude-haiku-4-5-20251001",
	abStreamingText: "",
	abIsRunning: false,
};

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
	...initialState,
	setSourceType: (sourceType) => set({ sourceType }),
	setPromptId: (promptId) => set({ promptId }),
	setPromptVersionId: (promptVersionId) => set({ promptVersionId }),
	setBlueprintId: (blueprintId) => set({ blueprintId }),
	setRawText: (rawText) => set({ rawText }),
	setResolvedText: (resolvedText) => set({ resolvedText }),
	setParameter: (key, value) =>
		set((state) => ({
			parameters: { ...state.parameters, [key]: value },
		})),
	setParameters: (parameters) => set({ parameters }),
	setModelId: (modelId) => set({ modelId }),
	setTemperature: (temperature) => set({ temperature }),
	setMaxTokens: (maxTokens) => set({ maxTokens }),
	setRunning: (isRunning) => set({ isRunning }),
	setStreamingText: (streamingText) => set({ streamingText }),
	appendStreamingText: (chunk) =>
		set((state) => ({ streamingText: state.streamingText + chunk })),
	addRun: (run) =>
		set((state) => ({ runs: [run, ...state.runs].slice(0, 50) })),
	updateRun: (id, updates) =>
		set((state) => ({
			runs: state.runs.map((r) => (r.id === id ? { ...r, ...updates } : r)),
		})),
	setAbMode: (abMode) => set({ abMode }),
	setAbModelId: (abModelId) => set({ abModelId }),
	setAbStreamingText: (abStreamingText) => set({ abStreamingText }),
	appendAbStreamingText: (chunk) =>
		set((state) => ({ abStreamingText: state.abStreamingText + chunk })),
	setAbRunning: (abIsRunning) => set({ abIsRunning }),
	reset: () => set(initialState),
}));
