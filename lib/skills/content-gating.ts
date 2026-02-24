import type { LearningPath } from "@/lib/data/learning-paths";
import type { SkillProfile } from "@/lib/skills/skill-profile";

interface PathAccessResult {
	isLocked: boolean;
	reason: string | null;
}

/**
 * Check if a user has access to a learning path based on their skill level
 * and prerequisite completion.
 */
export function checkPathAccess(
	path: LearningPath,
	profile: SkillProfile | null,
	completedPaths: Set<string>,
): PathAccessResult {
	// Check prerequisite first
	if (path.prerequisite && !completedPaths.has(path.prerequisite)) {
		return {
			isLocked: true,
			reason: `Complete "${path.prerequisite}" first`,
		};
	}

	// Check level requirement
	const requiredLevel = path.requiredLevel ?? 1;
	const userLevel = profile?.overallLevel ?? 1;

	if (userLevel < requiredLevel) {
		return {
			isLocked: true,
			reason: `Reach Level ${requiredLevel} to unlock`,
		};
	}

	return { isLocked: false, reason: null };
}

interface NextLevelResult {
	ready: boolean;
	nextLevel: number;
}

/**
 * Check if a user is ready to advance to the next skill level.
 */
export function checkReadyForNextLevel(
	profile: SkillProfile | null,
): NextLevelResult | null {
	if (!profile || profile.overallLevel >= 5) return null;

	const nextLevel = profile.overallLevel + 1;
	const allSkills = [
		...Object.values(profile.promptEngineering),
		...Object.values(profile.contextEngineering),
	];

	// Ready if at least 60% of skills are at or above the next level
	const atNextLevel = allSkills.filter((s) => s >= nextLevel).length;
	const ready = atNextLevel / allSkills.length >= 0.6;

	return { ready, nextLevel };
}
