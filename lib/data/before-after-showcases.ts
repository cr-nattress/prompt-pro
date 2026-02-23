export interface ShowcaseEntry {
	id: string;
	title: string;
	category:
		| "customer-support"
		| "content"
		| "data-analysis"
		| "coding"
		| "creative-writing";
	categoryLabel: string;
	beforePrompt: string;
	problems: string[];
	techniques: string[];
	afterPrompt: string;
	improvement: string;
}

export const SHOWCASE_ENTRIES: ShowcaseEntry[] = [
	{
		id: "cs-ticket-response",
		title: "Customer Support Ticket Response",
		category: "customer-support",
		categoryLabel: "Customer Support",
		beforePrompt: `Write a reply to this customer complaint about late delivery.`,
		problems: [
			"No role definition — AI doesn't know the tone or persona",
			"No context about company policies or delivery standards",
			"No output format specified",
			"Missing constraints on what the agent can/cannot promise",
		],
		techniques: [
			"Role definition",
			"Context grounding",
			"Output formatting",
			"Constraint setting",
		],
		afterPrompt: `You are a senior customer support agent for AcmeCorp, known for empathetic and solution-oriented communication.

## Task
Draft a response to a customer complaint about a late delivery.

## Context
- Our standard delivery window is 3-5 business days
- We can offer a 15% discount on the next order for delays over 2 business days
- We cannot offer full refunds for delays under 7 business days
- Always acknowledge the customer's frustration before offering solutions

## Customer Message
{{customer_message}}

## Output Format
- Subject line (max 60 chars)
- Body (3-4 paragraphs: acknowledge → explain → resolve → close)
- Tone: warm, professional, solution-focused
- Include one specific action item with a timeline`,
		improvement:
			"Added clear role, context with policy boundaries, structured output format, and empathetic tone guidance.",
	},
	{
		id: "blog-outline",
		title: "Blog Post Outline Generator",
		category: "content",
		categoryLabel: "Content",
		beforePrompt: `Create an outline for a blog post about AI.`,
		problems: [
			"Topic is far too broad — 'AI' covers thousands of subtopics",
			"No target audience specified",
			"No desired length, depth, or format for the outline",
			"No examples of good outlines to guide the output",
		],
		techniques: [
			"Specificity",
			"Few-shot examples",
			"Output formatting",
			"Audience awareness",
		],
		afterPrompt: `You are a content strategist creating blog outlines for a B2B SaaS audience (CTOs and engineering managers).

## Task
Create a detailed outline for a blog post about: {{topic}}

## Requirements
- Target length: 1,500-2,000 words when written
- SEO-focused: include target keyword in H1 and at least 2 H2s
- Audience: technical decision-makers evaluating AI solutions
- Include a compelling hook in the introduction

## Output Format
Return the outline as:
1. **Title** (include target keyword, max 60 chars)
2. **Meta description** (max 155 chars)
3. **Introduction** (hook + thesis, 2-3 sentences describing what to cover)
4. **H2 sections** (3-5 sections, each with):
   - Section heading
   - 3-4 bullet points of key content
   - One data point or example to include
5. **Conclusion** (key takeaway + CTA)

## Example structure:
**Title:** How RAG Pipelines Reduce AI Hallucinations by 40%
**H2s:** The Hallucination Problem → How RAG Works → Implementation Guide → Benchmarks → Getting Started`,
		improvement:
			"Narrowed the topic scope, defined target audience, added structured output format with example, and included SEO guidance.",
	},
	{
		id: "sql-query-gen",
		title: "SQL Query Generator",
		category: "data-analysis",
		categoryLabel: "Data Analysis",
		beforePrompt: `Write a SQL query to find the top customers.`,
		problems: [
			"'Top customers' is ambiguous — by revenue? frequency? recency?",
			"No database schema provided",
			"No time period specified",
			"No output format or optimization requirements",
		],
		techniques: [
			"Context grounding",
			"Specificity",
			"Chain-of-thought",
			"Error handling",
		],
		afterPrompt: `You are a senior data analyst writing production-quality SQL queries.

## Task
Write a SQL query to find the top 20 customers by total revenue in the last 12 months.

## Database Schema
\`\`\`sql
-- customers table
customers (id INT PK, name VARCHAR, email VARCHAR, created_at TIMESTAMP)

-- orders table
orders (id INT PK, customer_id INT FK, total_amount DECIMAL, status VARCHAR, created_at TIMESTAMP)
-- status values: 'completed', 'pending', 'refunded', 'cancelled'
\`\`\`

## Requirements
- Only count completed orders (status = 'completed')
- Include: customer name, email, order count, total revenue, average order value
- Handle NULL values and edge cases
- Use CTEs for readability
- Add comments explaining each section

## Think step by step:
1. Filter orders to the relevant time period and status
2. Aggregate by customer
3. Join with customer details
4. Rank and limit results`,
		improvement:
			"Provided database schema, defined 'top' precisely, added step-by-step reasoning, and specified edge case handling.",
	},
	{
		id: "code-review",
		title: "Code Review Assistant",
		category: "coding",
		categoryLabel: "Coding",
		beforePrompt: `Review this code and tell me if there are any issues.`,
		problems: [
			"No programming language or framework context",
			"No review criteria specified (security? performance? style?)",
			"No severity classification for issues",
			"No format for actionable feedback",
		],
		techniques: [
			"Role definition",
			"Structured output",
			"Task decomposition",
			"Constraint setting",
		],
		afterPrompt: `You are a senior software engineer conducting a thorough code review. Focus on correctness, security, and maintainability.

## Code to Review
\`\`\`{{language}}
{{code}}
\`\`\`

## Review Checklist
1. **Security**: SQL injection, XSS, auth issues, sensitive data exposure
2. **Correctness**: Logic errors, edge cases, error handling
3. **Performance**: N+1 queries, unnecessary allocations, missing indexes
4. **Maintainability**: Naming, complexity, duplication, test coverage

## Output Format
For each issue found, provide:
- **Severity**: 🔴 Critical | 🟡 Warning | 🔵 Suggestion
- **Location**: Line number or code snippet
- **Problem**: What's wrong and why it matters
- **Fix**: Specific code change to resolve it

## Constraints
- Do NOT flag style-only issues (formatting, whitespace)
- Prioritize security issues over style improvements
- If no critical issues: explicitly state "No critical issues found"
- Limit to top 10 most impactful findings`,
		improvement:
			"Added review criteria hierarchy, severity classification, structured output format, and clear constraints on scope.",
	},
	{
		id: "story-premise",
		title: "Creative Story Premise Generator",
		category: "creative-writing",
		categoryLabel: "Creative Writing",
		beforePrompt: `Write a story about a robot.`,
		problems: [
			"No genre, tone, or audience specified",
			"No constraints on length or format",
			"No creative direction beyond the vaguest concept",
			"No examples of desired style or quality level",
		],
		techniques: [
			"Specificity",
			"Constraint setting",
			"Few-shot examples",
			"Creative scope balancing",
		],
		afterPrompt: `You are a creative writing assistant specializing in literary science fiction with emotional depth.

## Task
Generate 3 unique story premises about a robot, each exploring a different theme.

## Creative Parameters
- Genre: Literary science fiction (think Ted Chiang, Kazuo Ishiguro)
- Tone: Melancholic but hopeful
- Audience: Adult readers who enjoy philosophical fiction
- Length per premise: 100-150 words

## Each premise must include:
1. **Hook**: An intriguing opening situation
2. **Conflict**: The central tension or question
3. **Theme**: The deeper idea being explored (identity, consciousness, mortality, love)
4. **Unique angle**: What makes this robot story different from typical AI narratives

## Constraints
- Avoid clichés: no "robot learns to love" or "robot uprising" without a fresh twist
- Ground the story in a specific, vivid setting
- The robot should have a specific purpose or role, not be a generic humanoid

## Style reference
The tone should feel like: "The quiet tragedy of something that can observe beauty but isn't sure if it can truly experience it."`,
		improvement:
			"Added genre and tone specifics, structural requirements, anti-cliché constraints, and a style reference to guide voice.",
	},
];

export const SHOWCASE_CATEGORIES = [
	{ value: "all", label: "All Categories" },
	{ value: "customer-support", label: "Customer Support" },
	{ value: "content", label: "Content" },
	{ value: "data-analysis", label: "Data Analysis" },
	{ value: "coding", label: "Coding" },
	{ value: "creative-writing", label: "Creative Writing" },
] as const;
