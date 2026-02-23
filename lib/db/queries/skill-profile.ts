import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyses, users, weeklyProgress } from "@/lib/db/schema";
import type { SkillProfile } from "@/lib/skills/skill-profile";

/**
 * Get recent analyses for a user's prompts (via workspace).
 * Used to compute the skill profile.
 */
export async function getRecentAnalysesForUser(
	workspaceId: string,
	limit = 20,
) {
	// Import the prompts table to join through
	const { promptTemplates } = await import("@/lib/db/schema");

	const result = await db
		.select({
			id: analyses.id,
			promptId: analyses.promptId,
			blueprintId: analyses.blueprintId,
			promptVersionId: analyses.promptVersionId,
			clarity: analyses.clarity,
			specificity: analyses.specificity,
			contextAdequacy: analyses.contextAdequacy,
			roleDefinition: analyses.roleDefinition,
			constraintQuality: analyses.constraintQuality,
			exampleUsage: analyses.exampleUsage,
			errorHandling: analyses.errorHandling,
			outputFormatting: analyses.outputFormatting,
			tokenEfficiency: analyses.tokenEfficiency,
			safetyAlignment: analyses.safetyAlignment,
			taskDecomposition: analyses.taskDecomposition,
			creativityScope: analyses.creativityScope,
			overallScore: analyses.overallScore,
			weaknesses: analyses.weaknesses,
			suggestions: analyses.suggestions,
			enhancedPromptText: analyses.enhancedPromptText,
			createdAt: analyses.createdAt,
		})
		.from(analyses)
		.innerJoin(promptTemplates, eq(analyses.promptId, promptTemplates.id))
		.where(
			and(
				eq(promptTemplates.workspaceId, workspaceId),
				isNotNull(analyses.overallScore),
			),
		)
		.orderBy(desc(analyses.createdAt))
		.limit(limit);

	return result;
}

/**
 * Update the user's skill profile JSONB column.
 */
export async function updateUserSkillProfile(
	userId: string,
	profile: SkillProfile,
) {
	const result = await db
		.update(users)
		.set({ skillProfile: profile })
		.where(eq(users.id, userId))
		.returning();
	return result[0] ?? null;
}

/**
 * Get a user's skill profile from the DB.
 */
export async function getUserSkillProfile(
	userId: string,
): Promise<SkillProfile | null> {
	const result = await db
		.select({ skillProfile: users.skillProfile })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);
	return (result[0]?.skillProfile as SkillProfile | null) ?? null;
}

/**
 * Get or create weekly progress for the current week.
 */
export async function getOrCreateWeeklyProgress(
	userId: string,
	weekStart: string,
	skillProfile: SkillProfile,
) {
	// Try to get existing
	const existing = await db
		.select()
		.from(weeklyProgress)
		.where(
			and(
				eq(weeklyProgress.userId, userId),
				eq(weeklyProgress.weekStart, weekStart),
			),
		)
		.limit(1);

	if (existing[0]) return existing[0];

	// Create new
	const result = await db
		.insert(weeklyProgress)
		.values({
			userId,
			weekStart,
			skillProfile,
			averageScore: skillProfile.averageScore,
		})
		.returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns
	return result[0]!;
}

/**
 * Increment a counter on the weekly progress record.
 */
export async function incrementWeeklyCounter(
	userId: string,
	weekStart: string,
	field: "promptsCreated" | "promptsEdited" | "analysesRun" | "promptsImproved",
) {
	await db
		.update(weeklyProgress)
		.set({
			[field]: sql`${weeklyProgress[field]} + 1`,
		})
		.where(
			and(
				eq(weeklyProgress.userId, userId),
				eq(weeklyProgress.weekStart, weekStart),
			),
		);
}

/**
 * Get recent weekly progress snapshots.
 */
export async function getWeeklyProgressHistory(userId: string, weeks = 8) {
	return db
		.select()
		.from(weeklyProgress)
		.where(eq(weeklyProgress.userId, userId))
		.orderBy(desc(weeklyProgress.weekStart))
		.limit(weeks);
}

/**
 * Get the current ISO week start date (Monday).
 */
export function getCurrentWeekStart(): string {
	const now = new Date();
	const day = now.getDay();
	const diff = now.getDate() - day + (day === 0 ? -6 : 1);
	const monday = new Date(now.setDate(diff));
	// biome-ignore lint/style/noNonNullAssertion: ISO date string always has T separator
	return monday.toISOString().split("T")[0]!;
}
