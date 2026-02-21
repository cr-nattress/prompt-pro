import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "@/lib/env";

const DEFAULT_MODEL_ID = "claude-sonnet-4-20250514";

let anthropicInstance: ReturnType<typeof createAnthropic> | null = null;

function getAnthropicProvider() {
	if (!anthropicInstance) {
		anthropicInstance = createAnthropic({
			apiKey: env.ANTHROPIC_API_KEY,
		});
	}
	return anthropicInstance;
}

export function getModel(modelId: string = DEFAULT_MODEL_ID) {
	return getAnthropicProvider()(modelId);
}
