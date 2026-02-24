export interface PromptPattern {
	slug: string;
	title: string;
	description: string;
	whenToUse: string[];
	whenNotToUse: string[];
	template: string;
	example: string;
	category: "reasoning" | "structure" | "output" | "meta";
	triggerPhrases?: string[] | undefined;
}

export const PATTERN_CATEGORIES: {
	value: PromptPattern["category"];
	label: string;
}[] = [
	{ value: "reasoning", label: "Reasoning" },
	{ value: "structure", label: "Structure" },
	{ value: "output", label: "Output" },
	{ value: "meta", label: "Meta" },
];

export const PROMPT_PATTERNS: PromptPattern[] = [
	{
		slug: "chain-of-thought",
		title: "Chain-of-Thought",
		triggerPhrases: ["Step 1:", "Think through", "step by step"],
		description:
			"Guides the model through explicit step-by-step reasoning before arriving at a final answer. By breaking a complex problem into numbered intermediate steps, the model is less likely to skip logic or hallucinate conclusions.",
		whenToUse: [
			"When the task requires multi-step reasoning (math, logic, planning)",
			"When you need to audit or verify the model's reasoning process",
			"When zero-shot answers are frequently incorrect or shallow",
			"When the problem has dependencies between steps",
		],
		whenNotToUse: [
			"When the task is simple lookup or retrieval",
			"When token budget is tight and you need concise output",
			"When speed matters more than accuracy (the extra reasoning adds latency)",
			"When the answer is factual and does not require inference",
		],
		template: `{{task_description}}

Think through this step by step.

Step 1: {{first_consideration}}
Step 2: {{second_consideration}}
Step 3: {{third_consideration}}

After completing your reasoning, provide your final answer in this format:

**Reasoning:**
1. [Your first step and finding]
2. [Your second step and finding]
3. [Your third step and finding]

**Final Answer:** [Your conclusion based on the reasoning above]`,
		example: `Determine whether the following business should charge sales tax on this transaction.

Think through this step by step.

Step 1: Identify the seller's tax nexus states.
Step 2: Determine the buyer's shipping address state.
Step 3: Check whether the product category is taxable in that state.

After completing your reasoning, provide your final answer in this format:

**Reasoning:**
1. The seller (Acme Widgets Inc.) is incorporated in Delaware and has warehouses in California and Texas, establishing nexus in all three states.
2. The buyer's shipping address is 742 Evergreen Terrace, Austin, TX 78701 — which is in Texas.
3. Physical consumer goods (widgets) are taxable in Texas at a combined state and local rate of 8.25%.

**Final Answer:** Yes, Acme Widgets Inc. must charge 8.25% sales tax on this transaction because the buyer is in Texas, where the seller has nexus, and widgets are a taxable product category.`,
		category: "reasoning",
	},
	{
		slug: "few-shot",
		title: "Few-Shot with Examples",
		triggerPhrases: ["Example:", "Example 1:", "Input:", "Output:"],
		description:
			"Provides concrete input/output pairs that demonstrate the exact format, tone, and logic you expect. The model pattern-matches against these examples to produce consistent, well-formatted responses for the actual task.",
		whenToUse: [
			"When you need consistent output formatting across many inputs",
			"When the task is ambiguous without concrete demonstrations",
			"When you want to establish a specific classification scheme or style",
			"When zero-shot produces inconsistent or off-format results",
		],
		whenNotToUse: [
			"When the task is straightforward and well-defined without examples",
			"When token budget is very limited (examples consume tokens)",
			"When examples might over-anchor the model on specific patterns instead of generalizing",
			"When you have more than 5 examples (consider fine-tuning instead)",
		],
		template: `{{task_instruction}}

{{format_description}}

Example 1:
Input: {{example_1_input}}
Output: {{example_1_output}}

Example 2:
Input: {{example_2_input}}
Output: {{example_2_output}}

Example 3:
Input: {{example_3_input}}
Output: {{example_3_output}}

Now complete this task:
Input: {{actual_input}}
Output:`,
		example: `Classify the following customer support messages into exactly one category: Billing, Technical, Account, or General.

Respond with only the category name.

Example 1:
Input: I was charged twice for my subscription this month.
Output: Billing

Example 2:
Input: The app crashes every time I try to upload a file larger than 10MB.
Output: Technical

Example 3:
Input: I need to update the email address associated with my account.
Output: Account

Now complete this task:
Input: How do I export my data before canceling my plan?
Output:`,
		category: "reasoning",
	},
	{
		slug: "role-assignment",
		title: "Role/Persona Assignment",
		triggerPhrases: ["You are a", "You are an", "Act as"],
		description:
			"Defines a specific professional role, expertise domain, and communication style for the model to adopt. This constrains the model's responses to a consistent perspective and vocabulary, producing more authoritative and contextually appropriate output.",
		whenToUse: [
			"When you need domain-specific expertise and vocabulary",
			"When responses should match a particular professional tone",
			"When you want to constrain the model to a specific perspective",
			"When building a conversational agent with a consistent personality",
		],
		whenNotToUse: [
			"When you need neutral, unbiased analysis from multiple perspectives",
			"When the role might cause the model to fabricate domain credentials",
			"When the task is simple and does not benefit from persona framing",
			"When the persona conflicts with safety guidelines",
		],
		template: `You are {{role_title}}, a {{experience_level}} professional specializing in {{expertise_areas}}.

**Your expertise includes:**
- {{skill_1}}
- {{skill_2}}
- {{skill_3}}

**Communication style:**
- {{style_guideline_1}}
- {{style_guideline_2}}
- {{style_guideline_3}}

**Constraints:**
- {{constraint_1}}
- {{constraint_2}}
- {{constraint_3}}

Given the above role, respond to the following:

{{user_request}}`,
		example: `You are a Senior Database Architect, a staff-level professional specializing in PostgreSQL performance tuning and schema design for high-traffic SaaS applications.

**Your expertise includes:**
- Query optimization and EXPLAIN ANALYZE interpretation
- Index strategy for mixed OLTP/OLAP workloads
- Schema migration planning with zero-downtime deployment

**Communication style:**
- Lead with the specific recommendation, then explain the reasoning
- Include runnable SQL snippets when relevant
- Flag trade-offs explicitly (e.g., write amplification vs. read speed)

**Constraints:**
- Assume PostgreSQL 15+ unless told otherwise
- Do not suggest ORM-level fixes; focus on database-level solutions
- Always mention if a suggestion requires a table lock or downtime

Given the above role, respond to the following:

Our users table has 12 million rows and the query SELECT * FROM users WHERE email ILIKE '%@example.com' takes over 8 seconds. How should we fix this?`,
		category: "structure",
	},
	{
		slug: "output-format-json",
		title: "JSON Output Format",
		triggerPhrases: ["```json", "JSON schema", "Respond with JSON"],
		description:
			"Instructs the model to respond exclusively in valid JSON matching a provided schema. By specifying the exact shape, types, and constraints of the expected output, you get machine-parseable responses that integrate directly into application code.",
		whenToUse: [
			"When the response will be parsed by application code",
			"When you need structured data extraction from unstructured text",
			"When consistency across multiple API calls is critical",
			"When downstream systems expect a specific data contract",
		],
		whenNotToUse: [
			"When you need free-form explanatory text or nuance",
			"When the output structure is truly dynamic and unpredictable",
			"When using a model API that supports native JSON mode (use that instead)",
			"When the required schema is deeply nested (consider breaking into multiple calls)",
		],
		template: `{{task_instruction}}

Respond with ONLY valid JSON matching this exact schema:

\`\`\`json
{{json_schema}}
\`\`\`

**Format rules:**
- {{rule_1}}
- {{rule_2}}
- {{rule_3}}

**Example response:**

\`\`\`json
{{example_json}}
\`\`\`

Input to process:
{{input_data}}`,
		example: `Extract all the people, organizations, and locations mentioned in the following text.

Respond with ONLY valid JSON matching this exact schema:

\`\`\`json
{
  "entities": [
    {
      "text": "string — the entity as it appears in the source",
      "type": "PERSON | ORGANIZATION | LOCATION",
      "confidence": "number between 0 and 1"
    }
  ],
  "summary": "string — one-sentence summary of the text"
}
\`\`\`

**Format rules:**
- Return an empty "entities" array if no entities are found
- Use the exact casing from the source text for the "text" field
- Do not wrap the JSON in markdown code fences or add any text outside the JSON object

**Example response:**

\`\`\`json
{
  "entities": [
    { "text": "Jane Rivera", "type": "PERSON", "confidence": 0.98 },
    { "text": "Cloudflare", "type": "ORGANIZATION", "confidence": 0.95 },
    { "text": "San Francisco", "type": "LOCATION", "confidence": 0.97 }
  ],
  "summary": "Jane Rivera announced Cloudflare's new office in San Francisco."
}
\`\`\`

Input to process:
Tim Cook announced that Apple will open a new research lab in Yokohama, Japan, in partnership with Toyota. The facility will focus on autonomous vehicle technology and is expected to employ over 500 engineers by 2027.`,
		category: "output",
	},
	{
		slug: "self-critique",
		title: "Self-Critique Loop",
		triggerPhrases: ["Phase 1:", "Review your", "critique"],
		description:
			"A meta-prompting pattern that asks the model to generate an initial response, then critically evaluate its own output for errors, gaps, or improvements, and finally produce a revised version. This mimics editorial review and catches mistakes that single-pass generation often misses.",
		whenToUse: [
			"When accuracy is more important than speed",
			"When the task is complex and errors are costly (legal, medical, financial)",
			"When you want the model to catch its own hallucinations or logical gaps",
			"When a single-pass response frequently needs manual revision",
		],
		whenNotToUse: [
			"When latency is critical (this pattern roughly triples generation time)",
			"When token budget is constrained (three passes consume 3x tokens)",
			"When the task is simple and unlikely to benefit from revision",
			"When you have an external validation system that already catches errors",
		],
		template: `{{task_instruction}}

Complete this in three phases:

**Phase 1 — Initial Response:**
Generate your best response to the task above.

**Phase 2 — Self-Critique:**
Review your Phase 1 response and identify:
- Factual errors or unsupported claims
- Logical gaps or missing steps
- Areas where the explanation is unclear or incomplete
- {{additional_critique_dimension}}

**Phase 3 — Revised Response:**
Produce an improved final response that addresses every issue found in Phase 2. Clearly mark this as your final answer.`,
		example: `Write a technical explanation of how database connection pooling works, suitable for a mid-level backend developer.

Complete this in three phases:

**Phase 1 — Initial Response:**
Generate your best response to the task above.

**Phase 2 — Self-Critique:**
Review your Phase 1 response and identify:
- Factual errors or unsupported claims
- Logical gaps or missing steps
- Areas where the explanation is unclear or incomplete
- Whether the complexity level is appropriate for a mid-level backend developer

**Phase 3 — Revised Response:**
Produce an improved final response that addresses every issue found in Phase 2. Clearly mark this as your final answer.`,
		category: "meta",
	},
	{
		slug: "xml-structured",
		title: "XML-Structured Sections",
		triggerPhrases: ["<context>", "<instructions>", "<input>"],
		description:
			"Uses XML tags to create unambiguous boundaries between context, instructions, constraints, and output sections. This eliminates prompt injection risks from user-supplied content and makes it trivially easy for the model to distinguish between data and instructions.",
		whenToUse: [
			"When the prompt mixes system instructions with user-supplied content",
			"When you need clear separation between context, instructions, and output",
			"When working with Claude models (which are optimized for XML-tagged prompts)",
			"When prompt injection is a concern and you need safe content boundaries",
		],
		whenNotToUse: [
			"When the prompt is short and simple with no user-supplied content",
			"When working with models that do not handle XML tags well",
			"When the added verbosity would push you past context window limits",
			"When you are already using a structured API format (e.g., tool use, function calling)",
		],
		template: `<context>
{{background_information}}
</context>

<instructions>
{{task_instructions}}
</instructions>

<constraints>
- {{constraint_1}}
- {{constraint_2}}
- {{constraint_3}}
</constraints>

<input>
{{user_input}}
</input>

<output_format>
{{desired_format_description}}
</output_format>`,
		example: `<context>
You are a code review assistant for a TypeScript monorepo. The project uses React 19, Next.js 15, and Drizzle ORM. The team follows conventional commits and requires all functions to have explicit return types.
</context>

<instructions>
Review the code provided in the input section. For each issue found, provide the line reference, severity (critical, warning, or suggestion), and a brief explanation with a corrected code snippet.
</instructions>

<constraints>
- Only flag issues that violate the project's stated conventions or represent genuine bugs
- Do not suggest stylistic changes beyond what the constraints specify
- Limit your review to a maximum of 5 issues, prioritized by severity
</constraints>

<input>
export async function getUser(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id)
  })
  if (!user) return null
  return { ...user, password: user.passwordHash }
}
</input>

<output_format>
Return a numbered list of issues. Each issue should include:
1. **Line:** the approximate line reference
2. **Severity:** critical | warning | suggestion
3. **Issue:** one-sentence description
4. **Fix:** corrected code snippet
</output_format>`,
		category: "structure",
	},
];

export function getPromptPattern(slug: string): PromptPattern | undefined {
	return PROMPT_PATTERNS.find((pattern) => pattern.slug === slug);
}
