import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learningProgress } from "@/lib/db/schema";

/**
 * Get all completed lessons for a user, optionally filtered by path.
 */
export async function getCompletedLessons(userId: string, pathSlug?: string) {
	const conditions = [eq(learningProgress.userId, userId)];
	if (pathSlug) {
		conditions.push(eq(learningProgress.pathSlug, pathSlug));
	}

	return db
		.select({
			pathSlug: learningProgress.pathSlug,
			lessonSlug: learningProgress.lessonSlug,
			completedAt: learningProgress.completedAt,
		})
		.from(learningProgress)
		.where(and(...conditions));
}

/**
 * Mark a lesson as completed for a user.
 * Uses ON CONFLICT to handle re-completions gracefully.
 */
export async function completeLesson(
	userId: string,
	pathSlug: string,
	lessonSlug: string,
) {
	const result = await db
		.insert(learningProgress)
		.values({ userId, pathSlug, lessonSlug })
		.onConflictDoNothing()
		.returning();

	return result[0] ?? null;
}

/**
 * Check if a specific lesson is completed.
 */
export async function isLessonCompleted(
	userId: string,
	pathSlug: string,
	lessonSlug: string,
): Promise<boolean> {
	const result = await db
		.select({ id: learningProgress.id })
		.from(learningProgress)
		.where(
			and(
				eq(learningProgress.userId, userId),
				eq(learningProgress.pathSlug, pathSlug),
				eq(learningProgress.lessonSlug, lessonSlug),
			),
		)
		.limit(1);

	return result.length > 0;
}

/**
 * Get progress summary for all paths for a user.
 * Returns a map of pathSlug → completed lesson count.
 */
export async function getPathProgressSummary(
	userId: string,
): Promise<Map<string, number>> {
	const rows = await db
		.select({
			pathSlug: learningProgress.pathSlug,
			lessonSlug: learningProgress.lessonSlug,
		})
		.from(learningProgress)
		.where(eq(learningProgress.userId, userId));

	const summary = new Map<string, number>();
	for (const row of rows) {
		summary.set(row.pathSlug, (summary.get(row.pathSlug) ?? 0) + 1);
	}
	return summary;
}
