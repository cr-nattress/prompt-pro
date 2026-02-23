export interface AntiPattern {
	slug: string;
	title: string;
	icon: string;
	summary: string;
	whatItLooksLike: string;
	whyItsProblem: string;
	howToFix: string;
	badExample: string;
	goodExample: string;
	relatedTechniques: string[];
}

export const ANTI_PATTERNS: AntiPattern[] = [
	{
		slug: "the-kitchen-sink",
		title: "The Kitchen Sink",
		icon: "Soup",
		summary: "Cramming every possible instruction into a single prompt.",
		whatItLooksLike:
			"A massive prompt that tries to handle every edge case, includes contradictory instructions, and mixes multiple unrelated tasks together.",
		whyItsProblem:
			"Models have limited attention. When everything is important, nothing is. The model may follow some instructions while ignoring others, or produce mediocre results across all tasks instead of good results on any single task.",
		howToFix:
			"Break the task into focused, sequential steps. Each prompt should have one clear objective. Use a pipeline approach where the output of one step feeds into the next.",
		badExample: `You are a helpful assistant. Write a blog post about AI. Make it SEO-friendly with keywords. Also include social media captions for Twitter, LinkedIn, and Instagram. Generate meta descriptions. Create an email newsletter version. Translate the title to Spanish, French, and German. Make sure the tone is professional but also casual and fun. Include statistics but don't make it too technical. Target both beginners and experts.`,
		goodExample: `Write a 800-word blog post about the impact of AI on small business operations.

Target audience: Small business owners with no technical background.
Tone: Professional but approachable.
Structure: Introduction, 3 main points with examples, conclusion with action items.
Include: 2-3 relevant statistics with sources.`,
		relatedTechniques: ["step-by-step-decomposition"],
	},
	{
		slug: "the-vague-directive",
		title: "The Vague Directive",
		icon: "CloudFog",
		summary: "Being too general or ambiguous in instructions.",
		whatItLooksLike:
			"Prompts using words like 'good', 'appropriate', 'relevant', 'improve', or 'better' without defining what those mean in context.",
		whyItsProblem:
			"The model has to guess what you mean by 'good' or 'appropriate', and its interpretation may differ from yours. This leads to inconsistent results and wasted iterations.",
		howToFix:
			"Replace vague adjectives with specific, measurable criteria. Instead of 'make it better', specify exactly what 'better' means for your use case.",
		badExample: `Write a good product description. Make it appropriate for our audience and include relevant details.`,
		goodExample: `Write a product description for our wireless headphones (Model: AirMax Pro).

Requirements:
- Length: 150-200 words
- Highlight: noise cancellation, 30-hour battery, Bluetooth 5.3
- Tone: Premium but not pretentious
- Include: one comparison to competitors in the $200 range
- Call to action: drive readers to the product page`,
		relatedTechniques: ["output-format-specification", "negative-constraints"],
	},
	{
		slug: "the-assumption-trap",
		title: "The Assumption Trap",
		icon: "Brain",
		summary: "Assuming the LLM has context it doesn't have.",
		whatItLooksLike:
			"References to 'the project', 'our standards', 'the usual format', or 'as discussed' without providing that context. Or expecting the model to know your specific codebase, company, or domain conventions.",
		whyItsProblem:
			"LLMs don't have access to your internal knowledge, previous conversations (in a new session), or unstated conventions. They'll either make something up or produce generic results.",
		howToFix:
			"Always include the context the model needs. State your conventions explicitly. Provide reference material for domain-specific tasks.",
		badExample: `Review this PR following our coding standards and check it matches the architecture we discussed.`,
		goodExample: `Review this PR against these specific coding standards:
- All functions must have TypeScript return types
- No \`any\` types allowed
- React components use functional style with hooks
- Error boundaries for async operations
- Test coverage for all public functions

Architecture constraint: This service should only communicate with the user-service through the event bus, not direct API calls.

PR diff:
{diff}`,
		relatedTechniques: ["xml-tag-structuring", "role-persona-assignment"],
	},
	{
		slug: "the-format-pray",
		title: "The Format Pray",
		icon: "Dice5",
		summary: "Hoping for a specific format without specifying it.",
		whatItLooksLike:
			"Expecting JSON, markdown tables, or specific structures without ever describing the desired format. Then being surprised when the model returns prose or a different structure.",
		whyItsProblem:
			"Without explicit format instructions, the model picks whatever format seems natural for the content. This makes outputs unpredictable and hard to parse programmatically.",
		howToFix:
			"Always specify the exact output format. Provide a template or example. For structured data, include the exact schema.",
		badExample: `Extract the key information from this invoice.`,
		goodExample: `Extract information from this invoice and return it as JSON matching this exact schema:

{
  "vendor_name": "string",
  "invoice_number": "string",
  "date": "YYYY-MM-DD",
  "line_items": [
    {
      "description": "string",
      "quantity": number,
      "unit_price": number,
      "total": number
    }
  ],
  "subtotal": number,
  "tax": number,
  "total": number
}

Invoice:
{invoice_text}`,
		relatedTechniques: ["output-format-specification", "few-shot-prompting"],
	},
	{
		slug: "the-context-dump",
		title: "The Context Dump",
		icon: "PackageOpen",
		summary: "Providing unstructured, raw context without organization.",
		whatItLooksLike:
			"Pasting entire documents, codebases, or datasets into the prompt without indicating what parts are relevant or how they should be used.",
		whyItsProblem:
			"The model must sift through irrelevant information to find what matters. This wastes tokens, increases latency, and can confuse the model about what's important.",
		howToFix:
			"Curate context carefully. Use XML tags or headers to organize sections. Indicate what role each piece of context plays. Remove irrelevant information.",
		badExample: `Here's our entire codebase. Find the bug.

{entire_codebase_dump}`,
		goodExample: `<bug_report>
Users report a 500 error when submitting the checkout form with a discount code.
Error: "Cannot read property 'amount' of undefined"
</bug_report>

<relevant_code>
File: checkout-service.ts (lines 45-80)
{relevant_code_section}
</relevant_code>

<related_types>
{type_definitions}
</related_types>

Identify the bug and suggest a fix.`,
		relatedTechniques: ["xml-tag-structuring"],
	},
	{
		slug: "the-groundless-reference",
		title: "The Groundless Reference",
		icon: "BookDashed",
		summary: "Providing knowledge without instructions on how to use it.",
		whatItLooksLike:
			"Attaching documentation, FAQs, or reference material to a prompt without telling the model how to use it, what to prioritize, or how to handle conflicts.",
		whyItsProblem:
			"The model may over-rely on the reference material, ignore parts of it, or not know which sections are relevant to the current query. It's like giving someone a textbook without a syllabus.",
		howToFix:
			"Always include grounding instructions that explain: what the reference material is, how to use it, what to do when information conflicts, and what to do when the answer isn't in the material.",
		badExample: `Here's our product documentation. Answer customer questions.

{documentation}

Question: {question}`,
		goodExample: `<role>You are a customer support agent for AcmeCorp.</role>

<knowledge_base>
{documentation}
</knowledge_base>

<grounding_rules>
- ONLY answer based on the knowledge base above
- If the answer is not in the knowledge base, say "I don't have information about that, but I can connect you with our support team"
- When multiple sections are relevant, prioritize the most recent documentation
- Quote specific sections when possible to build user trust
- Do NOT speculate or add information beyond what's provided
</grounding_rules>

Customer question: {question}`,
		relatedTechniques: [
			"xml-tag-structuring",
			"negative-constraints",
			"role-persona-assignment",
		],
	},
	{
		slug: "the-infinite-history",
		title: "The Infinite History",
		icon: "History",
		summary: "Including too much conversation history in the context.",
		whatItLooksLike:
			"Sending the entire conversation history with every request, including resolved topics, tangents, and superseded decisions.",
		whyItsProblem:
			"Old context can contradict current instructions. The model pays attention to all context equally, so outdated information can influence responses. It also wastes tokens and increases costs.",
		howToFix:
			"Summarize prior conversation periodically. Only include the most recent relevant context. Use explicit state management rather than relying on conversation history.",
		badExample: `[50 messages of conversation history including 3 topic changes, a resolved bug, and outdated requirements]

Now help me with the current task.`,
		goodExample: `<conversation_summary>
We are building a React dashboard. Previously decided:
- Using Chart.js for visualizations
- Data fetches through React Query
- Dashboard has 4 widget slots
</conversation_summary>

<current_task>
Implement the revenue chart widget. It should display monthly revenue for the past 12 months as a bar chart with a trend line overlay.
</current_task>`,
		relatedTechniques: ["xml-tag-structuring"],
	},
	{
		slug: "the-contradictory-layers",
		title: "The Contradictory Layers",
		icon: "Layers",
		summary:
			"Giving conflicting instructions in different parts of the prompt.",
		whatItLooksLike:
			"The system message says 'be concise' while a later instruction says 'explain in detail'. Or one section says 'use formal language' while another says 'keep it casual'.",
		whyItsProblem:
			"The model tries to satisfy all instructions simultaneously, leading to inconsistent or confused output. It may alternate between conflicting behaviors unpredictably.",
		howToFix:
			"Review your prompt for contradictions. Establish clear priorities when instructions might conflict. Use explicit override rules.",
		badExample: `System: You are a concise assistant. Keep all responses under 50 words.

User: Write a comprehensive analysis of the impact of remote work on team productivity, covering at least 5 major factors with examples and data.`,
		goodExample: `System: You are an analyst who adapts response length to the question.
- For simple questions: 1-3 sentences
- For analysis requests: thorough coverage (no word limit)
- Default to concise unless the question requires depth

User: Write a comprehensive analysis of the impact of remote work on team productivity, covering at least 5 major factors with examples and data.`,
		relatedTechniques: ["negative-constraints", "role-persona-assignment"],
	},
	{
		slug: "the-missing-link",
		title: "The Missing Link",
		icon: "Unlink",
		summary: "Referencing things that aren't defined or provided.",
		whatItLooksLike:
			"Using template variables that aren't filled in, referencing 'the table above' when there's no table, or mentioning steps from a process that wasn't described.",
		whyItsProblem:
			"The model will either hallucinate the missing content, ignore the reference, or produce an error-like response. None of these outcomes are useful.",
		howToFix:
			"Test prompts with actual data before deploying. Validate that all references resolve to actual content. Use clear parameter naming that's obvious when unfilled.",
		badExample: `Based on the data in the table above, calculate the quarterly growth rate and compare it to the industry benchmarks mentioned earlier.`,
		goodExample: `Based on the following data, calculate the quarterly growth rate:

| Quarter | Revenue |
|---------|---------|
| Q1 2024 | $1.2M   |
| Q2 2024 | $1.5M   |
| Q3 2024 | $1.8M   |
| Q4 2024 | $2.1M   |

Industry benchmark: SaaS companies in the $1-5M ARR range typically see 15-25% quarter-over-quarter growth.

Calculate the QoQ growth for each quarter and compare to the benchmark.`,
		relatedTechniques: ["output-format-specification"],
	},
	{
		slug: "one-priority-fits-all",
		title: "One Priority Fits All",
		icon: "ListOrdered",
		summary: "Treating all instructions as equally important.",
		whatItLooksLike:
			"A list of instructions where everything is presented at the same level, with no indication of what matters most. Or a blueprint where all blocks have the same priority level.",
		whyItsProblem:
			"When the model can't follow all instructions (due to conflicts, context limits, or ambiguity), it doesn't know which ones to prioritize. This leads to the most important requirements being dropped.",
		howToFix:
			"Explicitly rank your instructions. Use 'MUST', 'SHOULD', 'NICE TO HAVE' labels. In blueprints, assign priority levels to blocks. Put the most important instructions first.",
		badExample: `Write a product page. Include a hero section, testimonials, pricing table, FAQ, feature comparison, team photos, blog integration, newsletter signup, chatbot widget, and social proof counter.`,
		goodExample: `Write a product landing page with these sections in priority order:

MUST include:
1. Hero section with value proposition and CTA
2. 3 key features with benefits
3. Pricing table (3 tiers)

SHOULD include:
4. 2-3 customer testimonials
5. FAQ (5 common questions)

NICE TO HAVE:
6. Feature comparison table
7. Social proof metrics`,
		relatedTechniques: ["step-by-step-decomposition", "xml-tag-structuring"],
	},
];

export function getAntiPattern(slug: string): AntiPattern | undefined {
	return ANTI_PATTERNS.find((p) => p.slug === slug);
}
