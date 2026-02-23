"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizardStore } from "@/stores/wizard-store";
import { ChipSelector } from "../chip-selector";
import { EducationTip } from "../education-tip";

const INPUT_PRESETS = [
	"Code snippet",
	"Document text",
	"CSV data",
	"JSON",
	"Free text",
	"URL",
];

export function InputStep() {
	const { stepData, updateStepData } = useWizardStore();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">What input will you provide?</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Describe the type of data the AI will receive.
				</p>
			</div>

			<EducationTip tip="Describing the input type helps the AI understand how to parse and process your data." />

			<div className="flex flex-col gap-2">
				<Label htmlFor="input-type">Input description</Label>
				<Textarea
					id="input-type"
					placeholder="e.g. A TypeScript function with potential bugs"
					value={stepData.inputType}
					onChange={(e) => updateStepData({ inputType: e.target.value })}
					rows={3}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label>Quick picks</Label>
				<ChipSelector
					options={INPUT_PRESETS}
					selected={stepData.inputType}
					onSelect={(value) => updateStepData({ inputType: value })}
				/>
			</div>
		</div>
	);
}
