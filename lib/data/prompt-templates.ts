export type TemplateCategory =
	| "writing"
	| "coding"
	| "analysis"
	| "creative"
	| "support"
	| "education";

export interface PromptStarterTemplate {
	slug: string;
	name: string;
	category: TemplateCategory;
	description: string;
	purpose: string;
	targetLlm: string;
	tags: string[];
	parameters: Array<{ name: string; description: string; example: string }>;
	templateText: string;
}

export const TEMPLATE_CATEGORIES: Array<{
	value: TemplateCategory;
	label: string;
}> = [
	{ value: "writing", label: "Writing" },
	{ value: "coding", label: "Coding" },
	{ value: "analysis", label: "Analysis" },
	{ value: "creative", label: "Creative" },
	{ value: "support", label: "Customer Support" },
	{ value: "education", label: "Education" },
];

export const PROMPT_STARTER_TEMPLATES: PromptStarterTemplate[] = [
	{
		slug: "code-review-assistant",
		name: "Code Review Assistant",
		category: "coding",
		description:
			"Reviews code for bugs, security issues, and style improvements with severity-rated feedback.",
		purpose: "Automated first-pass code review",
		targetLlm: "Any",
		tags: ["code-review", "security", "quality"],
		parameters: [
			{
				name: "language",
				description: "Programming language of the code",
				example: "TypeScript",
			},
			{
				name: "code",
				description: "The code to review",
				example: "function add(a, b) { return a + b; }",
			},
		],
		templateText: `You are an expert code reviewer. Review the following {{language}} code for:

1. **Bugs & Logic Errors**: Identify any bugs, edge cases, or logic issues
2. **Security**: Check for common vulnerabilities (injection, XSS, hardcoded secrets)
3. **Performance**: Flag any performance concerns
4. **Readability**: Suggest improvements for clarity and maintainability

For each issue found, provide:
- **Severity**: 🔴 Critical | 🟡 Warning | 🔵 Suggestion
- **Location**: Reference the specific line or section
- **Problem**: Clear description
- **Fix**: Specific code change to resolve it

Code to review:
\`\`\`{{language}}
{{code}}
\`\`\`

End with 1-2 things done well. Maximum 8 issues to keep the review focused.`,
	},
	{
		slug: "meeting-summarizer",
		name: "Meeting Notes Summarizer",
		category: "writing",
		description:
			"Transforms raw meeting notes or transcripts into structured summaries with action items.",
		purpose: "Meeting documentation and follow-up tracking",
		targetLlm: "Any",
		tags: ["meetings", "productivity", "summary"],
		parameters: [
			{
				name: "notes",
				description: "Raw meeting notes or transcript",
				example: "Discussion about Q2 roadmap...",
			},
			{
				name: "attendees",
				description: "List of meeting participants",
				example: "Alice, Bob, Charlie",
			},
		],
		templateText: `You are a professional meeting summarizer. Transform the following raw meeting notes into a clear, actionable summary.

## Meeting Attendees
{{attendees}}

## Raw Notes
{{notes}}

## Output Format

### Summary
2-3 sentence overview of what was discussed and decided.

### Key Decisions
- Bullet list of decisions made, with who proposed and who approved

### Action Items
| Owner | Action | Deadline | Priority |
|-------|--------|----------|----------|
| Name | What needs to be done | When | High/Medium/Low |

### Open Questions
- List any unresolved topics that need follow-up

### Next Meeting
- Suggested topics for the next meeting based on unresolved items

Keep the summary concise. Use the attendees' actual names when assigning actions.`,
	},
	{
		slug: "email-drafter",
		name: "Professional Email Drafter",
		category: "writing",
		description:
			"Drafts professional emails from bullet points, matching the appropriate tone and format.",
		purpose: "Quick professional email composition",
		targetLlm: "Any",
		tags: ["email", "communication", "professional"],
		parameters: [
			{
				name: "context",
				description: "Brief context about the email situation",
				example: "Following up on a proposal sent last week",
			},
			{
				name: "key_points",
				description: "Main points to include",
				example:
					"- Thank them for the meeting\n- Confirm next steps\n- Attach revised proposal",
			},
			{
				name: "tone",
				description: "Desired tone",
				example: "professional but warm",
			},
		],
		templateText: `You are a professional communication specialist. Draft an email based on the following inputs.

**Context**: {{context}}

**Key points to cover**:
{{key_points}}

**Tone**: {{tone}}

## Guidelines
- Keep the email concise (under 200 words for the body)
- Use a clear subject line that reflects the email's purpose
- Open with appropriate greeting
- One key point per paragraph
- End with a clear call-to-action or next step
- Close professionally

## Output
**Subject**: [Subject line]

[Email body]

Provide 2 versions if the context is ambiguous (e.g., one more formal, one more casual).`,
	},
	{
		slug: "data-analyzer",
		name: "Data Analysis Report Generator",
		category: "analysis",
		description:
			"Analyzes data and produces structured reports with insights, visualizations suggestions, and recommendations.",
		purpose: "Data-driven business insight generation",
		targetLlm: "Any",
		tags: ["data", "analytics", "reporting"],
		parameters: [
			{
				name: "data",
				description: "The data to analyze (CSV, JSON, or description)",
				example: "Monthly revenue: Jan $50k, Feb $55k, Mar $48k...",
			},
			{
				name: "question",
				description: "Specific question to answer",
				example: "Why did revenue drop in March?",
			},
		],
		templateText: `You are a senior data analyst. Analyze the following data and provide actionable insights.

## Data
{{data}}

## Question to Answer
{{question}}

## Analysis Framework

### Executive Summary
3 sentences: What's the key finding? What does it mean? What should we do?

### Detailed Findings
For each insight:
- **Finding**: One-sentence headline
- **Evidence**: Specific numbers from the data
- **Impact**: Business implication
- **Confidence**: High/Medium/Low

### Data Quality Notes
Flag any issues: missing data, outliers, insufficient sample size.

### Visualization Recommendations
Suggest the best chart types for communicating each finding.

### Recommended Actions
Numbered list of 3-5 specific actions, ordered by priority.

## Rules
- Always cite specific numbers — never say "many" or "some"
- Present insights in order of business impact
- Distinguish between correlation and causation
- If the data is insufficient to answer the question confidently, say so`,
	},
	{
		slug: "lesson-plan-creator",
		name: "Lesson Plan Creator",
		category: "education",
		description:
			"Creates structured lesson plans with objectives, activities, and assessments for any topic.",
		purpose: "Educational content planning",
		targetLlm: "Any",
		tags: ["education", "teaching", "curriculum"],
		parameters: [
			{
				name: "topic",
				description: "The topic to teach",
				example: "Introduction to Machine Learning",
			},
			{
				name: "audience",
				description: "Target audience",
				example: "College freshmen with basic Python knowledge",
			},
			{
				name: "duration",
				description: "Lesson duration",
				example: "60 minutes",
			},
		],
		templateText: `You are an experienced educator and curriculum designer. Create a detailed lesson plan for the following:

**Topic**: {{topic}}
**Audience**: {{audience}}
**Duration**: {{duration}}

## Lesson Plan Structure

### Learning Objectives
List 3-4 specific, measurable objectives using Bloom's taxonomy verbs (e.g., "Students will be able to explain...", "Students will demonstrate...").

### Prerequisites
What should students already know before this lesson?

### Materials Needed
List any required materials, tools, or preparation.

### Lesson Flow

| Time | Activity | Description | Method |
|------|----------|-------------|--------|
| 0-5 min | Opening | Hook / attention grabber | ... |
| ... | ... | ... | ... |

Include a mix of:
- Direct instruction (max 30% of time)
- Interactive activities
- Practice/application
- Discussion/reflection

### Assessment
- **Formative**: How will you check understanding during the lesson?
- **Summative**: How will you assess learning after the lesson?

### Differentiation
- For advanced learners: extension activity
- For struggling learners: scaffolding approach

### Reflection Questions
2-3 questions for the instructor to reflect on after teaching.`,
	},
	{
		slug: "creative-story-starter",
		name: "Creative Story Starter",
		category: "creative",
		description:
			"Generates engaging story openings with characters, setting, and narrative hooks.",
		purpose: "Creative writing inspiration and structure",
		targetLlm: "Any",
		tags: ["creative-writing", "storytelling", "fiction"],
		parameters: [
			{
				name: "genre",
				description: "Story genre",
				example: "science fiction",
			},
			{
				name: "theme",
				description: "Central theme to explore",
				example: "What makes us human",
			},
			{
				name: "setting",
				description: "Where and when",
				example: "Near-future Mars colony",
			},
		],
		templateText: `You are a creative writing mentor who helps writers overcome blank-page paralysis with compelling story foundations.

**Genre**: {{genre}}
**Theme**: {{theme}}
**Setting**: {{setting}}

## Generate the Following

### Opening Scene (200-300 words)
Write an immersive opening that:
- Starts in the middle of action or tension (in medias res)
- Establishes the setting through sensory details, not exposition
- Introduces the protagonist through their choices, not description
- Plants a hook that raises a question the reader wants answered

### Character Sketch
**Protagonist**:
- Name and brief description
- Core desire (what they want)
- Core flaw (what holds them back)
- The lie they believe about the world

**Antagonist or opposing force**:
- Nature (person, system, self, nature)
- Why they oppose the protagonist
- How they're right from their own perspective

### Story Architecture
- **Inciting incident**: What disrupts the protagonist's normal life?
- **Central conflict**: What's at stake?
- **3 possible plot turns**: Unexpected developments that could raise tension
- **Thematic question**: What question should the reader be asking by the end?

## Constraints
- Avoid clichés and well-worn tropes (or subvert them explicitly)
- Characters must have genuine complexity — no pure heroes or villains
- The theme should emerge naturally from the story, never stated directly
- All world-building details must serve the story or character`,
	},
];

export function getTemplate(slug: string): PromptStarterTemplate | undefined {
	return PROMPT_STARTER_TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(
	category: TemplateCategory,
): PromptStarterTemplate[] {
	return PROMPT_STARTER_TEMPLATES.filter((t) => t.category === category);
}
