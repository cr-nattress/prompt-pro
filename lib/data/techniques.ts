export interface Technique {
	slug: string;
	title: string;
	summary: string;
	whenToUse: string[];
	whenNotToUse: string[];
	basicExample: { before: string; after: string };
	advancedExample: string;
	modelNotes: string;
}

export const TECHNIQUES: Technique[] = [
	{
		slug: "few-shot-prompting",
		title: "Few-Shot Prompting",
		summary:
			"Provide 1-3 examples of the desired input/output to guide the model's behavior.",
		whenToUse: [
			"When you need consistent output formatting",
			"When the task is ambiguous without examples",
			"When you want to establish a specific style or tone",
			"When zero-shot produces inconsistent results",
		],
		whenNotToUse: [
			"When the task is straightforward and well-defined",
			"When token budget is very limited",
			"When examples might bias the model toward the specific examples rather than generalizing",
		],
		basicExample: {
			before: `Classify the sentiment of this review: "The product arrived late but works great."`,
			after: `Classify the sentiment as Positive, Negative, or Mixed.

Examples:
Input: "Absolutely love this product! Best purchase ever."
Output: Positive

Input: "Terrible quality, broke after one day."
Output: Negative

Input: "The product arrived late but works great."
Output:`,
		},
		advancedExample: `You are a code review assistant. Review the given code and provide feedback in the exact format shown.

Example 1:
Code: \`if x == True:\`
Review:
- Issue: Comparison to True
- Severity: Minor
- Fix: Use \`if x:\` instead of \`if x == True:\`

Example 2:
Code: \`except:\`
Review:
- Issue: Bare except clause
- Severity: Major
- Fix: Catch specific exceptions like \`except ValueError:\`

Now review this code:
Code: \`{code}\`
Review:`,
		modelNotes:
			"All major LLMs benefit from few-shot examples. Claude and GPT-4 can often work with 1-2 examples, while smaller models may need 3-5. Keep examples diverse to prevent overfitting to patterns in the examples.",
	},
	{
		slug: "chain-of-thought",
		title: "Chain-of-Thought (CoT)",
		summary:
			"Ask the model to reason step-by-step before giving a final answer.",
		whenToUse: [
			"For math, logic, or multi-step reasoning problems",
			"When accuracy matters more than speed",
			"For complex decision-making with multiple factors",
			"When you need to understand the model's reasoning",
		],
		whenNotToUse: [
			"For simple factual retrieval",
			"When you need very short responses",
			"When latency is critical and the task is simple",
		],
		basicExample: {
			before: `A farmer has 15 sheep. All but 8 die. How many are left?`,
			after: `A farmer has 15 sheep. All but 8 die. How many are left?

Think through this step-by-step before giving your answer.`,
		},
		advancedExample: `You are a senior software architect. Evaluate whether we should migrate from REST to GraphQL.

Consider these factors step by step:
1. Current pain points with our REST API
2. Team expertise and learning curve
3. Performance implications
4. Client requirements (mobile, web, third-party)
5. Migration effort and risk

For each factor, explain your reasoning, then provide an overall recommendation with confidence level.

Context:
{project_context}`,
		modelNotes:
			"Chain-of-thought significantly improves accuracy on reasoning tasks for all large models. Claude excels at structured CoT. For GPT-4, using 'Let\\'s think step by step' can be enough. Smaller models may need more explicit reasoning scaffolding.",
	},
	{
		slug: "role-persona-assignment",
		title: "Role/Persona Assignment",
		summary:
			"Assign a specific role or expertise to the model to shape its responses.",
		whenToUse: [
			"When domain expertise matters for the response",
			"When you want a specific communication style",
			"When the response should reflect a particular perspective",
			"For consistent behavior across a conversation",
		],
		whenNotToUse: [
			"When the task is purely factual with no interpretation needed",
			"When the role might introduce unwanted biases",
			"When simplicity is more important than persona consistency",
		],
		basicExample: {
			before: `Explain how DNS works.`,
			after: `You are a senior network engineer with 15 years of experience teaching junior developers. Explain how DNS works in a way that's technically accurate but accessible to someone who's never worked with networking.`,
		},
		advancedExample: `You are a seasoned financial analyst specializing in SaaS metrics. You have deep expertise in:
- ARR/MRR growth analysis
- Cohort retention modeling
- Unit economics (CAC, LTV, payback period)
- Benchmark comparisons across B2B SaaS

When analyzing data, always:
1. Lead with the most actionable insight
2. Compare against industry benchmarks
3. Flag anomalies or concerns
4. Suggest 2-3 specific next steps

Analyze the following quarterly metrics:
{metrics_data}`,
		modelNotes:
			"Role assignment works well across all major LLMs. Claude responds particularly well to detailed persona descriptions with behavioral guidelines. GPT-4 can maintain personas across long conversations. Be specific about expertise areas rather than generic roles.",
	},
	{
		slug: "xml-tag-structuring",
		title: "XML Tag Structuring",
		summary: "Use XML-style tags to clearly delineate sections of your prompt.",
		whenToUse: [
			"For complex prompts with multiple sections",
			"When you need clear boundaries between instructions and data",
			"When the model needs to process different types of content differently",
			"For prompts that mix system instructions with user data",
		],
		whenNotToUse: [
			"For very simple, single-purpose prompts",
			"When working with models that don't respond well to XML tags",
			"When readability for non-technical users is the priority",
		],
		basicExample: {
			before: `Summarize this article and extract key facts. The article is about climate change and its effects on agriculture. Focus on actionable insights for farmers.`,
			after: `<instructions>
Summarize the following article and extract key facts. Focus on actionable insights for farmers.
</instructions>

<article>
{article_text}
</article>

<output_format>
- Summary (2-3 sentences)
- Key Facts (bulleted list)
- Actionable Insights (numbered list for farmers)
</output_format>`,
		},
		advancedExample: `<system>
You are an expert code reviewer for a TypeScript/React codebase.
</system>

<review_criteria>
- Type safety and proper TypeScript usage
- React best practices (hooks, rendering, state management)
- Performance implications
- Security concerns
- Code readability and maintainability
</review_criteria>

<code_context>
File: {file_path}
PR Description: {pr_description}
</code_context>

<code>
{code_diff}
</code>

<output_instructions>
For each issue found, provide:
1. Line reference
2. Severity (critical/major/minor/suggestion)
3. Description of the issue
4. Suggested fix with code
</output_instructions>`,
		modelNotes:
			"Claude is specifically designed to work well with XML tags and uses them extensively in its own training. GPT-4 also handles XML tags well. This technique provides clear visual structure and helps the model understand prompt boundaries.",
	},
	{
		slug: "output-format-specification",
		title: "Output Format Specification",
		summary:
			"Explicitly define the structure and format of the desired output.",
		whenToUse: [
			"When you need to parse the output programmatically",
			"When consistency across multiple calls matters",
			"When the output feeds into another system",
			"When you want specific sections or headers in the response",
		],
		whenNotToUse: [
			"When you want creative, free-form responses",
			"When the format would be overly restrictive for the task",
		],
		basicExample: {
			before: `Analyze this customer feedback: "Your app crashes every time I try to upload a photo."`,
			after: `Analyze this customer feedback and respond in exactly this JSON format:

{
  "sentiment": "positive" | "negative" | "neutral",
  "category": "bug" | "feature_request" | "praise" | "question",
  "priority": "high" | "medium" | "low",
  "summary": "one sentence summary",
  "suggested_action": "recommended next step"
}

Feedback: "Your app crashes every time I try to upload a photo."`,
		},
		advancedExample: `Analyze the provided meeting transcript and produce output in this exact structure:

## Meeting Summary
(2-3 sentence overview)

## Key Decisions
| Decision | Owner | Deadline |
|----------|-------|----------|
(table rows)

## Action Items
- [ ] Action item (Owner, Due: date)

## Open Questions
1. Question (Who needs to answer)

## Risk Flags
> Any concerns or blockers mentioned

Transcript:
{transcript}`,
		modelNotes:
			"All models benefit from format specification. JSON output is most reliable with GPT-4 and Claude. For markdown tables, Claude tends to be very consistent. Always include an example of the exact format you want rather than just describing it.",
	},
	{
		slug: "negative-constraints",
		title: "Negative Constraints",
		summary:
			"Tell the model what NOT to do to prevent common unwanted behaviors.",
		whenToUse: [
			"When the model tends to add unwanted content (disclaimers, caveats)",
			"When you need to restrict output scope",
			"When previous outputs included undesired elements",
			"When working with sensitive topics that need boundaries",
		],
		whenNotToUse: [
			"When you haven't tried positive instructions first",
			"When the constraint list becomes longer than the actual instructions",
			"When the constraints might confuse the model about what it should do",
		],
		basicExample: {
			before: `Write a product description for our new coffee maker.`,
			after: `Write a product description for our new coffee maker.

Do NOT:
- Include pricing or availability information
- Use superlatives like "best" or "revolutionary"
- Add disclaimers or safety warnings
- Exceed 100 words`,
		},
		advancedExample: `You are a medical information assistant providing general health information.

Strict constraints:
- Do NOT diagnose conditions or recommend specific treatments
- Do NOT say "I'm not a doctor" or similar disclaimers (the user already knows)
- Do NOT suggest the user "consult a healthcare professional" unless the situation is genuinely urgent
- Do NOT provide information about drug dosages
- Do NOT refuse to explain medical concepts or conditions in general terms

You should:
- Explain medical concepts clearly using accessible language
- Describe how conditions generally work
- Discuss common approaches to management (in general terms)
- Answer follow-up questions directly

Question: {user_question}`,
		modelNotes:
			"Negative constraints are effective across all LLMs but should be used alongside positive instructions. Claude generally follows negative constraints well. GPT models sometimes need constraints repeated. Keep the list focused — too many negatives can be counterproductive.",
	},
	{
		slug: "step-by-step-decomposition",
		title: "Step-by-Step Decomposition",
		summary:
			"Break a complex task into explicit sequential steps for the model to follow.",
		whenToUse: [
			"For multi-part tasks that need all parts addressed",
			"When the order of operations matters",
			"When the model tends to skip steps in complex tasks",
			"For workflow automation prompts",
		],
		whenNotToUse: [
			"For simple tasks that don't need decomposition",
			"When you want the model to determine the best approach itself",
			"When flexibility in approach is more important than thoroughness",
		],
		basicExample: {
			before: `Review this essay and provide feedback.`,
			after: `Review this essay by completing each step in order:

Step 1: Read the entire essay and identify the main thesis.
Step 2: Evaluate the argument structure — are claims supported?
Step 3: Check for logical fallacies or weak reasoning.
Step 4: Assess clarity and readability.
Step 5: Provide 3 specific, actionable suggestions for improvement.

Essay:
{essay}`,
		},
		advancedExample: `Process this customer support ticket through the following pipeline:

Step 1 — Classification:
Categorize the ticket into: billing, technical, account, feature_request, or other.

Step 2 — Sentiment Analysis:
Rate the customer's emotional state: calm, frustrated, angry, or urgent.

Step 3 — Information Extraction:
Extract: customer name, account ID (if mentioned), product/feature referenced, and specific issue described.

Step 4 — Resolution Path:
Based on the classification and extracted info, recommend the top 3 most likely resolution steps.

Step 5 — Draft Response:
Write a professional response that addresses the customer's concern, using the appropriate tone for their emotional state.

Ticket:
{ticket_content}`,
		modelNotes:
			"Explicit step decomposition improves completeness across all models. Claude tends to follow numbered steps very reliably. For GPT models, prefixing each step with a number and clear label helps maintain structure. This technique combines well with chain-of-thought.",
	},
	{
		slug: "self-critique-reflection",
		title: "Self-Critique / Reflection",
		summary:
			"Ask the model to review and improve its own output before presenting the final answer.",
		whenToUse: [
			"When accuracy is critical",
			"For complex reasoning where initial answers may have errors",
			"When you want the model to catch its own mistakes",
			"For creative tasks where quality refinement helps",
		],
		whenNotToUse: [
			"When speed/latency matters more than quality",
			"For simple factual questions with clear answers",
			"When token budget is very limited",
		],
		basicExample: {
			before: `Solve this math problem: If a train travels 120 km in 1.5 hours, what is its average speed?`,
			after: `Solve this math problem: If a train travels 120 km in 1.5 hours, what is its average speed?

After solving, review your work:
1. Check each calculation step for errors
2. Verify the units are correct
3. Confirm the answer makes intuitive sense
4. If you find any errors, correct them and show the fixed solution`,
		},
		advancedExample: `Write a Python function that implements binary search on a sorted array.

After writing the code:
1. Trace through the code with these test cases:
   - Empty array
   - Array with one element (target found)
   - Array with one element (target not found)
   - Target at the beginning, middle, and end
2. Check for off-by-one errors in the boundary conditions
3. Verify the function handles edge cases correctly
4. If you find any bugs, fix them and explain what was wrong

Provide the final, corrected version.`,
		modelNotes:
			"Self-critique works best with larger models (Claude Opus, GPT-4). Smaller models may struggle to accurately evaluate their own output. For Claude, the reflection step genuinely improves output quality. Consider using separate API calls for generation and critique when quality is paramount.",
	},
];

export function getTechnique(slug: string): Technique | undefined {
	return TECHNIQUES.find((t) => t.slug === slug);
}
