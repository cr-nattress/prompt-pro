export interface ModelGuide {
	slug: string;
	name: string;
	provider: string;
	category: "frontier" | "balanced" | "fast";
	description: string;
	strengths: string[];
	weaknesses: string[];
	promptStructure: string;
	features: {
		functionCalling: boolean;
		jsonMode: boolean;
		systemMessages: boolean;
		vision: boolean;
		streaming: boolean;
	};
	tokenLimits: {
		context: string;
		output: string;
	};
	pricing: {
		input: string;
		output: string;
	};
	bestPractices: string[];
	antiPatterns: string[];
}

export const MODEL_GUIDES: ModelGuide[] = [
	{
		slug: "claude-opus",
		name: "Claude Opus 4.6",
		provider: "Anthropic",
		category: "frontier",
		description:
			"Anthropic's most capable model, excelling at complex reasoning, nuanced writing, and long-context tasks. Best for tasks requiring deep analysis and sophisticated output.",
		strengths: [
			"Exceptional at complex, multi-step reasoning",
			"Strongest long-context understanding (200K tokens)",
			"Nuanced, well-structured writing",
			"Excellent at following detailed instructions",
			"Strong ethical reasoning and safety alignment",
			"Superior at code generation and analysis",
		],
		weaknesses: [
			"Higher cost per token than smaller models",
			"Slower response times for complex queries",
			"May be over-cautious on edge cases",
			"Can be verbose without explicit length constraints",
		],
		promptStructure: `Claude Opus responds best to well-structured prompts with XML tags for organization. Use <instructions>, <context>, and <output_format> tags to clearly delineate prompt sections.

System messages are highly effective — use them to set persistent behavior, role, and constraints. Claude respects system-level instructions reliably.

For complex tasks, break instructions into numbered steps. Claude excels at following sequential multi-step processes.`,
		features: {
			functionCalling: true,
			jsonMode: true,
			systemMessages: true,
			vision: true,
			streaming: true,
		},
		tokenLimits: {
			context: "200,000 tokens",
			output: "32,768 tokens",
		},
		pricing: {
			input: "$15 / 1M tokens",
			output: "$75 / 1M tokens",
		},
		bestPractices: [
			"Use XML tags (<instructions>, <context>, <examples>) to organize complex prompts",
			"Leverage the large context window for comprehensive reference material",
			"Use system messages for persistent role and behavior instructions",
			"Provide explicit output format specifications for structured responses",
			"Use chain-of-thought prompting for complex reasoning tasks",
			"Set clear length constraints to avoid verbosity",
		],
		antiPatterns: [
			"Don't use vague instructions — Claude will ask for clarification rather than guess",
			"Avoid contradictory instructions in system vs user messages",
			"Don't rely on implicit assumptions about output format",
			"Avoid extremely long single-paragraph instructions — use structure",
		],
	},
	{
		slug: "claude-sonnet",
		name: "Claude Sonnet 4.6",
		provider: "Anthropic",
		category: "balanced",
		description:
			"Anthropic's balanced model offering strong performance at lower cost. Ideal for most production workloads requiring good reasoning with faster response times.",
		strengths: [
			"Excellent balance of capability and cost",
			"Fast response times for production use",
			"Strong at code generation and structured output",
			"Good long-context handling (200K tokens)",
			"Reliable instruction following",
			"Great for high-volume production workloads",
		],
		weaknesses: [
			"Less nuanced than Opus on very complex reasoning",
			"May simplify complex analyses compared to frontier models",
			"Slightly less creative in open-ended writing tasks",
		],
		promptStructure: `Sonnet follows the same XML-tag structure as Opus. Clear, concise prompts work best — avoid unnecessary verbosity in instructions.

For production use, keep prompts focused and specific. Sonnet excels when given clear, unambiguous instructions without excessive context.

Use few-shot examples strategically — 2-3 examples are often sufficient for Sonnet to understand the pattern.`,
		features: {
			functionCalling: true,
			jsonMode: true,
			systemMessages: true,
			vision: true,
			streaming: true,
		},
		tokenLimits: {
			context: "200,000 tokens",
			output: "16,384 tokens",
		},
		pricing: {
			input: "$3 / 1M tokens",
			output: "$15 / 1M tokens",
		},
		bestPractices: [
			"Keep prompts concise and focused for optimal speed",
			"Use 2-3 few-shot examples for pattern learning",
			"Leverage JSON mode for structured output in production",
			"Use function calling for tool integration",
			"Batch similar tasks to amortize prompt overhead",
			"Monitor consistency across high-volume calls",
		],
		antiPatterns: [
			"Don't overload with excessive context — be selective",
			"Avoid expecting Opus-level depth on complex philosophical reasoning",
			"Don't skip output format specifications in production prompts",
			"Avoid very long chain-of-thought for simple tasks — adds latency",
		],
	},
	{
		slug: "claude-haiku",
		name: "Claude Haiku 4.5",
		provider: "Anthropic",
		category: "fast",
		description:
			"Anthropic's fastest and most affordable model, designed for high-throughput tasks. Best for classification, extraction, simple generation, and real-time applications.",
		strengths: [
			"Extremely fast response times",
			"Lowest cost per token in the Claude family",
			"Excellent for classification and extraction tasks",
			"Good at following simple, structured instructions",
			"Ideal for real-time applications and chatbots",
			"Cost-effective for high-volume processing",
		],
		weaknesses: [
			"Limited complex reasoning compared to larger models",
			"Less capable with nuanced or ambiguous instructions",
			"Shorter output quality degrades on very complex tasks",
			"May miss subtle context clues",
		],
		promptStructure: `Haiku works best with very clear, direct prompts. Minimize ambiguity — provide explicit instructions and expected output format.

Use structured prompts with clear delimiters. Few-shot examples are especially important for Haiku to understand the expected pattern.

Keep system messages short and focused. Haiku benefits from concise behavioral instructions.`,
		features: {
			functionCalling: true,
			jsonMode: true,
			systemMessages: true,
			vision: true,
			streaming: true,
		},
		tokenLimits: {
			context: "200,000 tokens",
			output: "8,192 tokens",
		},
		pricing: {
			input: "$0.80 / 1M tokens",
			output: "$4 / 1M tokens",
		},
		bestPractices: [
			"Use clear, unambiguous instructions — don't rely on inference",
			"Provide 3-5 few-shot examples for consistent output",
			"Keep prompts short and focused on a single task",
			"Use JSON mode for all structured extraction tasks",
			"Implement output validation for production pipelines",
			"Batch processing for maximum cost efficiency",
		],
		antiPatterns: [
			"Don't ask for complex multi-step reasoning",
			"Avoid open-ended creative tasks without strong constraints",
			"Don't use overly long system messages — keep them under 200 tokens",
			"Avoid tasks requiring deep contextual understanding",
		],
	},
	{
		slug: "gpt-4o",
		name: "GPT-4o",
		provider: "OpenAI",
		category: "frontier",
		description:
			"OpenAI's flagship multimodal model combining strong reasoning, fast inference, and native multimodal capabilities. Versatile for a wide range of production tasks.",
		strengths: [
			"Strong general-purpose reasoning",
			"Native multimodal (text, image, audio)",
			"Fast inference for a frontier model",
			"Excellent function calling implementation",
			"Strong JSON mode with structured outputs",
			"Large ecosystem of tools and integrations",
		],
		weaknesses: [
			"May follow instructions too literally without common-sense adjustments",
			"Can produce confident but incorrect information",
			"Less consistent on very long outputs",
			"May not handle very long contexts as well as Claude",
		],
		promptStructure: `GPT-4o responds well to markdown-formatted prompts. Use headers, bullet points, and numbered lists to organize instructions.

System messages are effective for role-setting and behavioral constraints. GPT-4o respects system-level instructions well.

For structured output, use the structured outputs feature (JSON schema) rather than asking for JSON in the prompt — it guarantees valid JSON.`,
		features: {
			functionCalling: true,
			jsonMode: true,
			systemMessages: true,
			vision: true,
			streaming: true,
		},
		tokenLimits: {
			context: "128,000 tokens",
			output: "16,384 tokens",
		},
		pricing: {
			input: "$2.50 / 1M tokens",
			output: "$10 / 1M tokens",
		},
		bestPractices: [
			"Use markdown formatting for prompt organization",
			"Leverage structured outputs (JSON schema) for reliable parsing",
			"Use function calling for tool integration and data extraction",
			"Provide explicit examples of desired vs undesired behavior",
			"Use temperature control for consistency (lower for production)",
			"Implement retry logic for edge cases in production",
		],
		antiPatterns: [
			"Don't assume common-sense understanding of ambiguous instructions",
			"Avoid relying on the model to decline incorrect information",
			"Don't use very high temperatures for production tasks",
			"Avoid extremely long single prompts — break into function calls",
		],
	},
	{
		slug: "gemini-pro",
		name: "Gemini Pro",
		provider: "Google",
		category: "frontier",
		description:
			"Google's advanced multimodal model with a massive context window. Excels at long-document processing, code generation, and multimodal understanding.",
		strengths: [
			"Massive context window (up to 2M tokens)",
			"Strong multimodal capabilities (text, image, video, audio)",
			"Excellent at processing very long documents",
			"Good code generation across multiple languages",
			"Competitive pricing for the capability level",
			"Strong at factual tasks with Google knowledge",
		],
		weaknesses: [
			"May not follow very specific formatting instructions as precisely",
			"Function calling implementation less mature than competitors",
			"Can be less consistent with creative or nuanced tasks",
			"Safety filtering can be more aggressive",
		],
		promptStructure: `Gemini Pro works well with clear, direct prompts. Use numbered instructions for multi-step tasks.

Leverage the massive context window for document analysis — Gemini excels when given full documents rather than excerpts.

For structured output, be very explicit about the expected format. Provide complete examples of the desired output structure.`,
		features: {
			functionCalling: true,
			jsonMode: true,
			systemMessages: true,
			vision: true,
			streaming: true,
		},
		tokenLimits: {
			context: "2,000,000 tokens",
			output: "8,192 tokens",
		},
		pricing: {
			input: "$1.25 / 1M tokens",
			output: "$5 / 1M tokens",
		},
		bestPractices: [
			"Leverage the massive context window for full-document analysis",
			"Use numbered, sequential instructions for complex tasks",
			"Provide complete output examples — be very explicit about format",
			"Use grounding with Google Search for factual accuracy",
			"Combine text and image inputs for multimodal analysis",
			"Test thoroughly with edge cases — output can vary",
		],
		antiPatterns: [
			"Don't assume precise format adherence without explicit examples",
			"Avoid relying on subtle prompt engineering tricks — be direct",
			"Don't use for tasks requiring very specific tone or style without examples",
			"Avoid complex nested function calling schemas",
		],
	},
];

export function getModelGuide(slug: string): ModelGuide | undefined {
	return MODEL_GUIDES.find((m) => m.slug === slug);
}

export function getModelsByProvider(provider: string): ModelGuide[] {
	return MODEL_GUIDES.filter((m) => m.provider === provider);
}
