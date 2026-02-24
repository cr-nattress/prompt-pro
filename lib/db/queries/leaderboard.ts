import { and, count, desc, eq, gte, max, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { challengeSubmissions, users } from "@/lib/db/schema";

export interface LeaderboardEntry {
	rank: number;
	userId: string;
	displayName: string;
	score: number;
	isCurrentUser: boolean;
}

/**
 * Get leaderboard for a specific challenge, ranked by best score.
 */
export async function getChallengeLeaderboard(
	slug: string,
	currentUserId: string,
	limit = 20,
): Promise<LeaderboardEntry[]> {
	const rows = await db
		.select({
			userId: challengeSubmissions.userId,
			userName: users.name,
			leaderboardOptIn: users.leaderboardOptIn,
			bestScore: max(challengeSubmissions.score).as("best_score"),
		})
		.from(challengeSubmissions)
		.innerJoin(users, eq(challengeSubmissions.userId, users.id))
		.where(eq(challengeSubmissions.challengeSlug, slug))
		.groupBy(challengeSubmissions.userId, users.name, users.leaderboardOptIn)
		.orderBy(desc(max(challengeSubmissions.score)))
		.limit(limit);

	return rows.map((r, i) => ({
		rank: i + 1,
		userId: r.userId,
		displayName:
			r.leaderboardOptIn || r.userId === currentUserId
				? r.userName
				: "Anonymous",
		score: r.bestScore ?? 0,
		isCurrentUser: r.userId === currentUserId,
	}));
}

/**
 * Get overall leaderboard across all challenges.
 * Counts total XP (sum of best scores where score >= 70) and distinct completed challenges.
 */
export async function getOverallLeaderboard(
	currentUserId: string,
	limit = 20,
): Promise<(LeaderboardEntry & { completedChallenges: number })[]> {
	// Subquery: best score per user per challenge
	const bestScores = db
		.select({
			userId: challengeSubmissions.userId,
			challengeSlug: challengeSubmissions.challengeSlug,
			bestScore: max(challengeSubmissions.score).as("best_score"),
		})
		.from(challengeSubmissions)
		.groupBy(challengeSubmissions.userId, challengeSubmissions.challengeSlug)
		.as("best_scores");

	const rows = await db
		.select({
			userId: bestScores.userId,
			userName: users.name,
			leaderboardOptIn: users.leaderboardOptIn,
			totalXp:
				sql<number>`coalesce(sum(case when ${bestScores.bestScore} >= 70 then ${bestScores.bestScore} else 0 end), 0)`.as(
					"total_xp",
				),
			completedChallenges:
				sql<number>`count(case when ${bestScores.bestScore} >= 70 then 1 end)`.as(
					"completed_challenges",
				),
		})
		.from(bestScores)
		.innerJoin(users, eq(bestScores.userId, users.id))
		.groupBy(bestScores.userId, users.name, users.leaderboardOptIn)
		.orderBy(
			desc(
				sql`sum(case when ${bestScores.bestScore} >= 70 then ${bestScores.bestScore} else 0 end)`,
			),
		)
		.limit(limit);

	return rows.map((r, i) => ({
		rank: i + 1,
		userId: r.userId,
		displayName:
			r.leaderboardOptIn || r.userId === currentUserId
				? r.userName
				: "Anonymous",
		score: Number(r.totalXp),
		completedChallenges: Number(r.completedChallenges),
		isCurrentUser: r.userId === currentUserId,
	}));
}

/**
 * Get a user's rank for a specific challenge (or overall).
 */
export async function getUserRank(
	userId: string,
	challengeSlug?: string | undefined,
): Promise<{ rank: number; total: number } | null> {
	if (challengeSlug) {
		const allScores = await db
			.select({
				userId: challengeSubmissions.userId,
				bestScore: max(challengeSubmissions.score).as("best_score"),
			})
			.from(challengeSubmissions)
			.where(eq(challengeSubmissions.challengeSlug, challengeSlug))
			.groupBy(challengeSubmissions.userId)
			.orderBy(desc(max(challengeSubmissions.score)));

		const userIndex = allScores.findIndex((r) => r.userId === userId);
		if (userIndex === -1) return null;

		return { rank: userIndex + 1, total: allScores.length };
	}

	// Overall rank by total XP
	const allXp = await db
		.select({
			userId: challengeSubmissions.userId,
			totalXp: sql<number>`coalesce(sum(${challengeSubmissions.score}), 0)`.as(
				"total_xp",
			),
		})
		.from(challengeSubmissions)
		.where(gte(challengeSubmissions.score, 70))
		.groupBy(challengeSubmissions.userId)
		.orderBy(desc(sql`sum(${challengeSubmissions.score})`));

	const userIndex = allXp.findIndex((r) => r.userId === userId);
	if (userIndex === -1) return null;

	return { rank: userIndex + 1, total: allXp.length };
}
