export interface FieldHint {
	id: string;
	field: string;
	hint: string;
	learnMoreSlug: string | null;
}

export const PROMPT_FIELD_HINTS: FieldHint[] = [
	{
		id: "prompt-purpose",
		field: "Purpose",
		hint: "Setting a purpose helps the analysis engine give targeted feedback and lets you filter prompts by intent.",
		learnMoreSlug: "output-format-specification",
	},
	{
		id: "prompt-llm",
		field: "LLM Target",
		hint: "Different models respond differently to the same prompt. Specifying a target LLM enables model-specific analysis and optimization tips.",
		learnMoreSlug: null,
	},
	{
		id: "prompt-tags",
		field: "Tags",
		hint: "Tags help you organize and search prompts. Use descriptive tags like 'code-review', 'summarization', or 'customer-support'.",
		learnMoreSlug: null,
	},
	{
		id: "prompt-parameters",
		field: "Parameters",
		hint: "Parameters make prompts reusable by defining placeholders like {{language}} or {{topic}} that get filled in at runtime.",
		learnMoreSlug: null,
	},
	{
		id: "prompt-template",
		field: "Template Text",
		hint: "This is your actual prompt. Use clear structure, specific instructions, and consider adding examples for better results.",
		learnMoreSlug: "few-shot-prompting",
	},
];

export const BLUEPRINT_FIELD_HINTS: FieldHint[] = [
	{
		id: "blueprint-token-budget",
		field: "Token Budget",
		hint: "The token budget sets the maximum context size. Staying within budget ensures your prompt fits the model's context window.",
		learnMoreSlug: "tokens",
	},
	{
		id: "blueprint-block-type",
		field: "Block Type",
		hint: "Block types (system, knowledge, example, instruction) determine how content is structured in the final context.",
		learnMoreSlug: null,
	},
	{
		id: "blueprint-grounding",
		field: "Grounding Instructions",
		hint: "Grounding tells the LLM how to use attached knowledge — without it, reference material is like books without a syllabus.",
		learnMoreSlug: "the-groundless-reference",
	},
	{
		id: "blueprint-conditional",
		field: "Conditional",
		hint: "Conditionals let blocks appear or hide based on parameters, making blueprints dynamic and context-aware.",
		learnMoreSlug: null,
	},
	{
		id: "blueprint-priority",
		field: "Priority",
		hint: "When content exceeds the token budget, lower-priority blocks are trimmed first. Set priorities to protect critical instructions.",
		learnMoreSlug: "one-priority-fits-all",
	},
];

export function getFieldHint(id: string): FieldHint | undefined {
	return [...PROMPT_FIELD_HINTS, ...BLUEPRINT_FIELD_HINTS].find(
		(h) => h.id === id,
	);
}
