import {
	ArrowRight,
	BookOpen,
	BrainCircuit,
	Lightbulb,
	ListChecks,
	Search,
	Sparkles,
	Target,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentItem } from "@/lib/db/queries/dashboard-stats";
import type { SkillProfile } from "@/lib/skills/skill-profile";

interface RecommendationsProps {
	items: RecentItem[];
	totalPrompts: number;
	skillProfile: SkillProfile | null;
}

interface Recommendation {
	icon: typeof Sparkles;
	title: string;
	description: string;
	href: string;
	actionLabel: string;
	priority: number;
}

const SKILL_RECOMMENDATIONS: Record<
	string,
	{
		icon: typeof Sparkles;
		title: string;
		description: string;
		href: string;
		actionLabel: string;
	}
> = {
	structure: {
		icon: ListChecks,
		title: "Add more structure to your prompts",
		description:
			"Try defining clear roles, output formats, and constraints. Structured prompts score significantly higher.",
		href: "/prompts/new?mode=guided",
		actionLabel: "Guided Builder",
	},
	techniques: {
		icon: BrainCircuit,
		title: "Try few-shot examples in your prompts",
		description:
			"Adding 2-3 examples helps the AI understand your expected output. Your technique scores suggest this area has room to grow.",
		href: "/learn",
		actionLabel: "Learn More",
	},
	specificity: {
		icon: Target,
		title: "Be more specific in your instructions",
		description:
			"Vague instructions lead to unpredictable results. Try specifying exact formats, lengths, and constraints.",
		href: "/learn",
		actionLabel: "Learn More",
	},
	complexity: {
		icon: BrainCircuit,
		title: "Handle edge cases in your prompts",
		description:
			"Add error handling instructions and define behavior for unexpected inputs to make your prompts more robust.",
		href: "/learn",
		actionLabel: "Learn More",
	},
	modelAwareness: {
		icon: BookOpen,
		title: "Learn model-specific best practices",
		description:
			"Different models respond better to different prompting styles. Explore model-specific tips to improve results.",
		href: "/learn",
		actionLabel: "Explore",
	},
	contextDesign: {
		icon: Target,
		title: "Improve your context design",
		description:
			"Better context leads to better outputs. Try using blueprints to structure your context more effectively.",
		href: "/blueprints",
		actionLabel: "View Blueprints",
	},
	grounding: {
		icon: BookOpen,
		title: "Ground your prompts with examples",
		description:
			"Adding factual examples and specific references helps the AI produce more accurate, grounded responses.",
		href: "/learn",
		actionLabel: "Learn More",
	},
	tokenManagement: {
		icon: Sparkles,
		title: "Optimize your token usage",
		description:
			"Some of your prompts may contain redundant instructions. Try the compression tool to save tokens without losing meaning.",
		href: "/prompts",
		actionLabel: "View Prompts",
	},
	informationArchitecture: {
		icon: ListChecks,
		title: "Organize your prompt information better",
		description:
			"Breaking complex tasks into clear steps and sections makes it easier for the AI to follow your intent.",
		href: "/prompts/new?mode=guided",
		actionLabel: "Guided Builder",
	},
	dynamicContext: {
		icon: BrainCircuit,
		title: "Add dynamic context handling",
		description:
			"Build prompts that adapt to varying inputs with conditional instructions and error handling patterns.",
		href: "/learn",
		actionLabel: "Learn More",
	},
};

function getSkillBasedRecommendations(profile: SkillProfile): Recommendation[] {
	const recs: Recommendation[] = [];

	// Get all skills sorted by score (lowest first)
	const allSkills: { key: string; score: number }[] = [
		...Object.entries(profile.promptEngineering).map(([key, score]) => ({
			key,
			score,
		})),
		...Object.entries(profile.contextEngineering).map(([key, score]) => ({
			key,
			score,
		})),
	];
	allSkills.sort((a, b) => a.score - b.score);

	// Take up to 3 weakest skills that are below 4
	const weakSkills = allSkills.filter((s) => s.score < 4).slice(0, 3);

	for (const skill of weakSkills) {
		const rec = SKILL_RECOMMENDATIONS[skill.key];
		if (rec) {
			recs.push({
				...rec,
				priority: 5 - skill.score, // Higher priority for lower scores
			});
		}
	}

	return recs;
}

export function Recommendations({
	items,
	totalPrompts,
	skillProfile,
}: RecommendationsProps) {
	const recommendations: Recommendation[] = [];

	// 1. Skill-based recommendations (highest priority when available)
	if (skillProfile) {
		recommendations.push(...getSkillBasedRecommendations(skillProfile));
	}

	// 2. Find prompts with low scores
	const lowScoreItems = items.filter(
		(i) => i.type === "prompt" && i.score !== null && i.score < 60,
	);
	const lowScoreItem = lowScoreItems[0];
	if (lowScoreItem) {
		recommendations.push({
			icon: Sparkles,
			title: "Improve a low-scoring prompt",
			description: `"${lowScoreItem.name}" scored ${lowScoreItem.score}. Analysis suggestions can help you improve it.`,
			href: `/prompts/${lowScoreItem.slug}?tab=analysis`,
			actionLabel: "View Analysis",
			priority: 3,
		});
	}

	// 3. Find prompts without scores (never analyzed)
	const unanalyzed = items.filter(
		(i) => i.type === "prompt" && i.score === null,
	);
	const unanalyzedItem = unanalyzed[0];
	if (unanalyzedItem) {
		recommendations.push({
			icon: Search,
			title: "Analyze an unscored prompt",
			description: `"${unanalyzedItem.name}" hasn't been analyzed yet. Run analysis to get improvement suggestions.`,
			href: `/prompts/${unanalyzedItem.slug}?tab=analysis`,
			actionLabel: "Analyze",
			priority: 2,
		});
	}

	// 4. Suggest learning if user has few prompts
	if (totalPrompts < 5) {
		recommendations.push({
			icon: Lightbulb,
			title: "Learn prompt engineering techniques",
			description:
				"Explore our knowledge base for proven patterns like few-shot prompting and chain-of-thought reasoning.",
			href: "/learn",
			actionLabel: "Explore",
			priority: 1,
		});
	}

	if (recommendations.length === 0) {
		return null;
	}

	// Sort by priority descending, take top 3
	const sorted = [...recommendations]
		.sort((a, b) => b.priority - a.priority)
		.slice(0, 3);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Recommendations</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{sorted.map((rec) => (
					<div
						key={rec.title}
						className="flex items-start gap-3 rounded-lg border p-3"
					>
						<rec.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<div className="flex-1">
							<p className="font-medium text-sm">{rec.title}</p>
							<p className="mt-0.5 text-muted-foreground text-xs">
								{rec.description}
							</p>
						</div>
						<Button variant="ghost" size="sm" asChild className="shrink-0">
							<Link href={rec.href}>
								{rec.actionLabel}
								<ArrowRight className="ml-1 h-3 w-3" />
							</Link>
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
