import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { type NewUser, users } from "@/lib/db/schema";

export async function getUserByClerkId(clerkId: string) {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.clerkId, clerkId))
		.limit(1);
	return result[0] ?? null;
}

export async function createUser(data: NewUser) {
	const result = await db.insert(users).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function updateUser(
	clerkId: string,
	data: Partial<
		Pick<
			NewUser,
			"email" | "name" | "firstName" | "lastName" | "imageUrl" | "plan"
		>
	>,
) {
	const result = await db
		.update(users)
		.set(data)
		.where(eq(users.clerkId, clerkId))
		.returning();
	return result[0] ?? null;
}

export async function deleteUser(clerkId: string) {
	const result = await db
		.delete(users)
		.where(eq(users.clerkId, clerkId))
		.returning();
	return result[0] ?? null;
}

export async function getUserByEmail(email: string) {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);
	return result[0] ?? null;
}

export async function getUserById(id: string) {
	const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
	return result[0] ?? null;
}

export async function markOnboardingComplete(userId: string) {
	const result = await db
		.update(users)
		.set({ onboardingComplete: true })
		.where(eq(users.id, userId))
		.returning();
	return result[0] ?? null;
}

export async function dismissLesson(userId: string, lessonId: string) {
	const result = await db
		.update(users)
		.set({
			dismissedLessons: sql`array_append(${users.dismissedLessons}, ${lessonId})`,
		})
		.where(eq(users.id, userId))
		.returning();
	return result[0] ?? null;
}

export async function updateLeaderboardOptIn(userId: string, optIn: boolean) {
	const result = await db
		.update(users)
		.set({ leaderboardOptIn: optIn })
		.where(eq(users.id, userId))
		.returning();
	return result[0] ?? null;
}

export async function getDismissedLessons(userId: string): Promise<string[]> {
	const result = await db
		.select({ dismissedLessons: users.dismissedLessons })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);
	return result[0]?.dismissedLessons ?? [];
}
