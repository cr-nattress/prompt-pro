export interface GlossaryTerm {
	term: string;
	slug: string;
	definition: string;
	relatedSlug: string | null;
}

export const GLOSSARY: GlossaryTerm[] = [
	{
		term: "Temperature",
		slug: "temperature",
		definition:
			"A parameter that controls randomness in model output. Lower values (0-0.3) produce more deterministic, focused responses. Higher values (0.7-1.0) produce more creative, varied responses.",
		relatedSlug: null,
	},
	{
		term: "Tokens",
		slug: "tokens",
		definition:
			"The basic units that language models process. A token is roughly 3/4 of a word in English. Both input (prompt) and output (response) consume tokens, which affects cost and context window limits.",
		relatedSlug: null,
	},
	{
		term: "System Prompt",
		slug: "system-prompt",
		definition:
			"A special instruction set at the beginning of a conversation that defines the model's behavior, role, and constraints. System prompts are processed differently from user messages and set the foundation for all interactions.",
		relatedSlug: "role-persona-assignment",
	},
	{
		term: "Context Window",
		slug: "context-window",
		definition:
			"The maximum amount of text (in tokens) that a model can process in a single request. This includes the prompt, conversation history, and the generated response. Exceeding the context window causes truncation or errors.",
		relatedSlug: null,
	},
	{
		term: "Few-Shot",
		slug: "few-shot",
		definition:
			"A prompting technique where you provide a small number of examples (typically 1-5) of the desired input/output pattern. The model learns the pattern from these examples and applies it to new inputs.",
		relatedSlug: "few-shot-prompting",
	},
	{
		term: "Zero-Shot",
		slug: "zero-shot",
		definition:
			"Asking a model to perform a task without providing any examples. The model relies entirely on its training to understand and complete the task. Works best for well-defined, common tasks.",
		relatedSlug: null,
	},
	{
		term: "Chain-of-Thought",
		slug: "chain-of-thought",
		definition:
			"A technique that asks the model to show its reasoning step-by-step before arriving at a final answer. This improves accuracy on complex reasoning tasks by making the thought process explicit.",
		relatedSlug: "chain-of-thought",
	},
	{
		term: "RAG (Retrieval-Augmented Generation)",
		slug: "rag",
		definition:
			"A technique that combines a language model with an external knowledge retrieval system. The model first retrieves relevant documents, then uses them as context to generate more accurate, grounded responses.",
		relatedSlug: null,
	},
	{
		term: "Hallucination",
		slug: "hallucination",
		definition:
			"When a model generates information that sounds plausible but is factually incorrect or entirely fabricated. Common with specific facts, dates, URLs, and citations. Mitigated by grounding instructions and factual constraints.",
		relatedSlug: "the-groundless-reference",
	},
	{
		term: "Grounding",
		slug: "grounding",
		definition:
			"The practice of anchoring a model's responses to specific, provided source material. Grounding instructions tell the model to base its answers on given documents rather than its training data, reducing hallucinations.",
		relatedSlug: "the-groundless-reference",
	},
	{
		term: "Embedding",
		slug: "embedding",
		definition:
			"A numerical representation of text as a vector (list of numbers). Embeddings capture semantic meaning, allowing comparison of text similarity. Used in RAG systems to find relevant documents for a given query.",
		relatedSlug: null,
	},
	{
		term: "Prompt Injection",
		slug: "prompt-injection",
		definition:
			"An attack where malicious input tricks a model into ignoring its instructions and following the attacker's instructions instead. Mitigated by input validation, output filtering, and careful prompt architecture.",
		relatedSlug: "negative-constraints",
	},
	{
		term: "Persona",
		slug: "persona",
		definition:
			"A role or character assigned to the model through the system prompt or initial instructions. Personas shape the model's expertise, communication style, and behavioral boundaries.",
		relatedSlug: "role-persona-assignment",
	},
	{
		term: "Parameter",
		slug: "parameter",
		definition:
			"In prompt templates, a variable placeholder (like {{topic}} or {{language}}) that gets replaced with actual values at runtime. Parameters make prompts reusable across different inputs.",
		relatedSlug: null,
	},
	{
		term: "Template",
		slug: "template",
		definition:
			"A reusable prompt structure with parameter placeholders. Templates allow consistent prompt patterns while varying the specific inputs, making prompt management scalable.",
		relatedSlug: null,
	},
	{
		term: "Tokenizer",
		slug: "tokenizer",
		definition:
			"The algorithm that converts text into tokens for model processing. Different models use different tokenizers, which means the same text may be split into different numbers of tokens across models.",
		relatedSlug: null,
	},
	{
		term: "Fine-Tuning",
		slug: "fine-tuning",
		definition:
			"Training a pre-existing model on additional, task-specific data to improve its performance on that task. Fine-tuning modifies the model's weights, unlike prompting which only provides instructions at inference time.",
		relatedSlug: null,
	},
	{
		term: "Inference",
		slug: "inference",
		definition:
			"The process of running a trained model to generate output from input. Each time you send a prompt and receive a response, that's an inference call. Cost and latency are measured per inference.",
		relatedSlug: null,
	},
	{
		term: "Completion",
		slug: "completion",
		definition:
			"The text generated by a language model in response to a prompt. Also refers to the API call pattern where you provide a prompt prefix and the model 'completes' it.",
		relatedSlug: null,
	},
	{
		term: "Structured Output",
		slug: "structured-output",
		definition:
			"Model output in a predictable, machine-parseable format like JSON, XML, or markdown tables. Achieved through format specification in the prompt or through API features like JSON mode.",
		relatedSlug: "output-format-specification",
	},
	{
		term: "Top-P (Nucleus Sampling)",
		slug: "top-p",
		definition:
			"A parameter that controls output diversity by only considering tokens whose cumulative probability exceeds a threshold. Lower top-p values make output more focused; higher values allow more variety.",
		relatedSlug: null,
	},
	{
		term: "Context Engineering",
		slug: "context-engineering",
		definition:
			"The practice of designing the complete context a language model sees — including system prompts, knowledge blocks, examples, and instructions — to maximize output quality. Goes beyond prompt engineering to consider the full information architecture.",
		relatedSlug: null,
	},
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
	return GLOSSARY.find((g) => g.slug === slug);
}
