export interface BadgeDefinition {
	slug: string;
	title: string;
	description: string;
	icon: string;
	type: "path_completion" | "challenge_achievement" | "milestone";
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
	// Path completion badges (one per learning path)
	{
		slug: "path-prompt-foundations",
		title: "Foundations Graduate",
		description: "Completed the Prompt Foundations path",
		icon: "graduation-cap",
		type: "path_completion",
	},
	{
		slug: "path-intermediate-techniques",
		title: "Technique Practitioner",
		description: "Completed the Intermediate Techniques path",
		icon: "award",
		type: "path_completion",
	},
	{
		slug: "path-context-engineering-foundations",
		title: "Context Engineer",
		description: "Completed the Context Engineering Foundations path",
		icon: "layers",
		type: "path_completion",
	},
	{
		slug: "path-advanced-patterns",
		title: "Pattern Master",
		description: "Completed the Advanced Patterns path",
		icon: "puzzle",
		type: "path_completion",
	},
	{
		slug: "path-production-prompt-engineering",
		title: "Production Ready",
		description: "Completed the Production Prompt Engineering path",
		icon: "rocket",
		type: "path_completion",
	},
	{
		slug: "path-advanced-context-architecture",
		title: "Context Architect",
		description: "Completed the Advanced Context Architecture path",
		icon: "building",
		type: "path_completion",
	},
	{
		slug: "path-dynamic-context-production",
		title: "Dynamic Context Pro",
		description: "Completed the Dynamic Context for Production path",
		icon: "zap",
		type: "path_completion",
	},

	// Challenge achievement badges
	{
		slug: "first-challenge",
		title: "First Challenge",
		description: "Submitted your first challenge",
		icon: "flag",
		type: "challenge_achievement",
	},
	{
		slug: "challenge-score-90",
		title: "High Achiever",
		description: "Scored 90 or above on a challenge",
		icon: "star",
		type: "challenge_achievement",
	},
	{
		slug: "five-challenges",
		title: "Challenge Champion",
		description: "Completed 5 challenges with a passing score",
		icon: "trophy",
		type: "challenge_achievement",
	},

	// Milestone badges
	{
		slug: "ten-prompts",
		title: "Prompt Maker",
		description: "Created 10 prompts",
		icon: "scroll-text",
		type: "milestone",
	},
	{
		slug: "fifty-prompts",
		title: "Prompt Architect",
		description: "Created 50 prompts",
		icon: "scroll-text",
		type: "milestone",
	},
];

export function getBadgeDefinition(slug: string): BadgeDefinition | undefined {
	return BADGE_DEFINITIONS.find((b) => b.slug === slug);
}
