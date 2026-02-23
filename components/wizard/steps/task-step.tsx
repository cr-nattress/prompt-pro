"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizardStore } from "@/stores/wizard-store";
import { ChipSelector } from "../chip-selector";
import { EducationTip } from "../education-tip";

const TASK_PRESETS = [
	"Write",
	"Analyze",
	"Summarize",
	"Translate",
	"Review",
	"Generate",
	"Explain",
];

export function TaskStep() {
	const { stepData, updateStepData } = useWizardStore();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">
					What task should the AI perform?
				</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Describe the specific task or action you want completed.
				</p>
			</div>

			<EducationTip tip="Be specific about what you want. The more detail you provide, the better the results." />

			<div className="flex flex-col gap-2">
				<Label htmlFor="task-input">Task description</Label>
				<Textarea
					id="task-input"
					placeholder="e.g. Review code for bugs, performance issues, and style violations"
					value={stepData.task}
					onChange={(e) => updateStepData({ task: e.target.value })}
					rows={3}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label>Quick picks</Label>
				<ChipSelector
					options={TASK_PRESETS}
					selected={stepData.task}
					onSelect={(value) => updateStepData({ task: value })}
				/>
			</div>
		</div>
	);
}
