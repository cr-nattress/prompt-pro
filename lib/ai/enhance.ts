import { generateObject } from "ai";
import { buildEnhanceUserMessage, ENHANCE_PROMPT_SYSTEM } from "./prompts";
import { getModel } from "./provider";
import { type EnhancePromptResult, enhancePromptSchema } from "./schemas";

export async function enhancePrompt(
	templateText: string,
	weaknesses?: string[],
	suggestions?: string[],
): Promise<EnhancePromptResult> {
	const { object } = await generateObject({
		model: getModel(),
		schema: enhancePromptSchema,
		system: ENHANCE_PROMPT_SYSTEM,
		prompt: buildEnhanceUserMessage(templateText, weaknesses, suggestions),
	});

	return object;
}
