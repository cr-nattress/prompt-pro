import type { Analysis } from "@/lib/db/schema";

/**
 * Skill profile for a user, computed from their analysis history.
 * Each skill is scored 1-5 (derived from 0-100 analysis scores).
 */
export interface SkillProfile {
	promptEngineering: {
		structure: number;
		techniques: number;
		specificity: number;
		complexity: number;
		modelAwareness: number;
	};
	contextEngineering: {
		contextDesign: number;
		grounding: number;
		tokenManagement: number;
		informationArchitecture: number;
		dynamicContext: number;
	};
	overallLevel: number;
	levelLabel: string;
	weakestSkill: {
		category: "promptEngineering" | "contextEngineering";
		skill: string;
		label: string;
		score: number;
	};
	totalAnalyses: number;
	averageScore: number;
}

const LEVEL_LABELS = [
	"Beginner",
	"Novice",
	"Intermediate",
	"Advanced",
	"Expert",
] as const;

/** Map 0-100 scores to 1-5 skill levels */
function toSkillLevel(score: number): number {
	if (score >= 90) return 5;
	if (score >= 70) return 4;
	if (score >= 50) return 3;
	if (score >= 30) return 2;
	return 1;
}

/** Average an array of numbers, returning 0 for empty arrays */
function avg(nums: number[]): number {
	if (nums.length === 0) return 0;
	return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * Compute a user's skill profile from their analysis history.
 * Uses the latest N analyses (default: 20) for a rolling average.
 */
export function computeSkillProfile(
	analyses: Analysis[],
	maxAnalyses = 20,
): SkillProfile {
	const recent = analyses.slice(0, maxAnalyses);

	if (recent.length === 0) {
		return {
			promptEngineering: {
				structure: 1,
				techniques: 1,
				specificity: 1,
				complexity: 1,
				modelAwareness: 1,
			},
			contextEngineering: {
				contextDesign: 1,
				grounding: 1,
				tokenManagement: 1,
				informationArchitecture: 1,
				dynamicContext: 1,
			},
			overallLevel: 1,
			levelLabel: "Beginner",
			weakestSkill: {
				category: "promptEngineering",
				skill: "structure",
				label: "Structure",
				score: 1,
			},
			totalAnalyses: 0,
			averageScore: 0,
		};
	}

	// Map analysis dimensions to skill categories
	// Prompt Engineering skills:
	//   structure = avg(roleDefinition, outputFormatting, constraintQuality)
	//   techniques = avg(exampleUsage, taskDecomposition)
	//   specificity = avg(clarity, specificity)
	//   complexity = avg(errorHandling, creativityScope)
	//   modelAwareness = avg(safetyAlignment, tokenEfficiency)
	const structureScores = recent.map((a) =>
		avg([
			a.roleDefinition ?? 0,
			a.outputFormatting ?? 0,
			a.constraintQuality ?? 0,
		]),
	);
	const techniqueScores = recent.map((a) =>
		avg([a.exampleUsage ?? 0, a.taskDecomposition ?? 0]),
	);
	const specificityScores = recent.map((a) =>
		avg([a.clarity ?? 0, a.specificity ?? 0]),
	);
	const complexityScores = recent.map((a) =>
		avg([a.errorHandling ?? 0, a.creativityScope ?? 0]),
	);
	const modelAwarenessScores = recent.map((a) =>
		avg([a.safetyAlignment ?? 0, a.tokenEfficiency ?? 0]),
	);

	// Context Engineering skills (derived from same dimensions, emphasis on different aspects):
	//   contextDesign = avg(contextAdequacy, roleDefinition)
	//   grounding = avg(specificity, exampleUsage)
	//   tokenManagement = avg(tokenEfficiency)
	//   informationArchitecture = avg(taskDecomposition, outputFormatting)
	//   dynamicContext = avg(errorHandling, constraintQuality)
	const contextDesignScores = recent.map((a) =>
		avg([a.contextAdequacy ?? 0, a.roleDefinition ?? 0]),
	);
	const groundingScores = recent.map((a) =>
		avg([a.specificity ?? 0, a.exampleUsage ?? 0]),
	);
	const tokenMgmtScores = recent.map((a) => a.tokenEfficiency ?? 0);
	const infoArchScores = recent.map((a) =>
		avg([a.taskDecomposition ?? 0, a.outputFormatting ?? 0]),
	);
	const dynamicCtxScores = recent.map((a) =>
		avg([a.errorHandling ?? 0, a.constraintQuality ?? 0]),
	);

	const pe = {
		structure: toSkillLevel(avg(structureScores)),
		techniques: toSkillLevel(avg(techniqueScores)),
		specificity: toSkillLevel(avg(specificityScores)),
		complexity: toSkillLevel(avg(complexityScores)),
		modelAwareness: toSkillLevel(avg(modelAwarenessScores)),
	};

	const ce = {
		contextDesign: toSkillLevel(avg(contextDesignScores)),
		grounding: toSkillLevel(avg(groundingScores)),
		tokenManagement: toSkillLevel(avg(tokenMgmtScores)),
		informationArchitecture: toSkillLevel(avg(infoArchScores)),
		dynamicContext: toSkillLevel(avg(dynamicCtxScores)),
	};

	const allSkills = [...Object.values(pe), ...Object.values(ce)];
	const overallLevel = Math.max(1, Math.round(avg(allSkills)));
	const levelLabel =
		LEVEL_LABELS[Math.min(Math.max(overallLevel - 1, 0), 4)] ?? "Beginner";

	// Find weakest skill
	const peEntries = Object.entries(pe) as [string, number][];
	const ceEntries = Object.entries(ce) as [string, number][];

	const peMin = peEntries.reduce((min, entry) =>
		entry[1] < min[1] ? entry : min,
	);
	const ceMin = ceEntries.reduce((min, entry) =>
		entry[1] < min[1] ? entry : min,
	);

	const weakest =
		peMin[1] <= ceMin[1]
			? {
					category: "promptEngineering" as const,
					skill: peMin[0],
					label: skillLabel(peMin[0]),
					score: peMin[1],
				}
			: {
					category: "contextEngineering" as const,
					skill: ceMin[0],
					label: skillLabel(ceMin[0]),
					score: ceMin[1],
				};

	const averageScore = avg(recent.map((a) => a.overallScore ?? 0));

	return {
		promptEngineering: pe,
		contextEngineering: ce,
		overallLevel,
		levelLabel,
		weakestSkill: weakest,
		totalAnalyses: recent.length,
		averageScore: Math.round(averageScore),
	};
}

function skillLabel(key: string): string {
	const labels: Record<string, string> = {
		structure: "Structure",
		techniques: "Techniques",
		specificity: "Specificity",
		complexity: "Complexity",
		modelAwareness: "Model Awareness",
		contextDesign: "Context Design",
		grounding: "Grounding",
		tokenManagement: "Token Management",
		informationArchitecture: "Information Architecture",
		dynamicContext: "Dynamic Context",
	};
	return labels[key] ?? key;
}

export function getGrowthRecommendation(profile: SkillProfile): string {
	const { weakestSkill } = profile;
	const recommendations: Record<string, string> = {
		structure:
			"Focus on defining clear roles, output formats, and constraints in your prompts.",
		techniques:
			"Try adding few-shot examples and breaking complex tasks into steps.",
		specificity: "Make your instructions more specific and reduce ambiguity.",
		complexity:
			"Practice handling edge cases and balancing creative freedom with constraints.",
		modelAwareness:
			"Learn about model-specific best practices and token efficiency.",
		contextDesign: "Improve how you structure context for your prompts.",
		grounding:
			"Add more specific examples and factual grounding to your prompts.",
		tokenManagement:
			"Work on using tokens more efficiently — compress redundant instructions.",
		informationArchitecture:
			"Improve how you organize and decompose information in prompts.",
		dynamicContext:
			"Practice building prompts that handle varying input conditions.",
	};
	return (
		recommendations[weakestSkill.skill] ??
		"Keep practicing and analyzing your prompts to improve."
	);
}
