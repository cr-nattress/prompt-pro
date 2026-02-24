import { awardBadge, hasBadge } from "@/lib/db/queries/badges";

async function tryAward(
	userId: string,
	badgeSlug: string,
	badgeType: string,
	metadata?: Record<string, unknown> | undefined,
) {
	const already = await hasBadge(userId, badgeSlug);
	if (already) return null;
	return awardBadge({ userId, badgeSlug, badgeType, metadata });
}

/**
 * Check and award badges after completing a learning path lesson.
 */
export async function checkAndAwardPathBadges(
	userId: string,
	pathSlug: string,
	completedCount: number,
	totalCount: number,
) {
	if (completedCount >= totalCount) {
		await tryAward(userId, `path-${pathSlug}`, "path_completion", {
			pathSlug,
		});
	}
}

/**
 * Check and award badges after a challenge submission.
 */
export async function checkAndAwardChallengeBadges(
	userId: string,
	score: number,
	completedCount: number,
) {
	// First challenge submission
	await tryAward(userId, "first-challenge", "challenge_achievement");

	// High score
	if (score >= 90) {
		await tryAward(userId, "challenge-score-90", "challenge_achievement", {
			score,
		});
	}

	// 5 challenges completed (score >= 70)
	if (completedCount >= 5) {
		await tryAward(userId, "five-challenges", "challenge_achievement", {
			completedCount,
		});
	}
}

/**
 * Check and award milestone badges based on user stats.
 */
export async function checkAndAwardMilestoneBadges(
	userId: string,
	stats: { promptCount: number; analysisCount: number },
) {
	if (stats.promptCount >= 10) {
		await tryAward(userId, "ten-prompts", "milestone", {
			count: stats.promptCount,
		});
	}
	if (stats.promptCount >= 50) {
		await tryAward(userId, "fifty-prompts", "milestone", {
			count: stats.promptCount,
		});
	}
}
