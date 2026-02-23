import type { WizardStepData } from "@/stores/wizard-store";

export function buildPromptFromWizard(data: WizardStepData): string {
	const sections: string[] = [];

	if (data.role) {
		sections.push(`# Role\nYou are a ${data.role}.`);
	}

	if (data.task) {
		sections.push(`# Task\n${data.task}`);
	}

	if (data.inputType) {
		sections.push(`# Input\nThe user will provide: ${data.inputType}`);
	}

	if (data.outputFormat) {
		sections.push(`# Output Format\n${data.outputFormat}`);
	}

	const allConstraints: string[] = [];
	for (const c of data.constraints) {
		allConstraints.push(c);
	}
	if (data.customConstraints.trim()) {
		allConstraints.push(data.customConstraints.trim());
	}
	if (allConstraints.length > 0) {
		const list = allConstraints.map((c) => `- ${c}`).join("\n");
		sections.push(`# Constraints\n${list}`);
	}

	if (data.tone) {
		sections.push(`# Tone\nUse a ${data.tone.toLowerCase()} tone.`);
	}

	return sections.join("\n\n");
}

export function buildPromptName(data: WizardStepData): string {
	const parts: string[] = [];
	if (data.role) parts.push(data.role);
	if (data.task) {
		// Take first few words of the task
		const taskWords = data.task.split(/\s+/).slice(0, 4).join(" ");
		parts.push(taskWords);
	}
	if (parts.length === 0) return "Untitled Prompt";
	return parts.join(" — ");
}
