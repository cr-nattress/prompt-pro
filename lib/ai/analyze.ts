import { generateObject } from "ai";
import {
	buildPromptAnalysisUserMessage,
	PROMPT_ANALYSIS_SYSTEM,
} from "./prompts";
import { getModel } from "./provider";
import { type PromptAnalysisResult, promptAnalysisSchema } from "./schemas";

export async function analyzePrompt(
	templateText: string,
	metadata?: { name?: string; purpose?: string; description?: string },
): Promise<PromptAnalysisResult> {
	const { object } = await generateObject({
		model: getModel(),
		schema: promptAnalysisSchema,
		system: PROMPT_ANALYSIS_SYSTEM,
		prompt: buildPromptAnalysisUserMessage(templateText, metadata),
	});

	return object;
}
