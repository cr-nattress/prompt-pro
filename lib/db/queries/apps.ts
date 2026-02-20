import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { apps, type NewApp } from "@/lib/db/schema";

export async function getAppsByWorkspaceId(workspaceId: string) {
	return db.select().from(apps).where(eq(apps.workspaceId, workspaceId));
}

export async function getAppBySlug(workspaceId: string, slug: string) {
	const result = await db
		.select()
		.from(apps)
		.where(and(eq(apps.workspaceId, workspaceId), eq(apps.slug, slug)))
		.limit(1);
	return result[0] ?? null;
}

export async function createApp(data: NewApp) {
	const result = await db.insert(apps).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function updateApp(
	id: string,
	data: Partial<
		Pick<
			NewApp,
			"slug" | "name" | "description" | "defaultLlm" | "defaultParams"
		>
	>,
) {
	const result = await db
		.update(apps)
		.set(data)
		.where(eq(apps.id, id))
		.returning();
	return result[0] ?? null;
}

export async function deleteApp(id: string) {
	const result = await db.delete(apps).where(eq(apps.id, id)).returning();
	return result[0] ?? null;
}
