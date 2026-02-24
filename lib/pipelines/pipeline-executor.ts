import { generateText } from "ai";
import { getModel } from "@/lib/ai/provider";
import type { PipelineStep, PipelineStepResult } from "./pipeline-types";

interface ExecutionResult {
	results: PipelineStepResult[];
	totalTokens: number;
	totalLatencyMs: number;
}

/**
 * Execute pipeline steps sequentially.
 * Step N can reference step N-1's output via `{{prev.output}}`.
 */
export async function executePipeline(
	steps: PipelineStep[],
	initialInput: string,
): Promise<ExecutionResult> {
	const results: PipelineStepResult[] = [];
	let totalTokens = 0;
	let totalLatencyMs = 0;
	let previousOutput = initialInput;

	for (const step of steps) {
		const startTime = Date.now();

		try {
			// Replace {{prev.output}} with the previous step's output
			const prompt = step.inputMapping
				? step.inputMapping.replace(/\{\{prev\.output\}\}/g, previousOutput)
				: previousOutput;

			const { text, usage } = await generateText({
				model: getModel(),
				prompt,
				maxOutputTokens: 4000,
			});

			const latencyMs = Date.now() - startTime;
			const tokens = (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0);

			totalTokens += tokens;
			totalLatencyMs += latencyMs;
			previousOutput = text;

			results.push({
				stepId: step.id,
				input: prompt.slice(0, 500),
				output: text,
				tokens,
				latencyMs,
				status: "success",
			});
		} catch (err) {
			const latencyMs = Date.now() - startTime;
			totalLatencyMs += latencyMs;

			results.push({
				stepId: step.id,
				input: step.inputMapping?.slice(0, 500) ?? previousOutput.slice(0, 500),
				output: "",
				tokens: 0,
				latencyMs,
				status: "error",
				error: err instanceof Error ? err.message : "Unknown error",
			});

			break; // Stop pipeline on error
		}
	}

	return { results, totalTokens, totalLatencyMs };
}
