"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	createOnboardingPromptAction,
	updateWorkspaceNameAction,
} from "@/app/(onboarding)/onboarding/actions";
import { StepIndicator } from "@/components/wizard/step-indicator";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { FirstAnalysisStep } from "./first-analysis-step";
import { FirstPromptStep } from "./first-prompt-step";
import { WelcomeStep } from "./welcome-step";

const STEP_LABELS = ["Welcome", "First Prompt", "Analysis"];

interface OnboardingWizardProps {
	workspaceName: string;
}

export function OnboardingWizard({ workspaceName }: OnboardingWizardProps) {
	const store = useOnboardingStore();
	const [isCreating, setIsCreating] = useState(false);

	// Initialize workspace name from server
	// biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
	useEffect(() => {
		if (!store.workspaceName) {
			store.setWorkspaceName(workspaceName);
		}
		return () => {
			store.reset();
		};
	}, []);

	const handleWelcomeContinue = useCallback(async () => {
		if (store.workspaceName.trim() !== workspaceName) {
			const result = await updateWorkspaceNameAction(
				store.workspaceName.trim(),
			);
			if (!result.success) {
				toast.error(result.error);
				return;
			}
		}
		store.nextStep();
	}, [store, workspaceName]);

	const handlePromptContinue = useCallback(async () => {
		setIsCreating(true);
		try {
			const result = await createOnboardingPromptAction({
				role: store.promptRole,
				task: store.promptTask,
				output: store.promptOutput,
			});
			if (!result.success) {
				toast.error(result.error);
				return;
			}
			store.setCreatedPromptId(result.data.promptId);
			store.setAssembledPrompt(result.data.templateText);
			store.nextStep();
		} catch {
			toast.error("Failed to create prompt");
		} finally {
			setIsCreating(false);
		}
	}, [store]);

	return (
		<div className="flex flex-col gap-8 py-8">
			<div className="flex justify-center">
				<StepIndicator
					currentStep={store.currentStep}
					totalSteps={STEP_LABELS.length}
					labels={STEP_LABELS}
				/>
			</div>

			{store.currentStep === 0 && (
				<WelcomeStep onContinue={handleWelcomeContinue} />
			)}
			{store.currentStep === 1 && (
				<FirstPromptStep
					onContinue={handlePromptContinue}
					isCreating={isCreating}
				/>
			)}
			{store.currentStep === 2 && <FirstAnalysisStep />}
		</div>
	);
}
