/**
 * Supported model definitions for the playground.
 * Only Anthropic models are currently wired up (ANTHROPIC_API_KEY).
 * OpenAI / Google models are listed but marked unavailable.
 */

export interface ModelDefinition {
	id: string;
	name: string;
	provider: "anthropic" | "openai" | "google";
	available: boolean;
	inputCostPer1M: number;
	outputCostPer1M: number;
	maxOutputTokens: number;
}

export const PLAYGROUND_MODELS: ModelDefinition[] = [
	{
		id: "claude-sonnet-4-6-20250514",
		name: "Claude Sonnet 4.6",
		provider: "anthropic",
		available: true,
		inputCostPer1M: 3,
		outputCostPer1M: 15,
		maxOutputTokens: 16000,
	},
	{
		id: "claude-haiku-4-5-20251001",
		name: "Claude Haiku 4.5",
		provider: "anthropic",
		available: true,
		inputCostPer1M: 0.8,
		outputCostPer1M: 4,
		maxOutputTokens: 8192,
	},
	{
		id: "claude-opus-4-6-20250611",
		name: "Claude Opus 4.6",
		provider: "anthropic",
		available: true,
		inputCostPer1M: 15,
		outputCostPer1M: 75,
		maxOutputTokens: 32000,
	},
	{
		id: "gpt-4o",
		name: "GPT-4o",
		provider: "openai",
		available: false,
		inputCostPer1M: 2.5,
		outputCostPer1M: 10,
		maxOutputTokens: 16384,
	},
	{
		id: "gemini-2.0-flash",
		name: "Gemini 2.0 Flash",
		provider: "google",
		available: false,
		inputCostPer1M: 0.1,
		outputCostPer1M: 0.4,
		maxOutputTokens: 8192,
	},
];

export const DEFAULT_MODEL_ID = "claude-sonnet-4-6-20250514";

export function getModelDefinition(
	modelId: string,
): ModelDefinition | undefined {
	return PLAYGROUND_MODELS.find((m) => m.id === modelId);
}

export function getAvailableModels(): ModelDefinition[] {
	return PLAYGROUND_MODELS.filter((m) => m.available);
}
