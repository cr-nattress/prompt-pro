import { create } from "zustand";

export interface WizardStepData {
	role: string;
	task: string;
	inputType: string;
	outputFormat: string;
	constraints: string[];
	tone: string;
	customConstraints: string;
}

const INITIAL_STEP_DATA: WizardStepData = {
	role: "",
	task: "",
	inputType: "",
	outputFormat: "",
	constraints: [],
	tone: "",
	customConstraints: "",
};

type WizardStepDataUpdate = {
	[K in keyof WizardStepData]?: WizardStepData[K] | undefined;
};

interface WizardState {
	currentStep: number;
	stepData: WizardStepData;
	setStep: (step: number) => void;
	nextStep: () => void;
	prevStep: () => void;
	updateStepData: (partial: WizardStepDataUpdate) => void;
	reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
	currentStep: 0,
	stepData: { ...INITIAL_STEP_DATA },
	setStep: (currentStep) => set({ currentStep }),
	nextStep: () =>
		set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
	prevStep: () =>
		set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
	updateStepData: (partial) =>
		set((state) => {
			const merged = { ...state.stepData };
			for (const key of Object.keys(partial) as (keyof WizardStepData)[]) {
				const value = partial[key];
				if (value !== undefined) {
					// biome-ignore lint/suspicious/noExplicitAny: safe narrowed assignment
					(merged as any)[key] = value;
				}
			}
			return { stepData: merged };
		}),
	reset: () => set({ currentStep: 0, stepData: { ...INITIAL_STEP_DATA } }),
}));
