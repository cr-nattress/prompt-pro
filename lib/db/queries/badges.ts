import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { badges, type NewBadge } from "@/lib/db/schema";

export async function awardBadge(data: Omit<NewBadge, "id" | "earnedAt">) {
	const result = await db
		.insert(badges)
		.values(data)
		.onConflictDoNothing({
			target: [badges.userId, badges.badgeSlug],
		})
		.returning();
	return result[0] ?? null;
}

export async function getUserBadges(userId: string) {
	return db
		.select()
		.from(badges)
		.where(eq(badges.userId, userId))
		.orderBy(badges.earnedAt);
}

export async function hasBadge(
	userId: string,
	badgeSlug: string,
): Promise<boolean> {
	const result = await db
		.select({ id: badges.id })
		.from(badges)
		.where(and(eq(badges.userId, userId), eq(badges.badgeSlug, badgeSlug)))
		.limit(1);
	return result.length > 0;
}
