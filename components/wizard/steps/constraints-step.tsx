"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizardStore } from "@/stores/wizard-store";
import { ChipSelector } from "../chip-selector";
import { EducationTip } from "../education-tip";

const CONSTRAINT_PRESETS = [
	"Keep it concise",
	"Include examples",
	"Cite sources",
	"Avoid jargon",
	"Use simple language",
];

const TONE_PRESETS = [
	"Professional",
	"Casual",
	"Academic",
	"Friendly",
	"Technical",
];

export function ConstraintsStep() {
	const { stepData, updateStepData } = useWizardStore();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">
					Any constraints or guidelines?
				</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Set boundaries and preferences for the AI&apos;s behavior.
				</p>
			</div>

			<EducationTip tip="Constraints help prevent unwanted behavior and keep responses focused." />

			<div className="flex flex-col gap-2">
				<Label>Guidelines</Label>
				<ChipSelector
					options={CONSTRAINT_PRESETS}
					selected={stepData.constraints}
					onSelect={(value) => updateStepData({ constraints: value })}
					multiple
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label>Tone</Label>
				<ChipSelector
					options={TONE_PRESETS}
					selected={stepData.tone}
					onSelect={(value) => updateStepData({ tone: value })}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="custom-constraints">Additional constraints</Label>
				<Textarea
					id="custom-constraints"
					placeholder="e.g. Always explain your reasoning before giving the answer"
					value={stepData.customConstraints}
					onChange={(e) =>
						updateStepData({ customConstraints: e.target.value })
					}
					rows={3}
				/>
			</div>
		</div>
	);
}
