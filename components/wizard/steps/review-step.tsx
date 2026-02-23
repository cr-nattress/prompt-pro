"use client";

import { Loader2, Save, Sparkles } from "lucide-react";
import PromptEditor from "@/components/prompt/editor/prompt-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPromptFromWizard } from "@/lib/wizard-prompt-builder";
import { useWizardStore } from "@/stores/wizard-store";

interface ReviewStepProps {
	isSaving: boolean;
	onSave: () => void;
	onSaveAndAnalyze: () => void;
	onTemplateChange: (text: string) => void;
	templateText: string;
}

export function ReviewStep({
	isSaving,
	onSave,
	onSaveAndAnalyze,
	onTemplateChange,
	templateText,
}: ReviewStepProps) {
	const { stepData } = useWizardStore();
	const builtText = buildPromptFromWizard(stepData);

	// Sync built text on first render if template hasn't been customized
	if (!templateText && builtText) {
		onTemplateChange(builtText);
	}

	const summaryItems = [
		{ label: "Role", value: stepData.role },
		{ label: "Task", value: stepData.task },
		{ label: "Input", value: stepData.inputType },
		{ label: "Output", value: stepData.outputFormat },
		{ label: "Tone", value: stepData.tone },
	].filter((item) => item.value);

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">Review your prompt</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Edit the generated prompt or save it as-is.
				</p>
			</div>

			{summaryItems.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{summaryItems.map((item) => (
						<Badge key={item.label} variant="secondary">
							{item.label}: {item.value}
						</Badge>
					))}
					{stepData.constraints.length > 0 && (
						<Badge variant="secondary">
							{stepData.constraints.length} constraint
							{stepData.constraints.length !== 1 ? "s" : ""}
						</Badge>
					)}
				</div>
			)}

			<div className="h-[300px]">
				<PromptEditor value={templateText} onChange={onTemplateChange} />
			</div>

			<div className="flex gap-3">
				<Button onClick={onSave} disabled={isSaving || !templateText}>
					{isSaving ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Save className="mr-2 h-4 w-4" />
					)}
					Save
				</Button>
				<Button
					variant="outline"
					onClick={onSaveAndAnalyze}
					disabled={isSaving || !templateText}
				>
					{isSaving ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Sparkles className="mr-2 h-4 w-4" />
					)}
					Save & Analyze
				</Button>
			</div>
		</div>
	);
}
