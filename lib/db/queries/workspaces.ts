import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { type NewWorkspace, workspaces } from "@/lib/db/schema";

export async function getWorkspaceBySlug(slug: string) {
	const result = await db
		.select()
		.from(workspaces)
		.where(eq(workspaces.slug, slug))
		.limit(1);
	return result[0] ?? null;
}

export async function getWorkspacesByUserId(userId: string) {
	return db.select().from(workspaces).where(eq(workspaces.ownerId, userId));
}

export async function createWorkspace(data: NewWorkspace) {
	const result = await db.insert(workspaces).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function updateWorkspace(
	id: string,
	data: Partial<Pick<NewWorkspace, "slug" | "name" | "plan">>,
) {
	const result = await db
		.update(workspaces)
		.set(data)
		.where(eq(workspaces.id, id))
		.returning();
	return result[0] ?? null;
}
