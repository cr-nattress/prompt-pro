import { create } from "zustand";

interface OnboardingState {
	currentStep: number;
	workspaceName: string;
	useCases: string[];
	promptRole: string;
	promptTask: string;
	promptOutput: string;
	assembledPrompt: string;
	createdPromptId: string;
	setStep: (step: number) => void;
	nextStep: () => void;
	setWorkspaceName: (name: string) => void;
	setUseCases: (cases: string[]) => void;
	setPromptRole: (role: string) => void;
	setPromptTask: (task: string) => void;
	setPromptOutput: (output: string) => void;
	setAssembledPrompt: (prompt: string) => void;
	setCreatedPromptId: (id: string) => void;
	reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
	currentStep: 0,
	workspaceName: "",
	useCases: [],
	promptRole: "",
	promptTask: "",
	promptOutput: "",
	assembledPrompt: "",
	createdPromptId: "",
	setStep: (currentStep) => set({ currentStep }),
	nextStep: () =>
		set((state) => ({ currentStep: Math.min(state.currentStep + 1, 2) })),
	setWorkspaceName: (workspaceName) => set({ workspaceName }),
	setUseCases: (useCases) => set({ useCases }),
	setPromptRole: (promptRole) => set({ promptRole }),
	setPromptTask: (promptTask) => set({ promptTask }),
	setPromptOutput: (promptOutput) => set({ promptOutput }),
	setAssembledPrompt: (assembledPrompt) => set({ assembledPrompt }),
	setCreatedPromptId: (createdPromptId) => set({ createdPromptId }),
	reset: () =>
		set({
			currentStep: 0,
			workspaceName: "",
			useCases: [],
			promptRole: "",
			promptTask: "",
			promptOutput: "",
			assembledPrompt: "",
			createdPromptId: "",
		}),
}));
