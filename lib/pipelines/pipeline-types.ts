export interface PipelineStep {
	id: string;
	promptTemplateId: string;
	promptVersionId: string;
	promptName: string;
	label: string;
	inputMapping: string;
	position: number;
}

export interface PipelineStepResult {
	stepId: string;
	input: string;
	output: string;
	tokens: number;
	latencyMs: number;
	status: "success" | "error";
	error?: string | undefined;
}
