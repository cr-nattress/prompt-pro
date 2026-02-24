import { and, count, desc, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { challengeSubmissions } from "@/lib/db/schema";

export async function createChallengeSubmission(data: {
	userId: string;
	challengeSlug: string;
	promptText: string;
	score: number;
	strengths: string[];
	gaps: string[];
	feedback: string;
}) {
	const result = await db.insert(challengeSubmissions).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function getUserChallengeSubmissions(
	userId: string,
	challengeSlug: string,
) {
	return db
		.select()
		.from(challengeSubmissions)
		.where(
			and(
				eq(challengeSubmissions.userId, userId),
				eq(challengeSubmissions.challengeSlug, challengeSlug),
			),
		)
		.orderBy(desc(challengeSubmissions.submittedAt));
}

export async function getUserBestScore(userId: string, challengeSlug: string) {
	const result = await db
		.select({ bestScore: max(challengeSubmissions.score) })
		.from(challengeSubmissions)
		.where(
			and(
				eq(challengeSubmissions.userId, userId),
				eq(challengeSubmissions.challengeSlug, challengeSlug),
			),
		);
	return result[0]?.bestScore ?? null;
}

export async function getUserCompletedChallenges(userId: string) {
	const result = await db
		.select({
			challengeSlug: challengeSubmissions.challengeSlug,
			bestScore: max(challengeSubmissions.score),
			attempts: count(),
		})
		.from(challengeSubmissions)
		.where(eq(challengeSubmissions.userId, userId))
		.groupBy(challengeSubmissions.challengeSlug);
	return result;
}
