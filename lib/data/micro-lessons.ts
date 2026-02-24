export interface MicroLesson {
	id: string;
	title: string;
	body: string;
	learnMoreSlug: string | null;
	category: "prompt" | "blueprint" | "general";
}

export const MICRO_LESSONS: MicroLesson[] = [
	{
		id: "no-output-format",
		title: "Define your output format",
		body: "Prompts with a defined output format produce more consistent results. Try specifying whether you want JSON, bullet points, markdown, or a specific structure.",
		learnMoreSlug: "output-format-specification",
		category: "prompt",
	},
	{
		id: "no-examples",
		title: "Try few-shot prompting",
		body: "Adding 1-3 examples of the input/output you expect can dramatically improve quality. This technique is called few-shot prompting.",
		learnMoreSlug: "few-shot-prompting",
		category: "prompt",
	},
	{
		id: "long-prompt",
		title: "Length isn't everything",
		body: "Long prompts aren't always better — specificity matters more than length. Focus on clear, precise instructions rather than adding more words.",
		learnMoreSlug: "the-kitchen-sink",
		category: "prompt",
	},
	{
		id: "low-specificity",
		title: "Be more specific",
		body: "Vague words like 'good', 'appropriate', or 'relevant' leave too much room for interpretation. Replace them with concrete criteria the model can follow.",
		learnMoreSlug: "the-vague-directive",
		category: "prompt",
	},
	{
		id: "first-blueprint",
		title: "Welcome to context engineering",
		body: "Context blueprints let you design the full picture the LLM sees — not just the prompt, but the system message, knowledge, and examples together.",
		learnMoreSlug: null,
		category: "blueprint",
	},
	{
		id: "no-grounding",
		title: "Ground your knowledge blocks",
		body: "Knowledge without grounding instructions is like reference books without a syllabus. Tell the model how to use the information you provide.",
		learnMoreSlug: "the-groundless-reference",
		category: "blueprint",
	},
	{
		id: "no-role",
		title: "Assign a role or persona",
		body: "Starting with 'You are a...' helps the LLM adopt the right expertise and communication style for your task.",
		learnMoreSlug: "role-persona-assignment",
		category: "prompt",
	},
	{
		id: "no-chain-of-thought",
		title: "Try chain-of-thought reasoning",
		body: "For complex tasks, asking the model to 'think step by step' can significantly improve accuracy by breaking down reasoning.",
		learnMoreSlug: "chain-of-thought",
		category: "prompt",
	},
	{
		id: "no-negative-constraints",
		title: "Tell the model what NOT to do",
		body: "Negative constraints like 'Do NOT include disclaimers' or 'Do NOT use bullet points' can be as important as positive instructions.",
		learnMoreSlug: "negative-constraints",
		category: "prompt",
	},
	{
		id: "no-structure",
		title: "Structure improves clarity",
		body: "Using XML tags, markdown headers, or clear sections helps the model understand the boundaries between different parts of your prompt.",
		learnMoreSlug: "xml-tag-structuring",
		category: "prompt",
	},
	{
		id: "first-analysis",
		title: "AI analysis helps you improve",
		body: "The analysis engine evaluates your prompt across multiple dimensions. Use the suggestions to iteratively improve your prompt quality.",
		learnMoreSlug: null,
		category: "general",
	},
	{
		id: "first-version",
		title: "Version history keeps you safe",
		body: "Every save creates a new version. You can always go back to a previous version if a change didn't work out.",
		learnMoreSlug: null,
		category: "general",
	},
	{
		id: "first-api-key",
		title: "Access prompts via API",
		body: "API keys let you retrieve your prompts programmatically. Use version pinning in production to prevent unexpected changes.",
		learnMoreSlug: null,
		category: "general",
	},
	{
		id: "high-token-count",
		title: "Watch your token budget",
		body: "Large contexts cost more and can reduce response quality. Consider which information is truly necessary and use priority levels.",
		learnMoreSlug: null,
		category: "blueprint",
	},
	{
		id: "no-system-block",
		title: "Add a system message block",
		body: "System messages set the overall behavior and role for the LLM. They're processed differently from user messages and set the foundation for all interactions.",
		learnMoreSlug: null,
		category: "blueprint",
	},
	{
		id: "contradictory-instructions",
		title: "Check for contradictions",
		body: "When multiple blocks give conflicting instructions, the LLM may produce unpredictable results. Review your blocks for consistency.",
		learnMoreSlug: "the-contradictory-layers",
		category: "blueprint",
	},
	{
		id: "duplicate-prompts",
		title: "Organize with apps",
		body: "Use apps to group related prompts together. This keeps your workspace organized as your prompt library grows.",
		learnMoreSlug: null,
		category: "general",
	},
	{
		id: "first-duplicate",
		title: "Duplicate to experiment",
		body: "Duplicating a prompt creates a safe copy for experimentation. The original stays unchanged while you try new approaches.",
		learnMoreSlug: null,
		category: "general",
	},
	{
		id: "self-critique",
		title: "Ask the model to self-critique",
		body: "Adding a reflection step where the model reviews its own output can catch errors and improve quality significantly.",
		learnMoreSlug: "self-critique-reflection",
		category: "prompt",
	},
	{
		id: "decomposition",
		title: "Break complex tasks into steps",
		body: "Instead of one massive prompt, break your task into sequential steps. Each step can build on the previous one's output.",
		learnMoreSlug: "step-by-step-decomposition",
		category: "prompt",
	},
	{
		id: "blueprint-context-layering",
		title: "Context layers improve clarity",
		body: "Organizing your blueprint into distinct layers (system, knowledge, examples) helps the AI prioritize information correctly.",
		learnMoreSlug: "context-layering",
		category: "blueprint",
	},
	{
		id: "blueprint-token-budget",
		title: "Watch your token budget",
		body: "Your blueprint is using a significant portion of the context window. Consider compressing less critical blocks.",
		learnMoreSlug: "token-budget-allocation",
		category: "blueprint",
	},
	{
		id: "blueprint-conditional-blocks",
		title: "Try conditional blocks",
		body: "Conditional blocks let you include different context based on input type, making your blueprint more versatile.",
		learnMoreSlug: "conditional-inclusion",
		category: "blueprint",
	},
	{
		id: "blueprint-redundancy",
		title: "Reduce context redundancy",
		body: "Multiple blocks in your blueprint contain overlapping instructions. Consolidate to save tokens and reduce confusion.",
		learnMoreSlug: "knowledge-delineation",
		category: "blueprint",
	},
	{
		id: "blueprint-grounding",
		title: "Ground your knowledge blocks",
		body: "Knowledge blocks are more effective when paired with grounding instructions that tell the AI how to use the information.",
		learnMoreSlug: "grounding-instructions",
		category: "blueprint",
	},
	{
		id: "blueprint-single-block",
		title: "Multiple blocks improve results",
		body: "A single-block blueprint misses the benefit of context layering. Try splitting your context into system, knowledge, and example blocks.",
		learnMoreSlug: "context-layering",
		category: "blueprint",
	},
];

export function getMicroLesson(id: string): MicroLesson | undefined {
	return MICRO_LESSONS.find((l) => l.id === id);
}
