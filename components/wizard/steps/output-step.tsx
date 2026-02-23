"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizardStore } from "@/stores/wizard-store";
import { ChipSelector } from "../chip-selector";
import { EducationTip } from "../education-tip";

const OUTPUT_PRESETS = [
	"Markdown",
	"JSON",
	"Plain text",
	"Bullet points",
	"Table",
	"Code",
	"Step-by-step",
];

export function OutputStep() {
	const { stepData, updateStepData } = useWizardStore();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">
					What format should the output be?
				</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Specify the desired output format for the AI&apos;s response.
				</p>
			</div>

			<EducationTip tip="Specifying output format reduces ambiguity and ensures consistent, usable results." />

			<div className="flex flex-col gap-2">
				<Label htmlFor="output-format">Output description</Label>
				<Textarea
					id="output-format"
					placeholder="e.g. A numbered list of issues with severity and suggested fixes"
					value={stepData.outputFormat}
					onChange={(e) => updateStepData({ outputFormat: e.target.value })}
					rows={3}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label>Quick picks</Label>
				<ChipSelector
					options={OUTPUT_PRESETS}
					selected={stepData.outputFormat}
					onSelect={(value) => updateStepData({ outputFormat: value })}
				/>
			</div>
		</div>
	);
}
