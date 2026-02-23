"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createPromptAction } from "@/app/(dashboard)/prompts/actions";
import { getOrCreateDefaultAppAction } from "@/app/(dashboard)/prompts/wizard-actions";
import PromptEditor from "@/components/prompt/editor/prompt-editor";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { slugify } from "@/lib/prompt-utils";
import {
	buildPromptFromWizard,
	buildPromptName,
} from "@/lib/wizard-prompt-builder";
import { useWizardStore } from "@/stores/wizard-store";
import { StepIndicator } from "./step-indicator";
import { ConstraintsStep } from "./steps/constraints-step";
import { InputStep } from "./steps/input-step";
import { OutputStep } from "./steps/output-step";
import { ReviewStep } from "./steps/review-step";
import { RoleStep } from "./steps/role-step";
import { TaskStep } from "./steps/task-step";

const STEP_LABELS = [
	"Role",
	"Task",
	"Input",
	"Output",
	"Constraints",
	"Review",
];

export function GuidedBuilder() {
	const router = useRouter();
	const { currentStep, stepData, nextStep, prevStep, reset } = useWizardStore();
	const [isSaving, setIsSaving] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [templateText, setTemplateText] = useState("");

	const previewText = buildPromptFromWizard(stepData);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional cleanup-only effect
	useEffect(() => {
		return () => {
			reset();
		};
	}, []);

	const handleSave = useCallback(
		async (analyze: boolean) => {
			setIsSaving(true);
			try {
				const appResult = await getOrCreateDefaultAppAction();
				if (!appResult.success) {
					toast.error(appResult.error);
					return;
				}

				const name = buildPromptName(stepData);
				const slug = slugify(name);
				const text = templateText || previewText;

				const result = await createPromptAction({
					name,
					slug,
					appId: appResult.data.id,
					templateText: text,
					changeNote: "Created with Guided Builder",
				});

				if (!result.success) {
					toast.error(result.error);
					return;
				}

				toast.success("Prompt created!");
				if (analyze) {
					router.push(`/prompts/${result.data.slug}?tab=analysis`);
				} else {
					router.push(`/prompts/${result.data.slug}`);
				}
			} catch {
				toast.error("Failed to save prompt");
			} finally {
				setIsSaving(false);
			}
		},
		[stepData, templateText, previewText, router],
	);

	const canProceed =
		currentStep === 0
			? stepData.role.length > 0
			: currentStep === 1
				? stepData.task.length > 0
				: true;

	const stepContent = (() => {
		switch (currentStep) {
			case 0:
				return <RoleStep />;
			case 1:
				return <TaskStep />;
			case 2:
				return <InputStep />;
			case 3:
				return <OutputStep />;
			case 4:
				return <ConstraintsStep />;
			case 5:
				return (
					<ReviewStep
						isSaving={isSaving}
						onSave={() => handleSave(false)}
						onSaveAndAnalyze={() => handleSave(true)}
						onTemplateChange={setTemplateText}
						templateText={templateText}
					/>
				);
			default:
				return null;
		}
	})();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-center">
				<StepIndicator
					currentStep={currentStep}
					totalSteps={STEP_LABELS.length}
					labels={STEP_LABELS}
				/>
			</div>

			{/* Desktop: side-by-side panels */}
			<div className="hidden md:block">
				<ResizablePanelGroup
					orientation="horizontal"
					className="min-h-[500px] rounded-lg border"
				>
					<ResizablePanel defaultSize={55} minSize={35}>
						<div className="h-full overflow-auto p-6">{stepContent}</div>
					</ResizablePanel>
					{currentStep < 5 && (
						<>
							<ResizableHandle withHandle />
							<ResizablePanel defaultSize={45} minSize={25}>
								<div className="flex h-full flex-col">
									<div className="border-b px-4 py-2">
										<span className="font-medium text-muted-foreground text-sm">
											Live Preview
										</span>
									</div>
									<div className="flex-1">
										<PromptEditor value={previewText} readOnly />
									</div>
								</div>
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>

			{/* Mobile: stacked with collapsible preview */}
			<div className="md:hidden">
				<div className="rounded-lg border p-4">{stepContent}</div>
				{currentStep < 5 && previewText && (
					<Collapsible
						open={previewOpen}
						onOpenChange={setPreviewOpen}
						className="mt-4"
					>
						<CollapsibleTrigger asChild>
							<Button variant="outline" size="sm" className="w-full">
								{previewOpen ? "Hide Preview" : "Show Preview"}
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-2">
							<div className="h-[200px] rounded-lg border">
								<PromptEditor value={previewText} readOnly />
							</div>
						</CollapsibleContent>
					</Collapsible>
				)}
			</div>

			{/* Navigation */}
			{currentStep < 5 && (
				<div className="flex justify-between">
					<Button
						variant="outline"
						onClick={prevStep}
						disabled={currentStep === 0}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<Button onClick={nextStep} disabled={!canProceed}>
						Next
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			)}
			{currentStep === 5 && (
				<div className="flex justify-start">
					<Button variant="outline" onClick={prevStep}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</div>
			)}
		</div>
	);
}
