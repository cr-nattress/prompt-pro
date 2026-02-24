import type { TiktokenModel } from "js-tiktoken";
import { encodingForModel } from "js-tiktoken";

let cachedEncoder: {
	model: string;
	enc: ReturnType<typeof encodingForModel>;
} | null = null;

function getEncoder(model: TiktokenModel) {
	if (cachedEncoder?.model === model) return cachedEncoder.enc;

	const enc = encodingForModel(model);
	cachedEncoder = { model, enc };
	return enc;
}

export function countTokens(
	text: string,
	model: TiktokenModel = "gpt-4o",
): number {
	try {
		const enc = getEncoder(model);
		return enc.encode(text).length;
	} catch {
		// Fallback: rough estimate (1 token ≈ 4 chars)
		return Math.ceil(text.length / 4);
	}
}

// Cost per 1M tokens (input) — approximate
const COST_PER_MILLION: Record<string, number> = {
	"gpt-4o": 2.5,
	"gpt-4o-mini": 0.15,
	"gpt-4-turbo": 10,
	"gpt-4": 30,
	"gpt-3.5-turbo": 0.5,
	"claude-sonnet-4.6": 3,
	"claude-opus-4.6": 15,
	"claude-haiku-4.5": 0.8,
};

export function estimateCost(tokenCount: number, model: string): number {
	const costPerMillion = COST_PER_MILLION[model] ?? 2.5;
	return (tokenCount / 1_000_000) * costPerMillion;
}
