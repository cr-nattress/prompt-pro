"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizardStore } from "@/stores/wizard-store";
import { ChipSelector } from "../chip-selector";
import { EducationTip } from "../education-tip";

const ROLE_PRESETS = [
	"Expert Developer",
	"Technical Writer",
	"Data Analyst",
	"Creative Writer",
	"Project Manager",
	"Teacher",
	"Consultant",
];

export function RoleStep() {
	const { stepData, updateStepData } = useWizardStore();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">
					What role should the AI assume?
				</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Define the persona or expertise the AI should embody.
				</p>
			</div>

			<EducationTip tip="Defining a clear role helps the AI adopt the right expertise and tone." />

			<div className="flex flex-col gap-2">
				<Label htmlFor="role-input">Role</Label>
				<Input
					id="role-input"
					placeholder="e.g. Senior Software Engineer"
					value={stepData.role}
					onChange={(e) => updateStepData({ role: e.target.value })}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label>Quick picks</Label>
				<ChipSelector
					options={ROLE_PRESETS}
					selected={stepData.role}
					onSelect={(value) => updateStepData({ role: value })}
				/>
			</div>
		</div>
	);
}
