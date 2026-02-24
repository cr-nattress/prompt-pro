export interface LessonExercise {
	instruction: string;
	starterPrompt: string;
	evaluationCriteria: string[];
}

export interface Lesson {
	slug: string;
	title: string;
	estimatedMinutes: number;
	concept: string;
	beforeExample: string;
	afterExample: string;
	keyTakeaway: string;
	exercise: LessonExercise;
}

export interface LearningPath {
	slug: string;
	title: string;
	description: string;
	difficulty: "beginner" | "intermediate" | "advanced";
	prerequisite: string | null;
	requiredLevel?: number | undefined;
	lessons: Lesson[];
}

export const LEARNING_PATHS: LearningPath[] = [
	{
		slug: "prompt-foundations",
		title: "Prompt Foundations",
		description:
			"Master the fundamentals of writing clear, effective prompts. Learn structure, specificity, output formatting, and how to avoid common mistakes.",
		difficulty: "beginner",
		prerequisite: null,
		requiredLevel: 1,
		lessons: [
			{
				slug: "anatomy-of-a-good-prompt",
				title: "Anatomy of a Good Prompt",
				estimatedMinutes: 10,
				concept: `Every effective prompt shares a common anatomy: it clearly communicates who the AI should be, what it should do, and how it should respond. Understanding this structure is the foundation of prompt engineering.

A well-structured prompt typically contains three core elements:

**Role** — Who should the AI act as? Defining a role anchors the AI's expertise, vocabulary, and perspective. "You are a senior backend engineer" produces very different output than "You are a marketing copywriter."

**Task** — What should the AI do? The task is the heart of the prompt. It should be specific, actionable, and unambiguous. Instead of "help me with my code," try "review this Python function for performance issues and suggest optimizations."

**Output format** — How should the response be structured? Should it be a bulleted list, JSON, a paragraph, a table? Specifying the format eliminates guesswork and makes the response immediately useful.

When all three elements are present and clear, the AI has everything it needs to produce a focused, high-quality response. When any element is missing, the AI fills in the gaps with assumptions — which often leads to disappointing results.`,
				beforeExample: `Help me with my code. It's not working right and I need to fix it.`,
				afterExample: `You are a senior Python developer specializing in data processing.

Review the following Python function that processes CSV files. Identify:
1. Any bugs or logic errors
2. Performance issues with large files (100K+ rows)
3. Missing error handling

Return your analysis as a markdown document with these sections:
- **Bugs Found** — list each bug with line number and fix
- **Performance Issues** — describe each issue and suggest an optimization
- **Error Handling Gaps** — list missing checks and recommended additions

Here is the function:
\`\`\`python
def process_csv(filepath):
    data = open(filepath).read()
    rows = data.split("\\n")
    results = []
    for row in rows:
        cols = row.split(",")
        results.append(float(cols[2]) * 1.1)
    return results
\`\`\``,
				keyTakeaway:
					"Every effective prompt has three parts: Role (who), Task (what), and Output Format (how). Include all three for consistently better results.",
				exercise: {
					instruction:
						"Improve this vague prompt by adding a clear role, specific task, and explicit output format.",
					starterPrompt:
						"Explain databases to me. I want to understand them better for my project.",
					evaluationCriteria: [
						"Defines a specific role or expertise for the AI",
						"Contains a clear, specific task description",
						"Specifies the desired output format",
						"Provides enough context about the audience or use case",
					],
				},
			},
			{
				slug: "being-specific",
				title: "Being Specific",
				estimatedMinutes: 8,
				concept: `Vague prompts produce vague results. The single most impactful improvement you can make to any prompt is replacing ambiguous language with concrete, specific instructions.

Consider the difference between "write something about dogs" and "write a 300-word blog post about the top 3 health benefits of daily walks for senior dogs, targeting dog owners aged 40-60, in a warm and informative tone." The second prompt leaves almost nothing to chance.

Specificity operates on several dimensions:

**Scope** — How much ground should the response cover? "Tell me about JavaScript" is unbounded. "Explain the difference between \`let\`, \`const\`, and \`var\` in JavaScript" is bounded.

**Quantity** — How much output? "Give me some ideas" vs. "Give me exactly 5 ideas, each in one sentence."

**Audience** — Who is this for? "Explain machine learning" vs. "Explain machine learning to a 10-year-old using everyday analogies."

**Quality criteria** — What makes a good response? "Write a product description" vs. "Write a product description that emphasizes durability, includes a call to action, and stays under 100 words."

Every vague word in your prompt is an invitation for the AI to make assumptions. Replace "good," "nice," "detailed," and "comprehensive" with measurable, concrete criteria.`,
				beforeExample: `Write something about dogs.`,
				afterExample: `Write a 300-word blog post about the top 3 health benefits of daily walks for senior dogs (ages 8+).

Target audience: Dog owners aged 40-60 who may not realize their older dog still needs regular exercise.

Tone: Warm, encouraging, and backed by veterinary insights.

Structure:
- Opening hook (1-2 sentences)
- Benefit 1: Joint health and mobility
- Benefit 2: Weight management
- Benefit 3: Mental stimulation and mood
- Closing call-to-action encouraging readers to start with 15-minute walks

Do not use medical jargon. Keep sentences short and readable.`,
				keyTakeaway:
					"Replace every vague word with a specific, measurable criterion. Specificity in scope, quantity, audience, and quality criteria eliminates guesswork.",
				exercise: {
					instruction:
						"Make this prompt as specific as possible by adding scope, quantity, audience, and quality constraints.",
					starterPrompt: "Give me some marketing ideas for my new app.",
					evaluationCriteria: [
						"Specifies how many ideas to generate",
						"Describes the app or product being marketed",
						"Defines the target audience",
						"Includes constraints on format, length, or style",
						"Mentions at least one quality criterion",
					],
				},
			},
			{
				slug: "output-format",
				title: "Output Formatting",
				estimatedMinutes: 8,
				concept: `One of the most underused prompt techniques is explicitly specifying the output format. When you tell the AI exactly how to structure its response, you get predictable, immediately usable results.

Without format instructions, the AI defaults to prose paragraphs — which may not be what you need. If you want JSON, you'll get prose. If you want a table, you'll get a list. If you want bullet points, you might get an essay.

Common format specifications include:

**Structured data** — "Return your answer as a JSON object with keys: name, category, priority (1-5), and reasoning." This is essential for programmatic use.

**Lists and tables** — "Present your findings as a markdown table with columns: Issue, Severity, Recommendation." Tables are great for comparisons.

**Templates** — "Follow this exact template for each item: **[Title]** — [One sentence description]. Priority: [High/Medium/Low]." Templates ensure consistency across items.

**Length constraints** — "Keep each bullet point to one sentence maximum" or "Your entire response should be under 200 words." Length constraints prevent rambling.

You can also provide an example of the desired output format directly in your prompt. This removes all ambiguity about what "the right format" looks like.`,
				beforeExample: `What are the pros and cons of using TypeScript?`,
				afterExample: `Analyze the pros and cons of using TypeScript in a large-scale web application (50+ developers, 500K+ lines of code).

Return your analysis as a markdown table with these columns:
| Category | Point | Impact (High/Medium/Low) | Details |

Include exactly:
- 5 pros
- 5 cons

After the table, provide a one-paragraph summary recommendation (3-4 sentences max) addressing whether TypeScript is worth the migration cost for a team currently using JavaScript.

Do not include generic points like "TypeScript is popular." Focus on concrete technical and team-productivity impacts.`,
				keyTakeaway:
					"Always specify the output format explicitly — JSON, markdown table, bullet list, or template. Provide an example when the format is complex.",
				exercise: {
					instruction:
						"Add explicit output format requirements to this prompt, including structure, length, and an example of the expected format.",
					starterPrompt:
						"Compare React, Vue, and Svelte for building a dashboard application.",
					evaluationCriteria: [
						"Specifies a clear output format (table, JSON, list, etc.)",
						"Includes length or quantity constraints",
						"Defines what dimensions to compare along",
						"Provides an example of the desired format or a template to follow",
					],
				},
			},
			{
				slug: "tone-and-audience",
				title: "Tone and Audience",
				estimatedMinutes: 8,
				concept: `The same information can be communicated in vastly different ways depending on who's reading it and what tone is appropriate. Prompt engineering for tone and audience is about explicitly guiding these choices rather than leaving them to chance.

**Audience** shapes complexity, vocabulary, and assumed knowledge. Explaining "how APIs work" to a CTO, a junior developer, and a non-technical product manager should produce three very different responses. Always specify:
- Who the reader is
- What they already know
- What they need to learn

**Tone** shapes the emotional character of the response. Common tone descriptors include:
- Professional, formal, authoritative
- Casual, friendly, conversational
- Academic, precise, citation-heavy
- Encouraging, supportive, patient

You can combine audience and tone naturally: "Explain this to a junior developer in a friendly, encouraging tone, as if you're a patient senior colleague during a code review."

A common mistake is using only one dimension. "Be professional" tells the AI about tone but not audience. "Write for developers" tells it about audience but not tone. Always specify both for the best results.

Tone also interacts with format. A casual tone pairs well with short paragraphs and emoji. A professional tone pairs well with headers and structured sections. Consider how tone and format reinforce each other.`,
				beforeExample: `Explain what a REST API is.`,
				afterExample: `Explain what a REST API is to a non-technical product manager who needs to understand it well enough to have informed conversations with the engineering team.

Tone: Professional but accessible. Avoid jargon entirely. Use real-world analogies (e.g., comparing API calls to ordering at a restaurant).

Structure:
1. One-sentence definition a PM could repeat in a meeting
2. A simple analogy that makes the concept click
3. Why PMs should care (3 bullet points about how APIs affect product decisions)
4. Key terms to know: endpoint, request, response, status code — each in one plain-English sentence

Keep the total response under 300 words. Do not include code examples.`,
				keyTakeaway:
					"Always specify both audience (who's reading) and tone (how it should sound). These two dimensions together shape vocabulary, complexity, and communication style.",
				exercise: {
					instruction:
						"Rewrite this prompt to target a specific audience with an appropriate tone, and include instructions about vocabulary and complexity level.",
					starterPrompt: "Write about the importance of cybersecurity.",
					evaluationCriteria: [
						"Defines a specific target audience",
						"Specifies the desired tone",
						"Includes guidance on vocabulary or jargon usage",
						"Addresses the audience's existing knowledge level",
					],
				},
			},
			{
				slug: "common-mistakes",
				title: "Common Prompt Mistakes",
				estimatedMinutes: 10,
				concept: `Even experienced prompt engineers fall into recurring traps. Recognizing these anti-patterns is just as important as learning good techniques.

**Mistake 1: The Kitchen Sink** — Cramming too many unrelated requests into a single prompt. "Write a blog post, generate SEO keywords, create social media captions, and suggest a publication schedule." Each task dilutes the other. Split complex requests into focused, sequential prompts.

**Mistake 2: Assumed Context** — Expecting the AI to know things it can't. "Fix the bug in my app" assumes the AI can see your code, environment, and error messages. Always provide the specific context the AI needs.

**Mistake 3: Double Negatives and Ambiguity** — "Don't not include examples" or "Write a response that isn't too short but isn't too long either." Negative instructions are harder to follow than positive ones. Instead of "don't be too technical," say "write at a 10th-grade reading level."

**Mistake 4: No Success Criteria** — "Write a good email." What makes it "good"? Without explicit quality criteria, you're relying on the AI's default interpretation. Define what success looks like: "Write an email that's under 150 words, includes a clear call to action, and maintains a professional tone."

**Mistake 5: Premature Optimization** — Over-engineering prompts with excessive constraints before testing a simpler version. Start with a clear, minimal prompt. Add constraints only when the output doesn't meet your needs. Iterate based on actual results, not hypothetical problems.

The antidote to all five mistakes is the same: clarity, specificity, and iteration. Write your prompt, test it, identify what's wrong, and refine.`,
				beforeExample: `Write me a blog post about AI. Make it good and SEO-friendly. Also include some tweets I can post about it and a LinkedIn post. And give me a content calendar for the next month. Make sure it's not too long but covers everything important.`,
				afterExample: `You are an experienced tech blogger writing for a developer audience (mid-level engineers).

Write a blog post about practical applications of AI code assistants in everyday development workflows.

Requirements:
- Length: 800-1000 words
- Structure: Introduction, 3 main sections with headers, conclusion
- Tone: Informative and opinionated, with concrete examples
- Include one real-world scenario per section (e.g., "When reviewing a PR, I use...")
- End with a clear takeaway the reader can apply today

SEO guidance:
- Target keyword: "AI code assistant productivity"
- Include the keyword naturally in the title, first paragraph, and one H2
- Write a meta description (under 160 characters)

Do NOT include social media content — I'll handle that separately.`,
				keyTakeaway:
					"Avoid the five common mistakes: kitchen sink prompts, assumed context, ambiguous language, missing success criteria, and premature optimization. Clarity beats complexity.",
				exercise: {
					instruction:
						"This prompt has multiple common mistakes. Identify and fix them to produce a clean, focused prompt.",
					starterPrompt: `Help me with my presentation. It should be about our Q3 results and include all the important stuff. Don't make it boring but don't make it too casual either. Also add some charts and a handout and talking points. Keep it short but comprehensive.`,
					evaluationCriteria: [
						"Focuses on a single, clear task (not kitchen sink)",
						"Provides specific context instead of assuming knowledge",
						"Uses positive instructions instead of vague negatives",
						"Defines explicit success criteria or quality standards",
						"Has a clear, specific output format",
					],
				},
			},
		],
	},
	{
		slug: "intermediate-techniques",
		title: "Intermediate Techniques",
		description:
			"Level up with few-shot examples, chain-of-thought reasoning, task decomposition, negative constraints, and edge-case handling.",
		difficulty: "intermediate",
		prerequisite: "prompt-foundations",
		requiredLevel: 2,
		lessons: [
			{
				slug: "few-shot-prompting",
				title: "Few-Shot Prompting",
				estimatedMinutes: 10,
				concept: `Few-shot prompting is the technique of providing a small number of input-output examples in your prompt to demonstrate the desired behavior. Instead of describing what you want in abstract terms, you show the AI exactly what good output looks like.

**Why it works:** Language models are exceptional pattern matchers. When you provide 2-3 consistent examples, the model extracts the implicit pattern — formatting, tone, level of detail, categorization logic — and applies it to new inputs. This is often more effective than pages of written instructions.

**When to use it:**
- When you need consistent formatting across many inputs
- When the task involves classification or categorization
- When zero-shot (no examples) produces inconsistent results
- When the desired style or tone is hard to describe in words

**Choosing good examples:**
1. Cover the typical cases, not just easy ones
2. Include at least one edge case or boundary example
3. Keep examples consistent in format and level of detail
4. Make examples different enough to show the range of expected inputs

**Common mistakes:**
- Too many examples (3 is usually sufficient; more wastes tokens)
- Examples that are too similar (the model overfits to the pattern)
- Inconsistent formatting between examples (confuses the model)
- Examples that contradict your written instructions`,
				beforeExample: `Categorize the following customer feedback as positive, negative, or neutral.

"The shipping was slow but the product quality exceeded my expectations."`,
				afterExample: `Categorize customer feedback as Positive, Negative, or Neutral. Provide a confidence score (High/Medium/Low) and a one-sentence explanation.

Examples:

Feedback: "Absolutely love this product! Best purchase I've made all year."
Category: Positive
Confidence: High
Reason: Unambiguous enthusiasm with superlative language.

Feedback: "Product broke after two days. Waste of money."
Category: Negative
Confidence: High
Reason: Clear dissatisfaction with product failure reported.

Feedback: "It's okay. Does what it says but nothing special."
Category: Neutral
Confidence: Medium
Reason: Lukewarm assessment without strong positive or negative signals.

Now categorize this feedback:

Feedback: "The shipping was slow but the product quality exceeded my expectations."
Category:
Confidence:
Reason:`,
				keyTakeaway:
					"2-3 well-chosen examples are often more effective than pages of instructions. Choose diverse, consistent examples that cover typical cases and edge cases.",
				exercise: {
					instruction:
						"Convert this zero-shot prompt into a few-shot prompt by adding 2-3 diverse examples that demonstrate the desired output format and classification logic.",
					starterPrompt: `Analyze the tone of the following email and classify it as Formal, Informal, or Aggressive. Then suggest improvements.

Email: "Hey, just wanted to check in on that report. Any update? We really need it by Friday or the whole project timeline is at risk."`,
					evaluationCriteria: [
						"Includes 2-3 input-output examples before the actual task",
						"Examples cover different categories (formal, informal, aggressive)",
						"Examples are consistent in format and level of detail",
						"Examples demonstrate the complete expected output structure",
						"At least one example shows an edge case or borderline classification",
					],
				},
			},
			{
				slug: "chain-of-thought",
				title: "Chain-of-Thought Reasoning",
				estimatedMinutes: 10,
				concept: `Chain-of-thought (CoT) prompting asks the AI to show its reasoning step by step before arriving at a conclusion. This technique dramatically improves accuracy on tasks that require logic, math, or multi-step analysis.

**Why it works:** When forced to articulate intermediate reasoning steps, the model is less likely to skip logic, make arithmetic errors, or jump to conclusions. Each step serves as a checkpoint that grounds the next step.

**The simplest form** is adding "Think through this step by step" or "Let's work through this systematically" to your prompt. Even this small addition can improve accuracy on reasoning tasks by 20-40%.

**Structured CoT** takes this further by defining the specific reasoning steps you want the model to follow:

1. "First, identify the key variables in this problem."
2. "Next, determine the relationships between them."
3. "Then, calculate the intermediate values."
4. "Finally, derive the answer and verify it."

**When to use CoT:**
- Math and logic problems
- Code debugging (trace execution step by step)
- Decision-making with multiple factors
- Analysis tasks where you need to audit the reasoning

**When NOT to use CoT:**
- Simple factual questions ("What is the capital of France?")
- Creative writing (CoT can make it feel stilted)
- When you need very short responses
- When token budget is extremely limited

CoT pairs well with output formatting: ask for the reasoning in one section and the final answer in another. This way you can quickly find the answer while having the full reasoning available for review.`,
				beforeExample: `A store has 3 shirts at $25 each and 2 pants at $40 each. There's a 15% discount on orders over $100. What's the total?`,
				afterExample: `A store has 3 shirts at $25 each and 2 pants at $40 each. There's a 15% discount on orders over $100. What's the total?

Think through this step by step:

1. First, calculate the subtotal for each item type.
2. Then, calculate the overall subtotal.
3. Check if the discount threshold ($100) is met.
4. If applicable, calculate the discount amount.
5. Compute the final total.

Show your work for each step, then provide the final answer clearly labeled as:

**Final Total: $[amount]**`,
				keyTakeaway:
					"Adding 'think step by step' improves accuracy on reasoning tasks. For best results, define the specific reasoning steps you want the model to follow.",
				exercise: {
					instruction:
						"Add chain-of-thought reasoning to this prompt by specifying the intermediate steps the AI should work through before giving its final answer.",
					starterPrompt: `I have a function with a bug. It should return the average of positive numbers in an array, but it's returning the wrong result. What's wrong?

function avgPositive(nums) {
  let sum = 0;
  let count = 0;
  for (let i = 0; i <= nums.length; i++) {
    if (nums[i] > 0) {
      sum += nums[i];
      count++;
    }
  }
  return sum / count;
}`,
					evaluationCriteria: [
						"Asks the AI to reason step by step before concluding",
						"Defines specific analysis steps (e.g., trace execution, check loop bounds)",
						"Requests the reasoning to be shown separately from the final answer",
						"Specifies a clear output format for the bug report",
					],
				},
			},
			{
				slug: "step-by-step-decomposition",
				title: "Task Decomposition",
				estimatedMinutes: 10,
				concept: `Complex tasks overwhelm AI models just like they overwhelm humans. Task decomposition is the technique of breaking a complex request into smaller, manageable sub-tasks that the model can handle one at a time.

**The principle:** If your prompt asks the model to do more than 2-3 things simultaneously, the quality of each sub-task degrades. By decomposing into sequential steps, you get better results on every part.

**Two decomposition strategies:**

**1. Within a single prompt** — Number the steps explicitly:
"Step 1: Analyze the data structure. Step 2: Identify potential issues. Step 3: Suggest fixes for each issue. Step 4: Provide a refactored version."

**2. Across multiple prompts** — Use the output of one prompt as input to the next. This is called "chaining" and is especially powerful for complex workflows like: Summarize → Analyze → Recommend → Draft.

**How to decompose effectively:**
- Identify the logical phases of the task (research, analysis, synthesis, creation)
- Make each step produce a concrete, checkable output
- Order steps so each builds on the previous one
- Keep each step focused on a single type of thinking

**Signs you need decomposition:**
- Your prompt is longer than 300 words
- You're asking for multiple distinct deliverables
- The output quality is inconsistent across sections
- The model seems to "forget" parts of your instructions

Decomposition works because each step gets the model's full attention. The result is more thorough, more consistent, and easier to iterate on — if step 3 is wrong, you only need to re-run step 3, not the entire task.`,
				beforeExample: `Review this codebase and give me a complete analysis with bugs, security issues, performance problems, refactoring suggestions, documentation gaps, and a priority-ranked action plan.`,
				afterExample: `Review the following Express.js route handler. We'll analyze it in focused steps.

Step 1 — Bug Detection:
Read through the code line by line. List any bugs, logic errors, or runtime exceptions. For each bug, provide:
- Line number
- Description of the bug
- Suggested fix (one line)

Step 2 — Security Review:
Check for common vulnerabilities (SQL injection, XSS, missing auth, exposed secrets). For each finding:
- Vulnerability type
- Severity: Critical / High / Medium / Low
- Remediation

Step 3 — Performance Analysis:
Identify N+1 queries, unnecessary allocations, or blocking operations. For each:
- Issue description
- Estimated impact on latency
- Optimization approach

Present each step as a separate section with a clear header. After all three steps, add a **Priority Action Plan** that combines the top 5 most important findings ranked by severity.

\`\`\`javascript
app.get("/users/:id/orders", async (req, res) => {
  const user = await db.query("SELECT * FROM users WHERE id = " + req.params.id);
  const orders = await db.query("SELECT * FROM orders WHERE user_id = " + req.params.id);
  for (const order of orders) {
    order.items = await db.query("SELECT * FROM items WHERE order_id = " + order.id);
  }
  res.json({ user: user[0], orders });
});
\`\`\``,
				keyTakeaway:
					"Break complex tasks into numbered, sequential steps. Each step should produce a concrete output that feeds into the next. This gives every sub-task the model's full attention.",
				exercise: {
					instruction:
						"Decompose this overly broad prompt into 3-4 focused, sequential steps, each with a clear deliverable.",
					starterPrompt: `Analyze our competitor's product, figure out what they're doing better than us, come up with a strategy to beat them, write a proposal for the executive team, and create a timeline for implementation.`,
					evaluationCriteria: [
						"Breaks the task into 3-4 distinct, sequential steps",
						"Each step has a clear, specific deliverable",
						"Steps build on each other logically",
						"Includes output format specifications for each step",
					],
				},
			},
			{
				slug: "negative-constraints",
				title: "Negative Constraints",
				estimatedMinutes: 8,
				concept: `Positive instructions tell the model what to do. Negative constraints tell it what NOT to do — and they're surprisingly powerful for eliminating common failure modes.

**Why negative constraints matter:** AI models have strong default behaviors. They tend to add disclaimers, hedge their responses, include unnecessary caveats, or pad output with filler content. Negative constraints override these defaults.

**Effective negative constraints:**
- "Do NOT include disclaimers or caveats"
- "Do NOT repeat the question in your response"
- "Do NOT use bullet points — use complete sentences"
- "Do NOT include code you haven't tested or verified"
- "Do NOT exceed 200 words"

**The boundary principle:** Think of constraints as defining the boundaries of an acceptable response. Positive instructions define the inside ("include X, Y, Z"). Negative constraints define the outside ("never do A, B, C"). Together, they create a precise target zone.

**Best practices:**
1. Use positive instructions for what you want (primary)
2. Add negative constraints for known failure modes (secondary)
3. Be specific — "don't be verbose" is vague; "keep each response under 3 sentences" is actionable
4. Group constraints visually for clarity (a "Constraints" or "Rules" section)

**Common negative constraints for different use cases:**
- Code generation: "Do not add comments to obvious code. Do not suggest libraries not already in the project."
- Writing: "Do not use clichés. Do not start sentences with 'It is worth noting that'."
- Analysis: "Do not speculate beyond the provided data. Do not include recommendations without evidence."`,
				beforeExample: `Write a product description for a noise-canceling headphone.`,
				afterExample: `Write a product description for the SoundPro X1 noise-canceling headphones.

Target: Audiophiles aged 25-45 shopping on Amazon.
Length: 150-200 words.
Tone: Confident and specific, like a knowledgeable friend recommending gear.

Include:
- One compelling opening line (not a question)
- 3 key features with concrete specs (e.g., "40-hour battery" not "long-lasting")
- One sentence about the target use case

Do NOT:
- Use generic marketing phrases like "cutting-edge" or "next-level"
- Include a price or promotional language
- Start with "Introducing..." or "Meet the..."
- Use more than one exclamation mark
- Include any disclaimers or "results may vary" language
- List more than 3 features (focus beats breadth)`,
				keyTakeaway:
					"Negative constraints eliminate known failure modes. Use positive instructions for what you want, then add specific 'Do NOT' rules for behaviors you've seen and want to prevent.",
				exercise: {
					instruction:
						"Add a set of specific negative constraints to this prompt to prevent common AI failure modes like filler content, hedging, and scope creep.",
					starterPrompt: `You are a career coach. Write advice for someone transitioning from engineering to product management.

Include:
- Key skills to develop
- How to leverage engineering background
- First steps to take`,
					evaluationCriteria: [
						"Adds at least 3 specific negative constraints",
						"Constraints are actionable (not vague like 'don't be bad')",
						"Constraints address real AI failure modes (hedging, filler, scope creep)",
						"Maintains the original positive instructions alongside the new constraints",
					],
				},
			},
			{
				slug: "edge-cases-robustness",
				title: "Edge Cases & Robustness",
				estimatedMinutes: 10,
				concept: `Most prompts work well for the happy path — but real-world inputs are messy. Robust prompts anticipate edge cases, handle unexpected inputs gracefully, and produce useful output even when things don't go as planned.

**What are edge cases in prompting?**
- Empty or missing input fields
- Inputs in the wrong format or language
- Ambiguous requests that could be interpreted multiple ways
- Inputs that are too short or too long
- Adversarial or off-topic inputs

**Building robustness into prompts:**

**1. Explicit fallback instructions:**
"If the input text is empty or unrelated to the task, respond with: { 'error': 'Invalid input', 'reason': '...' }"

**2. Disambiguation instructions:**
"If the request is ambiguous, state your interpretation before proceeding. Format: 'I'm interpreting this as [X]. If you meant something different, please clarify.'"

**3. Input validation guidance:**
"Before processing, verify that the input contains at least one code block. If no code is found, ask the user to provide code to review."

**4. Graceful degradation:**
"If you cannot provide a complete answer, provide what you can and clearly indicate what's missing and why."

**Why this matters for production prompts:**
When prompts are used in applications (chatbots, APIs, automation), they encounter the full spectrum of real-world inputs. A prompt that breaks on edge cases creates poor user experiences and erodes trust. Defensive prompting — like defensive programming — builds reliability into your AI systems.`,
				beforeExample: `Translate the following text to French:
{user_input}`,
				afterExample: `Translate the following text to French.

Input handling rules:
- If the input text is empty, respond with: {"error": "empty_input", "message": "No text provided for translation."}
- If the input is already in French, respond with: {"status": "already_french", "text": "[original text]"}
- If the input contains mixed languages, translate only the non-French portions and preserve French text as-is.
- If the input contains code snippets or technical identifiers, preserve them untranslated (e.g., variable names, function names, URLs).
- If any portion is ambiguous (could be translated multiple ways), provide the primary translation and note the alternative in parentheses.

Output format (JSON):
{
  "translation": "...",
  "notes": ["any edge cases encountered"],
  "confidence": "high" | "medium" | "low"
}

Text to translate:
{user_input}`,
				keyTakeaway:
					"Anticipate edge cases: empty inputs, wrong formats, ambiguous requests, and adversarial content. Add explicit handling instructions so your prompt produces useful output even when inputs are unexpected.",
				exercise: {
					instruction:
						"Add edge case handling to this prompt so it handles empty inputs, ambiguous requests, and unexpected input formats gracefully.",
					starterPrompt: `You are a code review assistant. Review the following pull request diff and provide feedback.

{diff_content}`,
					evaluationCriteria: [
						"Handles empty or missing input explicitly",
						"Addresses ambiguous or unclear inputs",
						"Includes fallback behavior for unexpected formats",
						"Specifies an error response format",
						"Maintains the core functionality for valid inputs",
					],
				},
			},
		],
	},
	{
		slug: "context-engineering-foundations",
		title: "Context Engineering Foundations",
		description:
			"Go beyond prompts: learn to design the full context window with system instructions, knowledge grounding, context layers, and token budget management.",
		difficulty: "advanced",
		prerequisite: "prompt-foundations",
		requiredLevel: 3,
		lessons: [
			{
				slug: "what-is-context-engineering",
				title: "What Is Context Engineering?",
				estimatedMinutes: 12,
				concept: `Context engineering is the discipline of designing and managing everything that goes into an AI model's context window — not just the user's prompt, but the entire information environment the model uses to generate a response.

**Prompt engineering vs. context engineering:**
Prompt engineering focuses on crafting the user's message. Context engineering takes a wider view: it includes system instructions, reference knowledge, examples, tool definitions, conversation history, and the user's message — all carefully orchestrated to produce optimal results.

Think of it this way: a prompt is a single question. Context is the entire briefing packet you hand someone before they answer that question. The quality of the answer depends as much on the briefing as on the question itself.

**The six layers of context:**

1. **System instructions** — The foundational rules, persona, and constraints that shape all responses.
2. **Knowledge** — Reference documents, data, and domain-specific information the model needs.
3. **Examples** — Few-shot demonstrations of desired input/output patterns.
4. **Tools** — Definitions of external capabilities the model can invoke (APIs, functions, databases).
5. **History** — Prior conversation turns that maintain continuity and avoid repetition.
6. **Task** — The user's current request, which all other layers support.

**Why this matters:** As AI applications grow more sophisticated, the user's prompt becomes a smaller fraction of the total context. In production systems, the user's message might be 5% of the context window — the rest is carefully engineered context that makes the response useful, safe, and consistent.

Understanding these layers lets you debug AI behavior systematically. When the output is wrong, you can ask: which layer is missing, contradictory, or insufficient?`,
				beforeExample: `You are a helpful assistant. Answer the user's question.

User: How do I handle authentication in my app?`,
				afterExample: `<system>
You are a senior full-stack engineer specializing in Next.js and TypeScript applications. You work at a consulting firm that builds SaaS products.

Response guidelines:
- Always recommend security best practices
- Prefer established libraries over custom implementations
- Include code examples in TypeScript
- Flag any security risks proactively
</system>

<knowledge>
The user's tech stack: Next.js 14 (App Router), TypeScript, PostgreSQL, deployed on Vercel.
Current auth: None (greenfield project).
Requirements: Email/password + OAuth (Google, GitHub). Need role-based access control for admin/member/viewer.
Compliance: SOC 2 in progress, so audit logging required.
</knowledge>

<examples>
When recommending a library, use this format:
Library: [name]
Why: [1-2 sentences]
Trade-off: [what you give up]
Setup complexity: Low / Medium / High
</examples>

<task>
The user is choosing an authentication approach for their new SaaS app. Recommend an approach, compare 2-3 options, and provide a getting-started code snippet for the recommended option.
</task>`,
				keyTakeaway:
					"Context engineering designs the full information environment — system instructions, knowledge, examples, tools, history, and task — not just the prompt. When AI output is wrong, diagnose which layer is missing or broken.",
				exercise: {
					instruction:
						"Transform this minimal prompt into a fully contextualized prompt using at least 3 of the 6 context layers (system, knowledge, examples, tools, history, task).",
					starterPrompt:
						"Help me write a database query to find inactive users.",
					evaluationCriteria: [
						"Uses at least 3 distinct context layers",
						"Each layer is clearly labeled or separated",
						"Includes relevant background knowledge (schema, tech stack, etc.)",
						"The task layer is specific and actionable",
						"Layers work together coherently to support the task",
					],
				},
			},
			{
				slug: "context-layers",
				title: "Designing Context Layers",
				estimatedMinutes: 12,
				concept: `Each layer in the context window serves a distinct purpose. Understanding when and how to use each layer is the key to effective context engineering.

**Layer 1: System Instructions**
The foundation of every interaction. System instructions define the AI's persona, rules, tone, and boundaries. They persist across the entire conversation and override other inputs when there's a conflict.

Best practices: Keep system instructions focused on behavior and rules, not knowledge. "You are a Python expert who always writes type-annotated code" is a behavior. "Python was created by Guido van Rossum in 1991" is knowledge — put it in the knowledge layer.

**Layer 2: Knowledge**
Reference information the AI needs to do its job: documentation, schemas, style guides, company policies, user data. The knowledge layer provides ground truth that prevents hallucination.

Best practices: Use clear delimiters (XML tags, markdown headers). Label the source and recency of each knowledge block. Prioritize relevance — include only what's needed for the current task.

**Layer 3: Examples**
Few-shot demonstrations that show the desired input/output pattern. Examples are more effective than rules for establishing complex formatting or classification logic.

Best practices: 2-3 examples covering the typical range. Include one edge case. Keep examples consistent in format.

**Layer 4: Tools**
Definitions of external capabilities (functions, APIs, databases) the AI can invoke. Tool definitions tell the model what's available and when to use it.

**Layer 5: History**
Previous conversation turns that maintain context. In long conversations, managing history becomes crucial — you can't include everything, so you need strategies for summarization and selective inclusion.

**Layer 6: Task**
The user's current request. By the time the model reaches this layer, all supporting context is already in place. The task should be specific and assume the context has been read.

**Layering strategy:** Think of layers as a funnel. System instructions are the widest (most general). Each subsequent layer narrows the focus. The task is the most specific. This funnel structure ensures the model has broad rules, relevant knowledge, and a focused task — in that order.`,
				beforeExample: `You are a customer support agent. Here is the customer's question: "Why was I charged twice?"

Respond helpfully.`,
				afterExample: `<system>
You are a customer support agent for TechCo, a SaaS billing platform. You are friendly, empathetic, and solution-oriented. You always:
- Acknowledge the customer's frustration before explaining
- Provide specific next steps, not generic advice
- Escalate to a human agent if the issue involves refunds over $500
- Never share internal system details or pricing logic
</system>

<knowledge source="billing-docs" updated="2025-01-15">
Double charges can occur due to:
1. Payment retry after timeout (most common — 60% of cases)
2. Subscription upgrade mid-cycle creating a prorated charge
3. Genuine billing error (rare — <2% of cases)

Resolution paths:
- Payment retry: Auto-refund within 3-5 business days. If not, create ticket with billing team.
- Proration: Not a double charge — explain the prorated amount.
- Billing error: Immediate refund + $10 credit. Escalate to billing team.
</knowledge>

<history>
Customer: Premium plan, active since 2024-03. Last payment: $49.99 on Feb 1 and $49.99 on Feb 1 (same amount, same day). No recent plan changes.
</history>

<task>
The customer is asking about a double charge. Based on the knowledge and history, diagnose the likely cause, explain it clearly, and provide specific resolution steps.
</task>`,
				keyTakeaway:
					"Arrange context in layers from general to specific: system rules → knowledge → examples → history → task. Each layer has a distinct purpose — don't mix behavior rules into knowledge or examples into system instructions.",
				exercise: {
					instruction:
						"Structure this flat prompt into distinct, labeled context layers. Identify which information belongs in system, knowledge, examples, and task layers.",
					starterPrompt: `You help people write SQL queries. The database uses PostgreSQL 15. The main tables are: users (id, email, name, created_at, plan_type), orders (id, user_id, total, status, created_at), and products (id, name, price, category). Write optimized queries and explain your approach. The user wants to find all users who made more than 3 orders last month but haven't logged in this month.`,
					evaluationCriteria: [
						"Separates content into clearly labeled layers (system, knowledge, task)",
						"System instructions focus on behavior and rules",
						"Knowledge layer contains the database schema and technical details",
						"Task layer is specific and builds on the provided context",
						"Layers are visually separated with delimiters or tags",
					],
				},
			},
			{
				slug: "writing-system-instructions",
				title: "Writing System Instructions",
				estimatedMinutes: 12,
				concept: `System instructions are the most powerful layer in the context window. They define the AI's identity, capabilities, boundaries, and default behaviors. Well-written system instructions produce consistently high-quality results across diverse user inputs.

**What belongs in system instructions:**

1. **Identity & role** — Who is the AI in this context? "You are a senior TypeScript engineer at a fintech company." This shapes vocabulary, assumptions, and expertise level.

2. **Behavioral rules** — How should the AI respond? "Always provide code examples. Never suggest deprecated APIs. Ask clarifying questions when requirements are ambiguous."

3. **Output defaults** — What format should responses take unless overridden? "Default to markdown formatting. Use code blocks for any code. Keep responses under 500 words unless asked otherwise."

4. **Boundaries & safety** — What should the AI refuse or escalate? "Never provide financial advice. If asked about medical topics, remind the user to consult a professional."

5. **Communication style** — Tone, formality, and personality. "Be direct and concise. Use technical language freely but explain acronyms on first use."

**What does NOT belong in system instructions:**
- Specific knowledge or data (use the knowledge layer)
- Examples (use the examples layer)
- Task-specific instructions (use the task layer)
- Information that changes between requests

**Writing effective system instructions:**
- Be specific and testable: "Respond in under 200 words" is testable. "Be concise" is not.
- Prioritize: Put the most important rules first. Models attend more to the beginning.
- Use imperative language: "Always," "Never," "When X happens, do Y."
- Test adversarially: Try inputs that conflict with your rules. Do they hold?

**The golden rule:** System instructions should make every subsequent interaction better without needing to be restated. If you find yourself repeating instructions in every user message, they should be in the system prompt.`,
				beforeExample: `You are a helpful coding assistant.`,
				afterExample: `You are a senior TypeScript engineer reviewing code for a fintech startup. You specialize in Node.js, React, and PostgreSQL.

## Response rules
- Always use TypeScript (never plain JavaScript) in code examples.
- Include type annotations for all function parameters and return values.
- When suggesting a library, state the license and last major release date.
- If a question involves financial calculations, double-check arithmetic and note any rounding assumptions.

## Communication style
- Be direct. Lead with the answer, then explain.
- Use inline code backticks for identifiers (\`functionName\`, \`VariableType\`).
- Keep explanations under 300 words unless the user asks for depth.
- When there are multiple valid approaches, present the recommended one first with a brief mention of alternatives.

## Boundaries
- Never generate API keys, credentials, or secrets (even fake ones).
- If asked about compliance (SOC 2, PCI, GDPR), provide general guidance and recommend consulting a compliance specialist.
- If the user's code has a security vulnerability, flag it immediately — even if they didn't ask about security.

## Error handling
- If the user's question is unclear, state your assumption and proceed. Format: "Assuming you mean [X], here's the approach: ..."
- If you can't answer confidently, say so. Never fabricate library names or API endpoints.`,
				keyTakeaway:
					"System instructions define identity, rules, output defaults, boundaries, and communication style. They should be specific, testable, and make every interaction better without repetition.",
				exercise: {
					instruction:
						"Write comprehensive system instructions for an AI assistant that helps technical writers create API documentation. Include identity, behavioral rules, output defaults, boundaries, and communication style.",
					starterPrompt: `You are an API documentation assistant.`,
					evaluationCriteria: [
						"Defines a clear identity and specialization",
						"Includes at least 3 specific behavioral rules",
						"Specifies output defaults (format, length, structure)",
						"Sets clear boundaries on what the AI should not do",
						"Defines a communication style appropriate for the use case",
					],
				},
			},
			{
				slug: "reference-knowledge-grounding",
				title: "Knowledge Grounding",
				estimatedMinutes: 10,
				concept: `Knowledge grounding connects the AI to specific, authoritative information rather than relying on its general training data. This is how you prevent hallucination and ensure responses are based on your actual data, documentation, or policies.

**The hallucination problem:** Without grounding, AI models confidently generate plausible-sounding information that may be outdated, incorrect, or entirely fabricated. Grounding provides a "source of truth" the model should reference.

**Grounding techniques:**

**1. Inline knowledge blocks:**
Embed reference documents directly in the context with clear labels:
\`\`\`
<knowledge source="employee-handbook" section="PTO-policy" updated="2025-01">
Employees accrue 1.5 PTO days per month. Maximum carryover is 5 days.
New hires receive 3 bonus days in their first year.
</knowledge>
\`\`\`

**2. Attribution instructions:**
Tell the model to cite its sources: "Base your answer only on the provided knowledge. If the answer isn't in the provided documents, say 'This information is not in the provided reference materials.'"

**3. Confidence signaling:**
Ask the model to indicate when it's drawing from provided knowledge vs. general knowledge: "Mark statements from the provided docs as [Source: docs]. Mark general knowledge as [Source: general]."

**4. Priority hierarchies:**
When multiple sources might conflict: "If the provided documentation contradicts your training data, always defer to the provided documentation. If two provided documents conflict, defer to the more recently dated one."

**Best practices:**
- Label every knowledge block with its source and date
- Include only relevant knowledge (not entire documents)
- Tell the model explicitly how to handle missing information
- Test by asking questions outside the provided knowledge to verify the model doesn't hallucinate`,
				beforeExample: `What is our company's vacation policy?`,
				afterExample: `<system>
You are an HR assistant for Acme Corp. Answer employee questions about company policies.

Grounding rules:
- Base ALL answers strictly on the provided policy documents.
- If the answer is not in the provided documents, respond: "I don't have that information in the current policy documents. Please contact HR at hr@acme.com."
- Never supplement with general knowledge about "typical" company policies.
- Cite the specific policy section for each statement.
</system>

<knowledge source="acme-pto-policy-v3" updated="2025-01-01" status="current">
Section 4.1 — PTO Accrual:
Full-time employees accrue 1.5 PTO days per month (18 days/year).
Part-time employees (20+ hrs/week) accrue 0.75 days per month.

Section 4.2 — Carryover:
Maximum carryover: 5 days into the next calendar year.
Unused days above 5 are forfeited on January 1.

Section 4.3 — New Hire Bonus:
Employees in their first year receive 3 bonus PTO days, available immediately upon hire.

Section 4.4 — Requesting PTO:
Submit requests via Workday at least 5 business days in advance.
Manager approval required. Requests over 5 consecutive days require VP approval.
</knowledge>

<task>
The employee is asking: "What is our company's vacation policy?"
Provide a comprehensive answer citing the relevant policy sections.
</task>`,
				keyTakeaway:
					"Ground AI responses in specific, labeled reference documents. Always include attribution instructions, handle missing information explicitly, and establish priority hierarchies when sources might conflict.",
				exercise: {
					instruction:
						"Add grounding to this prompt by providing reference knowledge, attribution rules, and instructions for handling questions outside the provided information.",
					starterPrompt: `You are a support bot for our project management tool. Help users with their questions about features and pricing.`,
					evaluationCriteria: [
						"Includes labeled knowledge blocks with source and date information",
						"Instructs the AI to base answers only on provided knowledge",
						"Specifies behavior when information is not in the provided documents",
						"Includes attribution or citation instructions",
						"Establishes a clear priority hierarchy for conflicting information",
					],
				},
			},
			{
				slug: "token-budget-management",
				title: "Token Budget Management",
				estimatedMinutes: 10,
				concept: `Every AI model has a finite context window — the total number of tokens it can process in a single request. Token budget management is the practice of allocating this limited space strategically across your context layers.

**Understanding the budget:**
Modern models have context windows of 100K-200K tokens. That sounds like a lot, but it fills up fast:
- System instructions: 500-2,000 tokens
- Knowledge documents: 2,000-50,000+ tokens
- Few-shot examples: 500-2,000 tokens
- Conversation history: 1,000-20,000+ tokens
- User's message: 100-2,000 tokens
- Response space: 1,000-4,000 tokens

**The key insight:** You must reserve space for the response. If your context fills 95% of the window, the model has very little room to generate a thorough answer.

**Allocation strategies:**

**1. Priority-based allocation:**
Rank your context layers by importance. System instructions and the user's task are non-negotiable. Knowledge and history can be trimmed.

**2. Summarization for history:**
Instead of including full conversation history, summarize older turns: "Previous discussion: User asked about database indexing. We discussed B-tree vs. hash indexes and recommended B-tree for their range query use case."

**3. Relevant knowledge selection:**
Don't dump entire documents into context. Use semantic search or keyword matching to select only the most relevant passages. Include 3-5 relevant paragraphs, not 50 pages.

**4. Example pruning:**
If token budget is tight, reduce from 3 examples to 1-2, or use shorter examples. A single strong example often outperforms three mediocre ones.

**5. Response budget signaling:**
Tell the model how much space to use: "Keep your response under 500 words" or "Provide a brief summary (3-5 sentences) rather than a comprehensive analysis."

**Monitoring and optimization:**
- Track token usage across your context layers
- Identify which layers contribute most to output quality
- A/B test removing or shrinking layers to find the minimum effective context
- Remember: more context isn't always better — focused, relevant context beats comprehensive but noisy context`,
				beforeExample: `Here is our entire 50-page employee handbook. Answer questions about it.

[50 pages of text...]

Question: How many vacation days do I get?`,
				afterExample: `<system tokens="~150">
You are Acme Corp's HR assistant. Answer PTO questions from the provided policy excerpt. Cite section numbers. If information is missing from the excerpt, say so.
</system>

<knowledge tokens="~300" source="pto-policy" relevance="direct-match">
Section 4.1: Full-time employees accrue 1.5 PTO days/month (18/year).
Section 4.2: Max carryover: 5 days. Excess forfeited Jan 1.
Section 4.3: New hires get 3 bonus days, available immediately.
Section 4.4: Request via Workday, 5 days advance notice. >5 consecutive days needs VP approval.
</knowledge>

<task tokens="~30">
Employee question: "How many vacation days do I get?"
Provide a concise answer citing policy sections. Keep response under 150 words.
</task>

<!-- Total context: ~480 tokens. Response budget: ~200 tokens.
     Compared to dumping the full 50-page handbook (~40,000 tokens),
     this is 99% more efficient with the same answer quality. -->`,
				keyTakeaway:
					"Allocate your context window strategically: select only relevant knowledge, summarize history, prune examples, and always reserve space for the response. Focused context beats comprehensive context.",
				exercise: {
					instruction:
						"Redesign this prompt to be token-efficient: extract only the relevant knowledge, add token budget annotations, and include response length constraints.",
					starterPrompt: `You are a technical support agent. Here is our complete product documentation:

[Imagine 20 pages of docs about Setup, Configuration, API Reference, Troubleshooting, FAQs, Release Notes, and Advanced Features]

The user asks: "How do I reset my API key?"

Help them.`,
					evaluationCriteria: [
						"Includes only the relevant knowledge for the specific question",
						"Annotates or estimates token usage for each section",
						"Reserves adequate space for the response",
						"Includes response length constraints",
						"Demonstrates awareness of the context window as a limited resource",
					],
				},
			},
		],
	},
	{
		slug: "advanced-patterns",
		title: "Advanced Patterns",
		description:
			"Master sophisticated prompt engineering patterns including self-critique loops, multi-turn design, RAG optimization, prompt chaining, and model-specific optimization.",
		difficulty: "advanced",
		prerequisite: "intermediate-techniques",
		requiredLevel: 3,
		lessons: [
			{
				slug: "self-critique-loops",
				title: "Self-Critique Loops",
				estimatedMinutes: 12,
				concept: `Self-critique loops prompt the LLM to evaluate and improve its own output in multiple passes. Instead of accepting the first response, you instruct the model to generate, evaluate, and refine — producing significantly higher quality results.

**The pattern:**
1. **Generate** — Produce an initial response
2. **Evaluate** — Assess the response against specific criteria
3. **Refine** — Improve based on the evaluation

**Why it works:** LLMs are often better at evaluating text than generating it from scratch. By separating generation from evaluation, you leverage different capabilities of the model.

**Implementation approaches:**

**Single-prompt self-critique:**
Include evaluation instructions directly: "After generating your response, review it for [criteria]. If any issues are found, revise and present only the final version."

**Multi-step critique:**
Use separate prompts: first generate, then pass the output back with evaluation instructions, then generate a refined version.

**Structured evaluation:**
Ask the model to score itself: "Rate your response 1-10 on accuracy, completeness, and clarity. If any dimension scores below 7, revise to improve it."`,
				beforeExample: `Write a Python function to validate email addresses.`,
				afterExample: `Write a Python function to validate email addresses.

After writing your initial implementation:

1. **Review** your code against these criteria:
   - Does it handle edge cases (empty string, missing @, multiple @, unicode)?
   - Does it follow Python best practices (type hints, docstring)?
   - Is the regex pattern RFC 5322 compliant?

2. **Score** each criterion (pass/fail) and list any issues found.

3. **Revise** the function to address all identified issues.

Present your final implementation with a brief changelog of what you improved.`,
				keyTakeaway:
					"Self-critique loops separate generation from evaluation, letting the model leverage its strong evaluation skills to refine its own output.",
				exercise: {
					instruction:
						"Add a self-critique loop to this prompt that makes the AI evaluate and improve its initial response.",
					starterPrompt: `Write a technical blog post about microservices vs monoliths.`,
					evaluationCriteria: [
						"Includes explicit evaluation criteria for the first draft",
						"Instructs the model to identify specific weaknesses",
						"Requires a revision step based on the evaluation",
						"Presents only the refined final version",
						"Evaluation criteria are specific and measurable",
					],
				},
			},
			{
				slug: "multi-turn-design",
				title: "Multi-Turn Conversation Design",
				estimatedMinutes: 15,
				concept: `Multi-turn design creates prompts for conversational flows where context builds across multiple exchanges. Unlike single-shot prompts, multi-turn design manages state, maintains coherence, and guides conversations toward goals.

**Key challenges:**
- **Context accumulation** — Each turn adds to the context window
- **Goal tracking** — Maintaining focus across multiple exchanges
- **State management** — Remembering what's been discussed and decided
- **Graceful transitions** — Moving between topics naturally

**Design patterns:**

**1. Structured turn-taking:**
Define what the AI should do at each stage: gather requirements, confirm understanding, propose solutions, iterate.

**2. Checkpoint summaries:**
Periodically summarize the conversation state: "Before proceeding, let me confirm what we've established so far: [summary]. Is this correct?"

**3. Progressive disclosure:**
Start broad and narrow down: "What type of application? → What tech stack? → What specific feature? → Here's the implementation."

**4. Conversation memory instructions:**
"Maintain a running list of: decisions made, open questions, and next steps. Reference this list when the user asks about previous topics."`,
				beforeExample: `You are a helpful assistant. Answer the user's questions about building a web app.`,
				afterExample: `You are a technical architect helping a user design a web application.

## Conversation flow
1. **Discovery** (turns 1-3): Ask about requirements, users, scale, and constraints. Ask one focused question per turn.
2. **Confirmation** (turn 4): Summarize requirements and confirm understanding.
3. **Architecture** (turns 5-7): Propose architecture, discuss trade-offs, iterate based on feedback.
4. **Action plan** (final turn): Provide a prioritized implementation roadmap.

## State tracking
Maintain a mental model of:
- Confirmed requirements (mark with ✓)
- Open questions (mark with ?)
- Decisions made (mark with →)

Reference this state when transitioning between stages.

## Turn behavior
- Never answer more than was asked — ask clarifying questions first
- Summarize previous decisions before introducing new topics
- If the user goes off-track, gently redirect to the current stage`,
				keyTakeaway:
					"Multi-turn design defines conversation stages, manages state across turns, and uses checkpoint summaries to maintain coherence in extended interactions.",
				exercise: {
					instruction:
						"Design a multi-turn conversation flow for this use case with explicit stages, state tracking, and transition rules.",
					starterPrompt: `You are a career counselor AI. Help users explore career options.`,
					evaluationCriteria: [
						"Defines distinct conversation stages with clear transitions",
						"Includes state tracking for information gathered",
						"Uses checkpoint summaries between stages",
						"Specifies per-turn behavior rules",
						"Handles off-topic or premature questions gracefully",
					],
				},
			},
			{
				slug: "rag-optimization",
				title: "RAG-Optimized Prompts",
				estimatedMinutes: 15,
				concept: `Retrieval-Augmented Generation (RAG) combines search with generation: relevant documents are retrieved and injected into the prompt as context. RAG-optimized prompts handle this retrieved context effectively.

**The RAG challenge:** Retrieved context is often noisy — it may include partially relevant passages, outdated information, or conflicting sources. Your prompt must instruct the model to handle this gracefully.

**Key techniques:**

**1. Source attribution:**
"Base your answer on the provided sources. Cite each claim with [Source N]. If sources conflict, note the disagreement."

**2. Relevance filtering:**
"Some of the provided context may not be relevant to the question. Use only the passages that directly address the query."

**3. Confidence signaling:**
"If the provided sources don't fully answer the question, say what you can answer and what remains unknown."

**4. Context structure:**
Label retrieved chunks with metadata: source, date, relevance score. This helps the model prioritize.

**5. Fallback behavior:**
"If no provided source addresses the question, respond: 'I don't have information about this in the current knowledge base.'"`,
				beforeExample: `Here are some documents about our product:

{retrieved_chunks}

Answer the user's question: {question}`,
				afterExample: `<system>
You answer questions using ONLY the provided reference sources. You are precise about what the sources say and don't say.

Rules:
- Cite every factual claim with [Source N]
- If sources conflict, present both views with their source citations
- If sources don't address the question, say: "The available documentation doesn't cover this topic."
- Never supplement with information not in the sources
</system>

<sources>
[Source 1] (docs/api-reference.md, updated 2025-01-15, relevance: 0.92)
{chunk_1}

[Source 2] (docs/faq.md, updated 2024-11-20, relevance: 0.85)
{chunk_2}

[Source 3] (blog/migration-guide.md, updated 2024-09-01, relevance: 0.71)
{chunk_3}
</sources>

<task>
Question: {question}
Provide a comprehensive answer citing the sources above. If sources have different information, prefer the most recently updated source.
</task>`,
				keyTakeaway:
					"RAG-optimized prompts include source attribution, relevance filtering, confidence signaling, and explicit fallback behavior for when retrieved context doesn't fully answer the question.",
				exercise: {
					instruction:
						"Transform this basic RAG prompt into one that handles source attribution, conflicting information, and missing context gracefully.",
					starterPrompt: `You are a customer support bot. Here is some documentation that might help:

{retrieved_docs}

Customer question: {question}

Answer the question.`,
					evaluationCriteria: [
						"Requires source citation for factual claims",
						"Handles conflicting information between sources",
						"Includes relevance metadata on retrieved chunks",
						"Specifies fallback behavior when sources are insufficient",
						"Distinguishes between sourced claims and general knowledge",
					],
				},
			},
			{
				slug: "prompt-chaining",
				title: "Prompt Chaining",
				estimatedMinutes: 12,
				concept: `Prompt chaining decomposes complex tasks into a sequence of focused prompts, where each prompt's output feeds into the next. This produces better results than a single monolithic prompt for complex tasks.

**Why chain prompts?**
- Each step can focus on one thing well
- Intermediate outputs can be validated
- Errors are isolated to specific steps
- Individual steps can use different models or temperatures

**Common chain patterns:**

**1. Sequential processing:**
Extract → Transform → Generate: First extract key information, then restructure it, then generate the final output.

**2. Fan-out/fan-in:**
Split a complex task into parallel subtasks, then combine results.

**3. Iterative refinement:**
Generate → Evaluate → Refine → Evaluate (loop until quality threshold met).

**4. Classification → specialized handling:**
First classify the input type, then route to a specialized prompt for that type.

**Design principles:**
- Each step should have a single, clear responsibility
- Define the data contract between steps (what format the output must be in)
- Include validation between steps to catch errors early
- Keep intermediate outputs structured (JSON) for reliable parsing`,
				beforeExample: `Analyze this customer feedback, categorize it, suggest improvements, draft a response, and create a summary report.

{feedback}`,
				afterExample: `## Step 1: Extract & Classify
Extract the following from the customer feedback and return as JSON:
- sentiment: positive | negative | mixed
- category: bug | feature_request | complaint | praise
- key_points: string[]
- urgency: low | medium | high

Feedback: {feedback}

## Step 2: Generate Response (uses Step 1 output)
Given this classified feedback:
{step_1_output}

Draft a customer response that:
- Acknowledges their specific points
- Addresses each key_point
- Matches tone to sentiment (empathetic for negative, grateful for positive)
- Includes next steps appropriate to the category

## Step 3: Create Action Items (uses Step 1 output)
Given this classified feedback:
{step_1_output}

Generate internal action items as JSON:
- action: string
- assignee_team: product | engineering | support
- priority: matches urgency from classification
- deadline_days: number`,
				keyTakeaway:
					"Prompt chaining breaks complex tasks into focused steps with clear data contracts between them, enabling validation, error isolation, and better results than monolithic prompts.",
				exercise: {
					instruction:
						"Break this monolithic prompt into a 3-step chain with clear data contracts between steps.",
					starterPrompt: `Read this code repository, identify all security vulnerabilities, prioritize them by severity, suggest fixes for each, and generate a security audit report.

{repository_code}`,
					evaluationCriteria: [
						"Breaks the task into 3+ distinct, focused steps",
						"Defines clear output format for each step",
						"Each step has a single responsibility",
						"Data flows logically from one step to the next",
						"Includes validation or quality checks between steps",
					],
				},
			},
			{
				slug: "model-specific-optimization",
				title: "Model-Specific Optimization",
				estimatedMinutes: 10,
				concept: `Different LLMs have different strengths, weaknesses, and preferred prompt structures. Model-specific optimization tailors your prompts to leverage each model's unique capabilities.

**Key differences between models:**

**Claude (Anthropic):** Responds well to XML tags for structure. Strong at following complex instructions. System messages are highly effective.

**GPT-4 (OpenAI):** Prefers markdown formatting. Structured outputs (JSON schema) guarantee format. Strong function calling.

**Gemini (Google):** Massive context window. Prefers direct, explicit instructions. Best with full documents rather than excerpts.

**Optimization strategies:**

**1. Structure format:** Use XML tags for Claude, markdown for GPT, numbered lists for Gemini.

**2. Instruction placement:** Claude attends well to both start and end. GPT-4 gives more weight to recent instructions. Place critical instructions strategically.

**3. Few-shot count:** Claude needs fewer examples (1-2). GPT-4 benefits from 2-3. Gemini may need 3-5 for consistency.

**4. Temperature tuning:** Lower for production (0-0.3), higher for creative tasks (0.7-1.0). Each model's temperature scale behaves differently.

**5. Feature leverage:** Use each model's unique features — Claude's extended thinking, GPT-4's structured outputs, Gemini's grounding.`,
				beforeExample: `You are a helpful assistant. Analyze this data and provide insights.

{data}`,
				afterExample: `<!-- Claude-optimized version -->
<system>
You are a data analyst specializing in e-commerce metrics.
Always present findings with confidence levels.
Use tables for comparisons, bullet points for insights.
</system>

<context>
<data format="csv" rows="1000">
{data}
</data>
</context>

<task>
Analyze the provided data and identify:
1. Top 3 trends with supporting data points
2. Anomalies that warrant investigation
3. Actionable recommendations

For each finding, indicate confidence: HIGH (strong data support), MEDIUM (suggestive), LOW (preliminary).
</task>`,
				keyTakeaway:
					"Optimize prompts for specific models by matching their preferred structure format, instruction placement, few-shot requirements, and unique features.",
				exercise: {
					instruction:
						"Take this generic prompt and create an optimized version for a specific model (Claude, GPT-4, or Gemini), explaining why each change leverages that model's strengths.",
					starterPrompt: `Summarize this research paper and extract the key findings, methodology, and limitations.

{paper_text}`,
					evaluationCriteria: [
						"Uses the target model's preferred formatting (XML/markdown/numbered)",
						"Places instructions strategically for the model",
						"Leverages model-specific features",
						"Adjusts few-shot example count appropriately",
						"Explains why each optimization suits the target model",
					],
				},
			},
		],
	},
	{
		slug: "production-prompt-engineering",
		title: "Production Prompt Engineering",
		description:
			"Learn to build reliable, testable, and cost-effective prompts for production systems at scale.",
		difficulty: "advanced",
		prerequisite: "advanced-patterns",
		requiredLevel: 4,
		lessons: [
			{
				slug: "consistency-at-scale",
				title: "Consistency at Scale",
				estimatedMinutes: 15,
				concept: `Production prompts must produce consistent, predictable output across thousands of calls. Inconsistency creates bugs, breaks parsers, and erodes user trust.

**Sources of inconsistency:**
- Ambiguous output format instructions
- Missing edge case handling
- Temperature too high for the task
- Prompt allows multiple valid interpretations

**Strategies for consistency:**

**1. Schema enforcement:** Define exact output structure. Use JSON schemas or strict format templates.

**2. Output validation:** Include validation rules in the prompt: "Your response must contain exactly 3 sections. Each section must start with ##."

**3. Deterministic instructions:** Replace "provide some examples" with "provide exactly 3 examples."

**4. Negative constraints:** "Do NOT include introductory phrases. Do NOT add disclaimers. Start directly with the analysis."

**5. Testing at scale:** Run the same prompt 50+ times with varied inputs. Track format compliance rate. Aim for >99% consistency.`,
				beforeExample: `Analyze this customer review and tell me about the sentiment.

Review: {review_text}`,
				afterExample: `Analyze the customer review below. Return ONLY a JSON object with this exact schema — no markdown, no explanation, no preamble.

{
  "sentiment": "positive" | "negative" | "neutral" | "mixed",
  "confidence": 0.0-1.0,
  "key_topics": ["string", "max 5 items"],
  "action_required": true | false,
  "summary": "string, max 50 words"
}

Validation rules:
- confidence must be between 0.0 and 1.0
- key_topics must have 1-5 items
- summary must be a single sentence under 50 words
- If sentiment is "negative" and confidence > 0.8, action_required must be true

Review: {review_text}`,
				keyTakeaway:
					"Production consistency requires strict schema enforcement, validation rules, deterministic instructions, and negative constraints to eliminate ambiguity.",
				exercise: {
					instruction:
						"Make this prompt production-ready by adding strict output formatting, validation rules, and consistency constraints.",
					starterPrompt: `Categorize this support ticket and suggest a priority level.

Ticket: {ticket_text}`,
					evaluationCriteria: [
						"Defines an exact output schema (JSON or structured format)",
						"Includes validation rules for each field",
						"Uses deterministic language (exact counts, specific formats)",
						"Includes negative constraints to prevent unwanted output",
						"Handles edge cases explicitly",
					],
				},
			},
			{
				slug: "parameterization",
				title: "Template Parameterization",
				estimatedMinutes: 12,
				concept: `Parameterized templates use variables ({{parameter}}) to create reusable prompts that adapt to different inputs. Good parameterization makes prompts flexible, testable, and maintainable.

**Design principles:**

**1. Name parameters clearly:** {{customer_name}} not {{input1}}. Names should describe what the value represents.

**2. Define parameter types:** Document expected types — string, number, enum, list. Include valid ranges or values.

**3. Provide defaults:** When a parameter is optional, specify default behavior: "If {{tone}} is not provided, use 'professional'."

**4. Validate at the template level:** Include conditional logic: "If {{language}} is not one of [en, es, fr, de], respond with an error."

**5. Separate content from structure:** Parameters should fill in content, not change the prompt's structure. The template's logic should remain constant across all parameter values.`,
				beforeExample: `Write a professional email to John about the Q3 report being delayed by 2 weeks.`,
				afterExample: `Write a {{tone}} email.

From: {{sender_name}} ({{sender_title}})
To: {{recipient_name}}
Subject: {{subject}}

Context: {{context}}

Requirements:
- Tone: {{tone}} (default: professional)
- Length: {{length}} (default: medium — 150-250 words)
- Include: {{include_elements}} (e.g., apology, timeline, next steps)
- Avoid: {{avoid_elements}} (e.g., technical jargon, blame)

Sign off as {{sender_name}}.`,
				keyTakeaway:
					"Good parameterization uses descriptive names, defined types, sensible defaults, and validation — separating variable content from fixed prompt structure.",
				exercise: {
					instruction:
						"Parameterize this hardcoded prompt into a reusable template with named parameters, types, and defaults.",
					starterPrompt: `You are an expert Python developer. Write a function called calculate_tax that takes a price and returns the price with 8.25% tax added. Include error handling for negative numbers. Add a docstring.`,
					evaluationCriteria: [
						"Extracts hardcoded values into named parameters",
						"Uses descriptive parameter names with {{}} syntax",
						"Documents parameter types and valid values",
						"Provides sensible defaults for optional parameters",
						"Template structure remains constant across parameter values",
					],
				},
			},
			{
				slug: "testing-and-validation",
				title: "Testing & Validation",
				estimatedMinutes: 15,
				concept: `Prompt testing ensures your prompts produce correct, consistent output across diverse inputs. Like software testing, prompt testing includes unit tests, regression tests, and edge case coverage.

**Testing layers:**

**1. Format tests:** Does the output match the expected schema? Parse the JSON, validate field types, check required fields.

**2. Content tests:** Does the output contain correct information? Compare against known-good answers for test inputs.

**3. Edge case tests:** How does the prompt handle empty input, very long input, adversarial input, multilingual input?

**4. Regression tests:** When you change the prompt, do previously correct outputs still work? Maintain a test suite of input/expected-output pairs.

**5. Consistency tests:** Run the same input 10+ times. Are the results consistent in format and content?

**Building a test suite:**
- Start with 5-10 representative inputs covering common cases
- Add edge cases as you discover them
- Include "golden" outputs — manually verified correct responses
- Track pass rates across prompt versions
- Automate testing in CI/CD when possible`,
				beforeExample: `Write tests for your prompt by... manually checking a few examples.`,
				afterExample: `## Prompt Test Suite: Customer Sentiment Analyzer

### Test 1: Clear positive
Input: "I absolutely love this product! Best purchase I've made all year."
Expected: { sentiment: "positive", confidence: >0.9, action_required: false }

### Test 2: Clear negative
Input: "Terrible experience. Product broke after one day. Want a refund."
Expected: { sentiment: "negative", confidence: >0.9, action_required: true }

### Test 3: Mixed sentiment
Input: "Great features but the price is too high for what you get."
Expected: { sentiment: "mixed", key_topics: includes "features" AND "price" }

### Test 4: Edge — empty input
Input: ""
Expected: { error: "empty_input" } or graceful handling

### Test 5: Edge — non-English
Input: "Ce produit est fantastique!"
Expected: Valid JSON output (should still analyze sentiment)

### Regression baseline
Version 2.1 pass rate: 95% (19/20 tests)
Known failure: Very short inputs (<5 words) sometimes lack key_topics`,
				keyTakeaway:
					"Prompt testing includes format validation, content correctness, edge cases, regression suites, and consistency checks — treat prompts like code that needs automated testing.",
				exercise: {
					instruction:
						"Design a test suite for this prompt with at least 5 test cases covering common cases, edge cases, and expected outputs.",
					starterPrompt: `Classify the following text into one of these categories: bug_report, feature_request, question, praise, complaint.

Text: {text}

Return JSON: { "category": "...", "confidence": 0.0-1.0, "reasoning": "..." }`,
					evaluationCriteria: [
						"Includes 5+ test cases with specific inputs",
						"Covers both common cases and edge cases",
						"Specifies expected output for each test",
						"Includes an edge case for ambiguous input",
						"Defines pass/fail criteria for each test",
					],
				},
			},
			{
				slug: "token-optimization",
				title: "Token Optimization",
				estimatedMinutes: 12,
				concept: `Token optimization reduces prompt costs without sacrificing output quality. At scale, even small reductions compound into significant savings.

**Optimization strategies:**

**1. Eliminate redundancy:** Remove repeated instructions, verbose phrasing, and unnecessary context.

**2. Compress examples:** Use shorter examples that still demonstrate the pattern. One concise example often beats three verbose ones.

**3. Use references instead of inline content:** "Follow the JSON schema defined in our API docs" instead of pasting the entire schema.

**4. Dynamic context selection:** Only include context relevant to the current query, not everything available.

**5. Prompt caching:** Many providers cache identical prompt prefixes. Structure your prompt so the static portion (system + instructions) comes first and the variable portion (user input) comes last.

**6. Output length control:** Explicitly constrain output length. "Respond in under 100 words" saves output tokens.

**Measuring optimization:**
- Track tokens per request (input + output)
- Calculate cost per 1000 requests
- A/B test optimized vs original for quality
- Target: reduce tokens by 30-50% while maintaining >95% quality parity`,
				beforeExample: `You are an AI assistant that helps people write better code. You are very knowledgeable about programming and software engineering. You have expertise in many programming languages including Python, JavaScript, TypeScript, Java, Go, Rust, and many others. When someone asks you to help them with code, you should provide detailed, well-commented code examples with clear explanations of how the code works and why you chose that approach. You should also mention any potential issues or edge cases that the user should be aware of.

Please review the following code and suggest improvements:

{code}`,
				afterExample: `You are a senior code reviewer. Review for: bugs, performance, security, style.

Output format (concise):
- 🐛 Bugs: [list or "None"]
- ⚡ Performance: [list or "None"]
- 🔒 Security: [list or "None"]
- 📝 Style: [top 3 only]

Keep total response under 200 words.

Code:
{code}`,
				keyTakeaway:
					"Optimize tokens by eliminating redundancy, compressing examples, using dynamic context, leveraging prompt caching, and constraining output length. Measure quality to ensure optimization doesn't degrade results.",
				exercise: {
					instruction:
						"Reduce this prompt's token count by at least 40% while maintaining the same output quality and coverage.",
					starterPrompt: `You are an expert financial analyst with years of experience in the stock market and investment analysis. You have deep knowledge of fundamental analysis, technical analysis, and macroeconomic factors that affect stock prices. When analyzing a stock, you always consider the company's financial statements, industry trends, competitive position, management quality, and growth prospects. You should provide a thorough analysis that covers all these aspects.

Please analyze the following stock and provide your recommendation:
Company: {company_name}
Recent price: {price}
Here are the latest financial statements: {financials}

Provide a detailed analysis covering all important aspects and give a buy/hold/sell recommendation with your confidence level.`,
					evaluationCriteria: [
						"Reduces prompt token count by 40%+ from the original",
						"Preserves all key analysis dimensions",
						"Maintains structured output requirements",
						"Removes redundancy without losing meaning",
						"Includes output length constraints",
					],
				},
			},
			{
				slug: "monitoring-and-alerting",
				title: "Monitoring & Alerting",
				estimatedMinutes: 10,
				concept: `Production prompts need monitoring to detect quality degradation, unexpected behavior, and cost anomalies. Monitoring turns prompts from fire-and-forget into managed systems.

**What to monitor:**

**1. Output quality metrics:**
- Format compliance rate (% of responses matching expected schema)
- Content accuracy (spot-check samples against ground truth)
- User satisfaction signals (thumbs up/down, regeneration requests)

**2. Performance metrics:**
- Latency (P50, P95, P99)
- Token usage per request (input + output)
- Cost per request and daily spend

**3. Drift indicators:**
- Output distribution changes over time
- New failure modes appearing
- Model version changes affecting behavior

**Alerting rules:**
- Format compliance drops below 98% → investigate prompt or model change
- P95 latency exceeds 5s → check prompt length or model load
- Daily cost exceeds budget by 20% → check for runaway usage
- New error categories appear → review and add handling

**Instrumenting prompts:**
Add metadata to track: prompt version, model used, timestamp, token counts, latency. Log failed validations with the input that caused them for debugging.`,
				beforeExample: `# No monitoring — just deploy and hope for the best`,
				afterExample: `## Prompt Monitoring Checklist

### Per-request logging
- prompt_version: "sentiment-v2.3"
- model: "claude-sonnet-4"
- input_tokens: {count}
- output_tokens: {count}
- latency_ms: {duration}
- format_valid: {boolean}
- timestamp: {ISO 8601}

### Quality sampling (every 100th request)
- Compare output against human-labeled ground truth
- Log disagreements for review

### Alert thresholds
- format_compliance < 98% over 1h → PagerDuty
- avg_latency > 3000ms over 15min → Slack
- daily_cost > $50 → Email
- error_rate > 2% over 1h → PagerDuty

### Weekly review
- Output distribution histogram
- Top 5 failure modes
- Cost trend vs. previous week
- Model performance comparison if A/B testing`,
				keyTakeaway:
					"Monitor production prompts for format compliance, content quality, latency, costs, and drift. Set alert thresholds and log metadata for every request to enable debugging.",
				exercise: {
					instruction:
						"Design a monitoring plan for this production prompt including metrics, alert thresholds, and logging requirements.",
					starterPrompt: `A production API endpoint uses this prompt 10,000 times/day to classify support tickets into categories and assign priority. Design the monitoring strategy.`,
					evaluationCriteria: [
						"Defines specific quality metrics to track",
						"Includes performance metrics (latency, tokens, cost)",
						"Sets concrete alert thresholds with notification channels",
						"Specifies per-request logging fields",
						"Includes a periodic review process",
					],
				},
			},
		],
	},
	{
		slug: "advanced-context-architecture",
		title: "Advanced Context Architecture",
		description:
			"Master advanced context engineering techniques for building sophisticated, efficient context blueprints.",
		difficulty: "advanced",
		prerequisite: "context-engineering-foundations",
		requiredLevel: 3,
		lessons: [
			{
				slug: "token-budget-management-advanced",
				title: "Advanced Token Budget Management",
				estimatedMinutes: 15,
				concept: `Advanced token budget management goes beyond basic allocation to dynamically optimize context composition based on the specific query and available resources.

**Dynamic allocation strategies:**

**1. Query-adaptive budgets:** Allocate more tokens to knowledge for factual questions, more to examples for formatting tasks, more to history for follow-up questions.

**2. Priority cascading:** Define a priority order for context elements. When the budget is tight, drop lower-priority elements first: supplementary examples → historical context → secondary knowledge → primary knowledge → system instructions.

**3. Compression tiers:** Have pre-computed versions of knowledge at different compression levels — full (5000 tokens), medium (1000 tokens), minimal (200 tokens). Select based on available budget.

**4. Token accounting:** Track exact token counts for each context element. Use tokenizer libraries to count precisely, don't estimate.

**5. Response reservation:** Always reserve at least 20% of the context window for the response. For complex tasks, reserve 30-40%.`,
				beforeExample: `Here's everything we know about the topic. Also here's the full conversation history. And all the examples.

[massive context that fills 95% of the window]

Now answer this simple question.`,
				afterExample: `<budget allocation="adaptive">
  System instructions: 400 tokens (fixed)
  Knowledge: up to 4000 tokens (query-dependent selection)
  Examples: 0-800 tokens (include only if task is ambiguous)
  History: up to 1000 tokens (summarized beyond 3 turns)
  Task: 200 tokens (fixed)
  Response reservation: 2000 tokens minimum
  Total budget: 8000 tokens
</budget>

<knowledge priority="1" tokens="~800">
[Most relevant passage — direct answer to query]
</knowledge>

<knowledge priority="2" tokens="~600">
[Supporting context — related background]
</knowledge>

<!-- Priority 3 knowledge dropped — budget allocated to response space -->

<task>
{user_question}
Answer concisely using the provided knowledge. Target 200-400 words.
</task>`,
				keyTakeaway:
					"Advanced token management uses dynamic allocation, priority cascading, compression tiers, and precise token accounting — always reserving adequate response space.",
				exercise: {
					instruction:
						"Design a dynamic token budget allocation strategy for a RAG-based Q&A system with a 16K token context window.",
					starterPrompt: `You have a 16,000 token context window. Your system needs: system instructions, retrieved knowledge (variable), conversation history (growing), and the user's question. Design the allocation strategy.`,
					evaluationCriteria: [
						"Assigns token budgets to each context layer",
						"Includes a priority order for when budget is tight",
						"Reserves adequate space for the response",
						"Handles growing conversation history",
						"Uses dynamic allocation based on query type",
					],
				},
			},
			{
				slug: "conditional-context",
				title: "Conditional Context",
				estimatedMinutes: 12,
				concept: `Conditional context adapts what information is included based on runtime parameters, user state, or query characteristics. Instead of static prompts, conditional context creates dynamic prompts that respond to the situation.

**Conditional patterns:**

**1. User-level conditions:** Include different knowledge based on user role (admin sees system details, regular user sees simplified explanation).

**2. Query-type routing:** Technical questions get API documentation context; billing questions get pricing context.

**3. Feature flags:** Enable/disable context blocks based on configuration ("If experiment_v2 is enabled, include the new response format instructions").

**4. Contextual escalation:** Start with minimal context. If the first response doesn't satisfy, add more context layers and retry.

**Implementation approach:**
Build context as a pipeline of conditional blocks. Each block has an inclusion condition. At runtime, evaluate conditions and assemble only the relevant blocks.`,
				beforeExample: `Here is our complete product documentation covering all features, pricing, API reference, troubleshooting, and admin guide.

{entire_docs}

Answer: {question}`,
				afterExample: `<system>
You are a product support assistant.
</system>

<!-- Include based on user role -->
{{#if user.role === "admin"}}
<knowledge scope="admin">
Admin panel: Settings → Users → Roles
Audit logs: Settings → Security → Audit Log
API rate limits can be adjusted at Settings → API → Rate Limits
</knowledge>
{{/if}}

<!-- Include based on query classification -->
{{#if query.category === "billing"}}
<knowledge scope="billing">
Plans: Free ($0), Pro ($29/mo), Team ($79/mo)
Billing cycle: Monthly, cancel anytime
Refund policy: 30-day money-back guarantee
</knowledge>
{{/if}}

{{#if query.category === "technical"}}
<knowledge scope="api">
API base URL: https://api.example.com/v2
Auth: Bearer token in Authorization header
Rate limit: 100 req/min (Free), 1000 req/min (Pro)
</knowledge>
{{/if}}

<task>{question}</task>`,
				keyTakeaway:
					"Conditional context includes only the information relevant to the current query, user, and situation — reducing noise and improving relevance through runtime evaluation.",
				exercise: {
					instruction:
						"Design a conditional context system for a customer support bot that adapts its knowledge based on the customer's plan tier and question category.",
					starterPrompt: `Build a context assembly strategy that includes different knowledge blocks based on: (1) customer plan (free/pro/enterprise), (2) question type (billing/technical/feature), and (3) customer history (new/returning).`,
					evaluationCriteria: [
						"Defines conditional blocks for different user segments",
						"Routes knowledge based on query classification",
						"Reduces irrelevant context for each scenario",
						"Includes a fallback for unclassified queries",
						"Shows the assembly logic clearly",
					],
				},
			},
			{
				slug: "knowledge-structuring",
				title: "Knowledge Structuring",
				estimatedMinutes: 15,
				concept: `How you structure knowledge in the context window dramatically affects the model's ability to use it. Well-structured knowledge is easier to reference, cite, and reason about.

**Structuring principles:**

**1. Hierarchical organization:** Group related information together. Use clear headers and nesting.

**2. Source metadata:** Every knowledge block should include: source name, date, confidence level, and scope.

**3. Cross-references:** Link related concepts: "See also: Section 3.2 for rate limits."

**4. Relevance scoring:** When including multiple knowledge blocks, order by relevance to the current query.

**5. Format consistency:** Use the same structure for all knowledge blocks so the model can reliably parse them.

**Anti-patterns to avoid:**
- Dumping raw documents without structure
- Mixing knowledge from different sources without labels
- Including outdated information without dating it
- Using inconsistent formatting across blocks`,
				beforeExample: `Our API uses REST. The base URL is api.example.com. You need an API key. Rate limits apply. Premium users get more. See docs for details. The key goes in the header. Use JSON. Errors return 4xx or 5xx. There's a webhook feature too.`,
				afterExample: `<knowledge source="api-docs-v3" updated="2025-01-15" scope="api-overview">

## Authentication
- Method: Bearer token in Authorization header
- Format: "Authorization: Bearer {api_key}"
- Key management: Dashboard → Settings → API Keys

## Endpoints
- Base URL: https://api.example.com/v3
- Format: JSON (request and response)
- Content-Type: application/json

## Rate Limits
| Plan       | Requests/min | Burst |
|------------|-------------|-------|
| Free       | 60          | 10    |
| Pro        | 600         | 50    |
| Enterprise | 6000        | 500   |

## Error Handling
- 400: Bad request (see error.message for details)
- 401: Invalid or expired API key
- 429: Rate limit exceeded (Retry-After header included)
- 500: Server error (include request ID in support tickets)

</knowledge>`,
				keyTakeaway:
					"Structure knowledge hierarchically with source metadata, consistent formatting, cross-references, and relevance ordering — making it easy for the model to find and cite information.",
				exercise: {
					instruction:
						"Restructure this raw information dump into well-organized knowledge blocks with metadata, hierarchy, and cross-references.",
					starterPrompt: `Take this unstructured information and organize it into a properly structured knowledge block:

"Our company has three offices. New York is the headquarters, opened 2015, 200 employees. London office opened 2018, 50 employees, handles EU operations. Tokyo office opened 2021, 25 employees, handles APAC. CEO is Jane Smith, started 2015. CTO is Bob Lee, joined 2017. HR head is Maria Garcia. The NY office is at 123 Main St. London is at 45 King Rd. We use Slack for chat, Jira for tickets, GitHub for code. Work hours are 9-6 local time, flexible for remote workers."`,
					evaluationCriteria: [
						"Organizes information into logical groups with headers",
						"Includes source metadata (date, scope)",
						"Uses consistent formatting throughout",
						"Groups related information together",
						"Uses tables or structured formats where appropriate",
					],
				},
			},
			{
				slug: "context-compression",
				title: "Context Compression",
				estimatedMinutes: 12,
				concept: `Context compression preserves essential information while reducing token count. This is critical when working with limited context windows or optimizing costs.

**Compression techniques:**

**1. Extractive compression:** Pull out only the sentences that are relevant to the query. Discard supporting detail.

**2. Abstractive compression:** Rewrite information more concisely while preserving meaning. "The company was founded in San Francisco, California in the year 2015 by two college friends" → "Founded: SF, 2015."

**3. Structured compression:** Convert prose to structured formats — tables, key-value pairs, bullet points. These are often 50-70% shorter.

**4. Deduplication:** Remove information that appears in multiple sources. Keep the most authoritative version.

**5. Tiered detail:** Create multiple versions of the same content at different detail levels. Use the minimal version by default, expand only when needed.

**Quality control:** After compression, verify that key information is preserved. Test with queries that require the compressed information to ensure accuracy is maintained.`,
				beforeExample: `The Employee Handbook (last updated January 2025) states that all full-time employees who have been with the company for more than 90 days are eligible for the comprehensive health insurance plan which includes medical, dental, and vision coverage. The medical plan is provided through BlueCross BlueShield and includes both in-network and out-of-network coverage options. The dental plan covers preventive care at 100%, basic procedures at 80%, and major procedures at 50%. The vision plan includes an annual eye exam and provides an allowance for frames or contact lenses.`,
				afterExample: `<knowledge compressed="true" original_tokens="~120" compressed_tokens="~45">
Health Insurance (eligible after 90 days, full-time):
- Medical: BCBS, in-network + out-of-network
- Dental: preventive 100%, basic 80%, major 50%
- Vision: annual exam + frames/contacts allowance
</knowledge>`,
				keyTakeaway:
					"Compress context using extraction, abstraction, structured formats, deduplication, and tiered detail levels — always verifying that compressed content preserves accuracy.",
				exercise: {
					instruction:
						"Compress this verbose context to under 50% of its original token count while preserving all essential information.",
					starterPrompt: `Compress this product description for use as context in a support chatbot:

"Our project management tool, TaskFlow Pro, is a comprehensive solution designed for modern teams of all sizes. It was launched in 2022 and has since grown to serve over 50,000 teams worldwide. The platform offers three main pricing tiers: a Free tier that supports up to 5 team members with basic task management features, a Professional tier at $12 per user per month that adds advanced features like Gantt charts, time tracking, and custom workflows, and an Enterprise tier at $25 per user per month that includes everything in Professional plus SSO, audit logs, advanced security, dedicated support, and custom integrations. All plans include unlimited projects, file storage up to the plan limit (1GB free, 10GB pro, unlimited enterprise), and mobile apps for iOS and Android."`,
					evaluationCriteria: [
						"Reduces token count by at least 50%",
						"Preserves all pricing information accurately",
						"Retains key feature differences between tiers",
						"Uses structured format for better readability",
						"Includes all critical facts (launch date, user count, limits)",
					],
				},
			},
			{
				slug: "multi-source-context",
				title: "Multi-Source Context Assembly",
				estimatedMinutes: 15,
				concept: `Production AI systems rarely use a single source of context. Multi-source context assembly combines static knowledge, dynamic data, user history, and real-time information into a coherent context.

**Source types:**

**1. Static context:** System instructions, product documentation, company policies. Rarely changes. Can be cached.

**2. Semi-static context:** User profile, subscription details, preferences. Changes occasionally. Refresh periodically.

**3. Dynamic context:** Retrieved documents (RAG), search results, API responses. Changes per query.

**4. Real-time context:** Current conversation history, user's current page/state, time of day.

**Assembly pipeline:**
1. Start with static context (cached, always included)
2. Add semi-static context (fetched and cached per session)
3. Retrieve dynamic context based on the query
4. Append real-time context (current turn)
5. Apply token budget constraints (trim lower-priority sources)
6. Assemble final context

**Conflict resolution:**
When sources disagree, establish a hierarchy: real-time > dynamic > semi-static > static. More recent, more specific information takes priority.`,
				beforeExample: `{system_prompt}
{all_docs}
{all_history}
{user_message}`,
				afterExample: `<!-- Context assembly pipeline -->

<static cached="true" ttl="24h">
[System instructions — 400 tokens, always included]
</static>

<semi-static cached="true" ttl="1h" refresh="on-session-start">
User: {{user.name}}, Plan: {{user.plan}}, Role: {{user.role}}
Preferences: {{user.preferences}}
</semi-static>

<dynamic source="rag" retrieved_at="{{now}}" top_k="3">
[Source 1] (relevance: 0.95) — {{chunk_1}}
[Source 2] (relevance: 0.87) — {{chunk_2}}
[Source 3] (relevance: 0.76) — {{chunk_3}}
</dynamic>

<realtime>
Conversation history (last 3 turns, summarized prior):
{{conversation_summary}}
{{last_3_turns}}
</realtime>

<conflict-resolution>
Priority: realtime > dynamic > semi-static > static
If sources disagree, prefer the higher-priority source and note the conflict.
</conflict-resolution>

<task>{{user_message}}</task>`,
				keyTakeaway:
					"Multi-source context assembly combines static, semi-static, dynamic, and real-time sources through a pipeline with caching, budget constraints, and conflict resolution.",
				exercise: {
					instruction:
						"Design a multi-source context assembly pipeline for a customer support system that combines product docs, user data, conversation history, and real-time order status.",
					starterPrompt: `Design the context assembly for a support chatbot that needs:
- Product documentation (static)
- Customer account details (semi-static)
- Recent support tickets (dynamic)
- Current conversation (real-time)
- Live order tracking data (real-time)`,
					evaluationCriteria: [
						"Identifies and categorizes all context sources",
						"Defines a clear assembly pipeline with ordering",
						"Includes caching strategy for each source type",
						"Specifies conflict resolution between sources",
						"Applies token budget constraints to the assembly",
					],
				},
			},
		],
	},
	{
		slug: "dynamic-context-production",
		title: "Dynamic Context for Production",
		description:
			"Build production-ready dynamic context systems with RAG integration, history management, tool definitions, and context pipelines.",
		difficulty: "advanced",
		prerequisite: "advanced-context-architecture",
		requiredLevel: 4,
		lessons: [
			{
				slug: "rag-context-integration",
				title: "RAG Context Integration",
				estimatedMinutes: 15,
				concept: `RAG (Retrieval-Augmented Generation) integration connects your context system to a knowledge base, dynamically retrieving relevant information for each query.

**Production RAG pipeline:**

**1. Query preprocessing:** Expand the user's query for better retrieval. Add synonyms, rephrase as a statement, extract key entities.

**2. Retrieval:** Search your knowledge base using semantic similarity, keyword matching, or hybrid approaches. Retrieve top-K results.

**3. Re-ranking:** Not all retrieved results are equally useful. Re-rank by relevance to the specific query, recency, and source authority.

**4. Context injection:** Format retrieved chunks with metadata and inject into the prompt at the appropriate position.

**5. Attribution tracking:** Track which chunks were used so you can cite sources and measure retrieval quality.

**Quality metrics:**
- Retrieval precision (% of retrieved chunks that were actually useful)
- Answer faithfulness (% of response content grounded in retrieved chunks)
- Coverage (% of queries where retrieval found relevant information)`,
				beforeExample: `Search our docs for anything related to the question and paste it all in.

{raw_search_results}

Question: {question}`,
				afterExample: `<retrieval-config>
  query: {original_query}
  expanded_query: {expanded_with_synonyms}
  top_k: 5
  reranked_to: 3
  min_relevance: 0.7
</retrieval-config>

<retrieved-context>
  <chunk id="1" source="docs/auth.md" relevance="0.94" updated="2025-01">
  {chunk_1_text}
  </chunk>

  <chunk id="2" source="docs/api-ref.md" relevance="0.88" updated="2025-01">
  {chunk_2_text}
  </chunk>

  <chunk id="3" source="faq/security.md" relevance="0.79" updated="2024-11">
  {chunk_3_text}
  </chunk>
</retrieved-context>

<instructions>
Answer using the retrieved context. Cite chunks by ID: [Chunk 1].
If retrieved context is insufficient, state what's missing.
Prefer more recent sources when information conflicts.
</instructions>

<question>{original_query}</question>`,
				keyTakeaway:
					"Production RAG pipelines preprocess queries, retrieve and re-rank results, inject context with metadata, and track attribution — measuring precision, faithfulness, and coverage.",
				exercise: {
					instruction:
						"Design a production RAG context integration for a legal document Q&A system with source attribution and confidence scoring.",
					starterPrompt: `Build a RAG context template for a system that answers questions about legal contracts. It should retrieve relevant clauses, cite them, and handle queries that span multiple documents.`,
					evaluationCriteria: [
						"Includes query preprocessing step",
						"Formats retrieved chunks with metadata",
						"Requires source attribution in responses",
						"Handles insufficient retrieval gracefully",
						"Includes relevance thresholds and re-ranking",
					],
				},
			},
			{
				slug: "history-management",
				title: "Conversation History Management",
				estimatedMinutes: 12,
				concept: `In multi-turn conversations, history management determines what past context to include, how to compress it, and when to drop it. Poor history management leads to context overflow, irrelevant context, and degraded responses.

**History management strategies:**

**1. Sliding window:** Keep only the last N turns. Simple but loses important early context.

**2. Summarization:** Periodically summarize older turns into a compressed summary. Preserves key decisions while freeing tokens.

**3. Selective retention:** Keep turns that contain important decisions, requirements, or corrections. Drop chitchat and clarification turns.

**4. Hierarchical history:** Maintain a running summary + last 3 full turns. The summary captures the arc; recent turns provide detail.

**5. Topic-based segmentation:** Group turns by topic. When the conversation shifts topics, summarize the previous topic and archive it.

**Implementation pattern:**
\`\`\`
context = [
  system_instructions,
  conversation_summary,     // Compressed older history
  recent_turns[-3:],        // Last 3 full turns
  current_user_message
]
\`\`\``,
				beforeExample: `<history>
Turn 1: User asked about pricing...
Turn 2: AI explained plans...
Turn 3: User asked about API...
Turn 4: AI showed examples...
[... 50 more turns, all included verbatim ...]
</history>`,
				afterExample: `<history-summary updated="turn_47">
Key decisions:
- User chose Pro plan ($29/mo)
- Implementing REST API integration
- Using Python SDK v3.2
- Authentication via OAuth2 (decided turn 12)
- Rate limiting: 600 req/min (confirmed turn 23)

Open items:
- Webhook configuration (started turn 45)
- Error retry strategy (mentioned but not resolved)
</history-summary>

<recent-turns>
[Turn 48] User: "How do I configure webhook retry behavior?"
[Turn 49] AI: "Webhooks support exponential backoff. Configure via..."
[Turn 50] User: "What about dead letter queues?"
</recent-turns>

<current-turn>
User: {current_message}
</current-turn>`,
				keyTakeaway:
					"Manage conversation history with a combination of summarization and recent turn retention. Keep key decisions in a running summary while preserving the last few turns in full for immediate context.",
				exercise: {
					instruction:
						"Design a history management strategy for a technical support conversation that could last 50+ turns.",
					starterPrompt: `Create a history management approach for a support chatbot. Include: what to summarize, what to retain verbatim, when to update the summary, and how to handle topic changes.`,
					evaluationCriteria: [
						"Defines a summarization strategy for older turns",
						"Retains recent turns in full",
						"Tracks key decisions and open items",
						"Handles topic changes in the conversation",
						"Includes a token budget for history",
					],
				},
			},
			{
				slug: "tool-definitions",
				title: "Tool Definition Context",
				estimatedMinutes: 15,
				concept: `Tool definitions tell the LLM what external capabilities are available — APIs, functions, databases — and when to use them. Well-structured tool definitions enable reliable function calling.

**Tool definition best practices:**

**1. Clear naming:** Tool names should describe the action: \`search_products\` not \`tool_3\`. Use verb_noun format.

**2. Precise descriptions:** Explain when to use the tool AND when not to. "Use search_products when the user asks about product availability, pricing, or features. Do NOT use for order status — use get_order instead."

**3. Parameter documentation:** Each parameter needs: type, description, required/optional, valid values, examples.

**4. Example calls:** Show 1-2 example invocations with realistic parameters and expected responses.

**5. Error handling:** Document what happens when a tool call fails and how to respond to the user.

**6. Sequencing guidance:** When tools should be called in order: "Always call get_user first to get the user ID, then use it in subsequent calls."`,
				beforeExample: `Tools available: search, get_order, update_order, send_email.`,
				afterExample: `<tools>
  <tool name="search_products">
    <description>Search the product catalog by query, category, or price range. Use when the user asks about product availability, features, or comparisons.</description>
    <parameters>
      <param name="query" type="string" required="true">Search terms</param>
      <param name="category" type="enum" required="false" values="electronics,clothing,home">Filter by category</param>
      <param name="max_price" type="number" required="false">Maximum price in USD</param>
    </parameters>
    <example>
      search_products(query="wireless headphones", category="electronics", max_price=100)
      → Returns: [{ name, price, rating, in_stock }]
    </example>
    <when_not_to_use>Don't use for order-related queries. Use get_order instead.</when_not_to_use>
  </tool>

  <tool name="get_order">
    <description>Retrieve order details by order ID or customer email. Use for order status, tracking, and history queries.</description>
    <parameters>
      <param name="order_id" type="string" required="false">Order ID (format: ORD-XXXXX)</param>
      <param name="email" type="string" required="false">Customer email. At least one of order_id or email required.</param>
    </parameters>
    <error_handling>If order not found, inform the user and ask them to verify the order ID.</error_handling>
  </tool>
</tools>

<tool-usage-rules>
- Always confirm tool results with the user before taking actions
- If a tool call fails, explain the error and suggest alternatives
- Never call update_order without explicit user confirmation
</tool-usage-rules>`,
				keyTakeaway:
					"Tool definitions need clear names, precise descriptions, parameter documentation, example calls, error handling guidance, and sequencing rules for reliable function calling.",
				exercise: {
					instruction:
						"Write comprehensive tool definitions for a customer support system with 3 tools: search knowledge base, create ticket, and escalate to human.",
					starterPrompt: `Define 3 tools for a support chatbot: (1) search_kb — search the knowledge base, (2) create_ticket — create a support ticket, (3) escalate — transfer to a human agent. Include all best practices.`,
					evaluationCriteria: [
						"Each tool has a clear name and description",
						"Parameters are documented with types and constraints",
						"Includes when-to-use and when-not-to-use guidance",
						"Provides example invocations with expected responses",
						"Includes error handling and sequencing rules",
					],
				},
			},
			{
				slug: "context-pipelines",
				title: "Context Assembly Pipelines",
				estimatedMinutes: 15,
				concept: `Context assembly pipelines are systematic processes for constructing the final context from multiple sources. Like software build pipelines, they're deterministic, testable, and observable.

**Pipeline stages:**

**1. Classify** — Determine the query type, intent, and required context sources.
**2. Retrieve** — Fetch relevant context from each required source.
**3. Filter** — Remove irrelevant, duplicate, or outdated context.
**4. Rank** — Order context by relevance and priority.
**5. Budget** — Trim context to fit within token limits.
**6. Assemble** — Combine all context into the final prompt.
**7. Validate** — Check that the assembled context meets minimum requirements.

**Pipeline properties:**
- **Deterministic:** Same inputs always produce the same context.
- **Observable:** Log each stage for debugging.
- **Testable:** Unit test each stage independently.
- **Fallback-safe:** If any stage fails, use a degraded but functional context.

**Error handling:**
Each stage should have a fallback. If retrieval fails, use cached results. If classification is uncertain, include broader context. If budget is exceeded, use compressed versions.`,
				beforeExample: `# Assemble context somehow
context = system + docs + history + user_message
# Hope it works
response = llm(context)`,
				afterExample: `## Context Pipeline Definition

### Stage 1: Classify
Input: user_message
Output: { intent, entities, context_sources_needed }
Fallback: assume "general_query", include all sources

### Stage 2: Retrieve
Input: classification + source configs
Output: { knowledge_chunks, user_data, history }
Fallback: use cached results (max 1h old)

### Stage 3: Filter
Input: all retrieved context
Output: deduplicated, relevance > 0.7 only
Fallback: skip filtering, include all retrieved

### Stage 4: Rank
Input: filtered context
Output: ordered by relevance score
Fallback: order by recency

### Stage 5: Budget
Input: ranked context + token_limit (8000)
Output: trimmed context within budget
Allocation: system 500, knowledge 4000, history 1500, response 2000

### Stage 6: Assemble
Input: budgeted context blocks
Output: final prompt string
Template: system → knowledge → history → task

### Stage 7: Validate
Checks: system_instructions present, knowledge non-empty, task clear
On failure: log warning, proceed with available context`,
				keyTakeaway:
					"Context assembly pipelines are deterministic, observable, testable, and fallback-safe — classifying, retrieving, filtering, ranking, budgeting, assembling, and validating context systematically.",
				exercise: {
					instruction:
						"Design a complete context assembly pipeline for an AI coding assistant that uses documentation, code context, and conversation history.",
					starterPrompt: `Build a pipeline for an AI coding assistant that needs to assemble context from: (1) language/framework documentation, (2) the user's current codebase, (3) conversation history, and (4) the current code file being edited. Define all 7 stages with fallbacks.`,
					evaluationCriteria: [
						"Defines all pipeline stages with clear inputs/outputs",
						"Includes fallbacks for each stage",
						"Specifies token budget allocation",
						"Pipeline is deterministic and testable",
						"Includes validation checks on the final output",
					],
				},
			},
			{
				slug: "drift-detection-maintenance",
				title: "Context Drift Detection",
				estimatedMinutes: 12,
				concept: `Context drift occurs when the effectiveness of your context degrades over time — due to outdated knowledge, changed model behavior, or evolving user needs. Detection and maintenance prevent silent quality degradation.

**Types of drift:**

**1. Knowledge drift:** Your context references outdated information. Product pricing changed, API endpoints moved, policies updated.

**2. Model drift:** A model update changes how the model interprets your context. Prompts that worked on v1 may behave differently on v2.

**3. Usage drift:** User needs evolve. The context was designed for one use case but users are asking different questions.

**Detection strategies:**

**1. Periodic evaluation:** Run your test suite weekly against the current model. Track quality scores over time.

**2. Output monitoring:** Track format compliance, sentiment patterns, and response length distributions. Sudden changes indicate drift.

**3. User feedback:** Track thumbs up/down, regeneration requests, and follow-up questions. Declining satisfaction signals drift.

**4. A/B testing:** When updating context, run old and new versions side by side. Compare quality metrics.

**Maintenance practices:**
- Schedule quarterly context reviews
- Version all context artifacts (system prompts, knowledge blocks, examples)
- Maintain a changelog of context modifications
- Automate freshness checks on knowledge sources`,
				beforeExample: `# Deploy once and never update
SYSTEM_PROMPT = "You are a helpful assistant..."
# Same prompt for 2 years, through 5 model updates`,
				afterExample: `## Context Maintenance Plan

### Versioning
- context_version: 3.2.1 (major.minor.patch)
- last_reviewed: 2025-01-15
- next_review: 2025-04-15

### Automated checks (weekly)
- Run test suite (50 test cases) → track pass rate trend
- Check knowledge sources for updates (API docs, pricing page)
- Compare output distributions to baseline

### Alert thresholds
- Test pass rate drops >5% from baseline → immediate review
- Average user rating drops below 4.0/5.0 → investigate
- New error categories appear → add to test suite

### Quarterly review checklist
- [ ] All knowledge blocks verified current
- [ ] Test suite covers recent user queries
- [ ] Model version compatibility confirmed
- [ ] Token budget still appropriate
- [ ] Examples still representative of desired output

### Changelog
v3.2.1 (2025-01-15): Updated pricing knowledge block
v3.2.0 (2024-12-01): Added new API endpoints to context
v3.1.0 (2024-10-15): Migrated to Claude 3.5 — adjusted examples`,
				keyTakeaway:
					"Prevent context drift through periodic evaluation, output monitoring, user feedback tracking, and structured maintenance — versioning all context artifacts and maintaining a review schedule.",
				exercise: {
					instruction:
						"Create a drift detection and maintenance plan for a production AI system that answers questions about a SaaS product.",
					starterPrompt: `Design a drift detection strategy for a product Q&A bot. Include: what to monitor, how to detect drift, alert thresholds, and a maintenance schedule.`,
					evaluationCriteria: [
						"Identifies multiple types of drift to monitor",
						"Defines specific detection methods and metrics",
						"Sets concrete alert thresholds",
						"Includes a versioning strategy for context",
						"Specifies a regular review and maintenance schedule",
					],
				},
			},
		],
	},
];

export function getLearningPath(slug: string): LearningPath | undefined {
	return LEARNING_PATHS.find((p) => p.slug === slug);
}

export function getLesson(
	pathSlug: string,
	lessonSlug: string,
): Lesson | undefined {
	const path = getLearningPath(pathSlug);
	return path?.lessons.find((l) => l.slug === lessonSlug);
}
