import { z } from "zod";

const scoreField = z.number().int().min(0).max(100);

export const promptScoresSchema = z.object({
	clarity: scoreField.describe(
		"How clear and unambiguous the prompt instructions are",
	),
	specificity: scoreField.describe(
		"How specific and detailed the requirements are",
	),
	contextAdequacy: scoreField.describe(
		"Whether sufficient context is provided for the task",
	),
	roleDefinition: scoreField.describe(
		"How well the AI's role and persona are defined",
	),
	constraintQuality: scoreField.describe(
		"Quality and completeness of constraints and boundaries",
	),
	exampleUsage: scoreField.describe(
		"Presence and quality of examples or few-shot demonstrations",
	),
	errorHandling: scoreField.describe(
		"How well edge cases and error scenarios are addressed",
	),
	outputFormatting: scoreField.describe(
		"Clarity of expected output format and structure",
	),
	tokenEfficiency: scoreField.describe(
		"How efficiently the prompt uses tokens without unnecessary repetition",
	),
	safetyAlignment: scoreField.describe(
		"Presence of safety guardrails and alignment instructions",
	),
	taskDecomposition: scoreField.describe(
		"How well complex tasks are broken into steps",
	),
	creativityScope: scoreField.describe(
		"Appropriate balance of creative freedom vs constraints",
	),
});

export const promptAnalysisSchema = z.object({
	scores: promptScoresSchema,
	overallScore: scoreField.describe(
		"Weighted overall quality score considering all dimensions",
	),
	weaknesses: z
		.array(z.string())
		.describe("Key weaknesses or issues found in the prompt"),
	suggestions: z
		.array(z.string())
		.describe("Actionable suggestions for improving the prompt"),
});

export type PromptAnalysisResult = z.infer<typeof promptAnalysisSchema>;
export type PromptScores = z.infer<typeof promptScoresSchema>;

export const blueprintScoresSchema = z.object({
	sufficiency: scoreField.describe(
		"Whether the context blocks provide enough information for the target task",
	),
	relevance: scoreField.describe(
		"How relevant each block's content is to the overall goal",
	),
	grounding: scoreField.describe(
		"How well the context is grounded in facts, data, or domain knowledge",
	),
	coherence: scoreField.describe(
		"How well the blocks work together as a unified context",
	),
	placement: scoreField.describe(
		"Whether blocks are ordered optimally for LLM processing",
	),
	budgetEfficiency: scoreField.describe(
		"How efficiently the token budget is allocated across blocks",
	),
	adaptability: scoreField.describe(
		"How well the blueprint handles conditional/dynamic content",
	),
});

export const blockFeedbackSchema = z.object({
	slug: z.string().describe("The block's slug identifier"),
	name: z.string().describe("The block's display name"),
	score: scoreField.describe("Quality score for this specific block"),
	issues: z.array(z.string()).describe("Specific issues found in this block"),
});

export const blueprintAnalysisSchema = z.object({
	scores: blueprintScoresSchema,
	overallScore: scoreField.describe(
		"Weighted overall quality score for the blueprint",
	),
	weaknesses: z
		.array(z.string())
		.describe("Key weaknesses in the blueprint structure"),
	suggestions: z
		.array(z.string())
		.describe("Actionable suggestions for improving the blueprint"),
	blockFeedback: z
		.array(blockFeedbackSchema)
		.describe("Per-block quality assessment"),
});

export type BlueprintAnalysisResult = z.infer<typeof blueprintAnalysisSchema>;
export type BlueprintScores = z.infer<typeof blueprintScoresSchema>;
export type BlockFeedback = z.infer<typeof blockFeedbackSchema>;

export const enhancePromptSchema = z.object({
	enhancedText: z
		.string()
		.describe(
			"The improved prompt text preserving all {{parameters}} and original intent",
		),
	changesSummary: z
		.array(z.string())
		.describe("Brief description of each change made"),
});

export type EnhancePromptResult = z.infer<typeof enhancePromptSchema>;
