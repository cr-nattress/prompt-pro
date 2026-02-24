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
	{
		slug: "grounding-instructions",
		title: "Grounding Instructions",
		summary:
			"Connect knowledge references to explicit usage instructions so the model knows how to apply provided information.",
		whenToUse: [
			"When providing reference material the model should draw from",
			"In RAG pipelines where retrieved documents need usage guidance",
			"When knowledge blocks contain dense information that needs prioritization",
		],
		whenNotToUse: [
			"For simple conversational prompts with no reference material",
			"When the knowledge source is self-explanatory and small",
			"When the model is expected to use general knowledge only",
		],
		basicExample: {
			before: `Here is our return policy document. Answer customer questions about returns.

{return_policy_text}`,
			after: `<knowledge>
{return_policy_text}
</knowledge>

<grounding>
Use the return policy above as your sole source of truth for answering questions. If the policy does not address the customer's question, say "I'll need to check with our team on that." Never invent policy details. Quote specific sections when relevant.
</grounding>

Answer the following customer question:
{customer_question}`,
		},
		advancedExample: `<knowledge source="product_catalog">
{product_catalog}
</knowledge>

<knowledge source="pricing_tiers">
{pricing_data}
</knowledge>

<grounding>
When answering questions:
1. Always reference the product catalog for feature availability
2. Use pricing tiers to determine what's included at each level
3. If a feature exists in the catalog but isn't in any pricing tier, note it as "coming soon"
4. Never speculate about features not listed in the catalog
5. When quoting prices, always mention the billing frequency (monthly/annual)
</grounding>

Customer question: {question}`,
		modelNotes:
			"Grounding instructions are critical for RAG-based applications. Claude follows grounding constraints reliably, especially when paired with XML-tagged knowledge blocks. GPT-4 benefits from explicit 'only use the provided context' instructions. Without grounding, models tend to blend provided knowledge with training data.",
	},
	{
		slug: "context-layering",
		title: "Context Layering",
		summary:
			"Organize context into distinct layers — system, knowledge, examples, tools, history, and task — so the model can prioritize information correctly.",
		whenToUse: [
			"When building complex multi-component prompts",
			"For production systems that combine multiple context sources",
			"When different types of information need different priority levels",
		],
		whenNotToUse: [
			"For simple single-turn prompts with one instruction",
			"When the entire prompt fits in a few sentences",
			"When adding layers would overcomplicate a straightforward task",
		],
		basicExample: {
			before: `You are a helpful coding assistant. Here's the codebase documentation. The user wants help with React hooks. Also here are some examples of good responses.`,
			after: `<system>
You are a senior React developer specializing in hooks and state management.
</system>

<knowledge>
{codebase_documentation}
</knowledge>

<examples>
{few_shot_examples}
</examples>

<task>
Help the user with their React hooks question: {user_question}
</task>`,
		},
		advancedExample: `<system>
You are a customer support agent for Acme SaaS. Tone: professional, empathetic, solution-oriented.
</system>

<knowledge priority="high">
{product_documentation}
</knowledge>

<knowledge priority="medium">
{known_issues_and_workarounds}
</knowledge>

<tools>
Available actions: [create_ticket, escalate_to_engineering, issue_refund, extend_trial]
To use a tool, respond with: <tool_call name="action_name">{"param": "value"}</tool_call>
</tools>

<conversation_history>
{recent_messages}
</conversation_history>

<task>
Respond to the customer's latest message. If the issue requires engineering investigation, create a ticket and let the customer know.
</task>`,
		modelNotes:
			"Context layering aligns with how modern LLM APIs structure messages (system, user, assistant). Claude handles clearly delineated layers exceptionally well. GPT-4 and Gemini also benefit from explicit separation. The key is consistency — use the same layer structure across all prompts in a system.",
	},
	{
		slug: "token-budget-allocation",
		title: "Token Budget Allocation",
		summary:
			"Plan how to distribute context window tokens across system instructions, knowledge, examples, and conversation history.",
		whenToUse: [
			"When working with large context scenarios near the model's limit",
			"In multi-document contexts where not everything fits",
			"When optimizing cost by reducing unnecessary context",
		],
		whenNotToUse: [
			"For short prompts under 500 tokens",
			"When context window size is not a concern",
			"For one-off prompts where optimization isn't worth the effort",
		],
		basicExample: {
			before: `Here is all our documentation (50 pages). Answer the user's question.

{entire_documentation}`,
			after: `<system>
You are a documentation assistant. Answer based only on the provided context.
</system>

<knowledge>
{relevant_documentation_chunks_top_5}
</knowledge>

<task>
Question: {user_question}
If the answer isn't in the provided documentation, say so rather than guessing.
</task>`,
		},
		advancedExample: `<!-- Token budget plan for 128k context window:
  System instructions: ~500 tokens (fixed)
  Knowledge/RAG chunks: ~8,000 tokens (top 5 most relevant)
  Few-shot examples: ~2,000 tokens (2 examples)
  Conversation history: ~4,000 tokens (last 10 turns, summarized)
  Current task: ~500 tokens
  Reserved for response: ~4,000 tokens
  Total allocated: ~19,000 tokens
-->

<system>
You are a technical support agent. Use the provided knowledge base articles to answer questions. Cite article IDs in your responses.
</system>

<knowledge>
{top_5_rag_chunks}
</knowledge>

<examples>
{2_best_matching_examples}
</examples>

<history>
{summarized_conversation_history}
</history>

<task>
{current_user_message}
</task>`,
		modelNotes:
			"Token budget planning is essential for production systems. Claude's 200k context window provides more headroom but performance still degrades with excessive irrelevant context. GPT-4 Turbo's 128k window requires careful allocation. All models perform better with focused, relevant context than with everything dumped in. Use retrieval to select the most relevant chunks rather than including everything.",
	},
	{
		slug: "structured-context-formatting",
		title: "Structured Context Formatting",
		summary:
			"Use XML tags, markdown headers, and delimiters to organize context into clearly separated sections.",
		whenToUse: [
			"When prompts contain multiple sections or content types",
			"For mixed content that includes instructions, data, and examples",
			"When clarity of boundaries between sections is important",
		],
		whenNotToUse: [
			"For simple question-answer prompts",
			"When a single paragraph of instructions suffices",
			"When working with models that don't handle structured formatting well",
		],
		basicExample: {
			before: `I need you to translate this text to French and also summarize it. The text is about machine learning. Make the summary 2 sentences. Here's the text: Machine learning is a subset of artificial intelligence...`,
			after: `<instructions>
Perform both tasks on the text below:
1. Translate the full text to French
2. Provide a 2-sentence summary in English
</instructions>

<text>
Machine learning is a subset of artificial intelligence...
</text>

<output_format>
## Translation
(French translation here)

## Summary
(2-sentence English summary here)
</output_format>`,
		},
		advancedExample: `<system>
You are a legal document analyst specializing in contract review.
</system>

<instructions>
Review the contract below against the compliance checklist. For each checklist item, indicate PASS, FAIL, or NEEDS_REVIEW with a brief explanation.
</instructions>

<compliance_checklist>
- Data retention clause present and within 7-year maximum
- Liability cap defined and reasonable
- Termination clause allows 30-day notice
- Intellectual property assignment is mutual
- Force majeure clause is included
</compliance_checklist>

<contract>
{contract_text}
</contract>

<output_format>
| Checklist Item | Status | Notes |
|---------------|--------|-------|
(one row per item)

## Overall Assessment
(1-2 paragraph summary with recommendation)
</output_format>`,
		modelNotes:
			"XML tags are the gold standard for Claude, which is specifically optimized for them. GPT-4 handles both XML and markdown delimiters well. Gemini works best with markdown headers. For cross-model compatibility, markdown headers with clear separators (---) are the safest choice. Consistency in formatting style within a single prompt is more important than which style you choose.",
	},
	{
		slug: "conditional-inclusion",
		title: "Conditional Inclusion",
		summary:
			"Include or exclude context blocks based on input type, user role, or other dynamic conditions.",
		whenToUse: [
			"When building dynamic prompts that serve multiple use cases",
			"For systems handling varied input types that need different context",
			"When different user roles or scenarios require different instructions",
		],
		whenNotToUse: [
			"For static prompts that always behave the same way",
			"When the added complexity outweighs the benefit",
			"When all users and inputs should receive identical treatment",
		],
		basicExample: {
			before: `You are a customer support agent. Handle the customer's question. Here's our refund policy, shipping policy, and technical troubleshooting guide.
{all_policies}`,
			after: `You are a customer support agent. Handle the customer's question using only the relevant policy below.

<!-- Include based on ticket category -->
<policy type="refund">
{refund_policy}
</policy>

Customer question: {question}`,
		},
		advancedExample: `<system>
You are a code review assistant. Adapt your review based on the context provided.
</system>

<!-- Always included -->
<standards>
{team_coding_standards}
</standards>

<!-- Included only if PR touches security-sensitive files -->
<security_checklist>
{security_review_checklist}
</security_checklist>

<!-- Included only if PR includes database changes -->
<database_guidelines>
{migration_best_practices}
</database_guidelines>

<!-- Included only if PR is from a junior developer -->
<mentoring_mode>
Provide extra explanation for complex suggestions. Include links to relevant documentation. Frame feedback as learning opportunities rather than criticisms.
</mentoring_mode>

<code_diff>
{pr_diff}
</code_diff>

<task>
Review this PR. Focus on the areas most relevant to the types of changes made.
</task>`,
		modelNotes:
			"Conditional inclusion is a prompt engineering pattern implemented in the application layer, not by the model itself. Build your prompt template system to dynamically assemble context blocks based on conditions. All major LLMs benefit from receiving only relevant context rather than everything. This technique pairs well with token budget allocation to stay within limits.",
	},
	{
		slug: "knowledge-delineation",
		title: "Knowledge Delineation",
		summary:
			"Clearly separate different knowledge sources so the model can attribute information correctly and handle conflicts between sources.",
		whenToUse: [
			"When providing reference material from multiple sources",
			"In RAG systems pulling from different document collections",
			"When the model needs to cite or prioritize certain sources over others",
		],
		whenNotToUse: [
			"When all knowledge comes from a single authoritative source",
			"For prompts that rely on the model's general knowledge only",
			"When source attribution is not important",
		],
		basicExample: {
			before: `Here's some information about our product. Answer customer questions.

{mixed_docs_and_faq_and_changelog}`,
			after: `<knowledge source="official_docs" priority="high">
{product_documentation}
</knowledge>

<knowledge source="faq" priority="medium">
{frequently_asked_questions}
</knowledge>

<knowledge source="changelog" priority="low">
{recent_changelog}
</knowledge>

When answering, prefer official docs over FAQ, and FAQ over changelog. Cite which source you used.

Customer question: {question}`,
		},
		advancedExample: `<system>
You are a research assistant synthesizing information from multiple sources. Always indicate which source supports each claim.
</system>

<source id="peer_reviewed" reliability="high">
{peer_reviewed_papers}
</source>

<source id="industry_reports" reliability="medium">
{industry_reports}
</source>

<source id="blog_posts" reliability="low">
{technical_blog_posts}
</source>

<source_hierarchy>
When sources conflict:
1. Peer-reviewed research takes precedence
2. Industry reports are used for market data and trends
3. Blog posts are used only for practical implementation details
4. Flag any significant contradictions between sources
</source_hierarchy>

<task>
Research question: {research_question}

Provide a comprehensive answer with source citations in the format [source_id].
</task>`,
		modelNotes:
			"Knowledge delineation is crucial for RAG applications. Claude handles source-attributed knowledge well and can maintain source boundaries reliably. GPT-4 also respects explicit source hierarchies. Without delineation, models tend to blend sources and may hallucinate connections between unrelated documents. Use consistent tagging (XML or markdown) to make boundaries unambiguous.",
	},
	{
		slug: "negative-context",
		title: "Negative Context (What to Exclude)",
		summary:
			"Explicitly tell the model what NOT to include or draw from in the provided context to filter out noise and irrelevant information.",
		whenToUse: [
			"When context contains noisy or irrelevant data alongside useful information",
			"For filtering out outdated information from otherwise valid context",
			"When RAG retrieval returns partially relevant chunks with irrelevant sections",
		],
		whenNotToUse: [
			"When all provided context is clean and focused",
			"When it's easier to just remove the irrelevant context beforehand",
			"When the exclusion list would be longer than the useful context",
		],
		basicExample: {
			before: `Here is the meeting transcript. Summarize the key decisions.

{full_transcript_including_small_talk}`,
			after: `<transcript>
{full_transcript}
</transcript>

<exclude>
Ignore the following when summarizing:
- Small talk and greetings at the start and end
- Off-topic tangents and jokes
- Repeated statements or stuttering
- Any discussion about lunch plans
</exclude>

Summarize only the substantive decisions and action items from this meeting.`,
		},
		advancedExample: `<system>
You are a financial analyst reviewing quarterly earnings data.
</system>

<data>
{quarterly_report_with_all_sections}
</data>

<exclude>
Do NOT use or reference:
- Forward-looking statements or projections (these are legally unreliable)
- Footnotes marked as "unaudited estimates"
- Data from previous quarters included for comparison (focus on current quarter only)
- Marketing language from the executive summary
</exclude>

<include_only>
Focus exclusively on:
- Audited financial figures
- Year-over-year percentage changes
- Segment-level breakdown
- Cash flow statements
</include_only>

<task>
Provide a factual analysis of this quarter's financial performance. Flag any metrics that show significant deviation from industry averages.
</task>`,
		modelNotes:
			"Negative context instructions help all models filter noisy RAG results. Claude is particularly responsive to explicit exclusion directives. GPT-4 handles them well but may occasionally reference excluded content if it seems highly relevant. For best results, combine negative context with structured formatting so the boundaries between included and excluded content are visually clear.",
	},
	{
		slug: "context-windowing",
		title: "Context Windowing Strategies",
		summary:
			"Manage context across long conversations or multi-part document processing by strategically selecting what stays in the window.",
		whenToUse: [
			"For multi-turn conversations that approach context window limits",
			"When processing documents too large for a single context window",
			"For maintaining coherence across long agent interactions",
		],
		whenNotToUse: [
			"For single-turn interactions with short context",
			"When the entire conversation and context fits comfortably in the window",
			"When a fresh context per turn is acceptable",
		],
		basicExample: {
			before: `{entire_conversation_history_from_50_turns}

User: What did we decide about the database migration?`,
			after: `<conversation_summary>
Key decisions from this conversation:
- Agreed to migrate from MySQL to PostgreSQL (Turn 12)
- Timeline set to Q2 with phased rollout (Turn 18)
- Budget approved for $50k (Turn 25)
</conversation_summary>

<recent_messages>
{last_5_turns}
</recent_messages>

User: What did we decide about the database migration?`,
		},
		advancedExample: `<system>
You are processing a large legal document in chunks. Maintain running context across chunks.
</system>

<running_summary>
Chunks processed so far: 1-4 of 12
Key entities identified: {entity_list}
Important clauses found: {clause_summaries}
Open references needing resolution: {forward_references}
</running_summary>

<previous_chunk_tail>
{last_500_tokens_of_previous_chunk}
</previous_chunk_tail>

<current_chunk number="5">
{current_document_chunk}
</current_chunk>

<task>
1. Process the current chunk, extracting key entities, clauses, and obligations
2. Resolve any open references from previous chunks if this chunk contains the answers
3. Note any new forward references that need resolution in later chunks
4. Update the running summary with findings from this chunk

Respond with the updated running summary and any extracted information.
</task>`,
		modelNotes:
			"Context windowing is an application-level strategy critical for production systems. Claude's 200k context window provides more room but still benefits from summarization of older turns. GPT-4 Turbo's 128k window requires more aggressive windowing. Key strategies: rolling summaries, entity extraction, importance-based retention. Never rely solely on recency — maintain key decisions and entities from early in the conversation.",
	},
];

export function getTechnique(slug: string): Technique | undefined {
	return TECHNIQUES.find((t) => t.slug === slug);
}
