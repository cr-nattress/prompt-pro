import { and, count, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	collections,
	type NewCollection,
	promptTemplates,
} from "@/lib/db/schema";

export async function getCollections(workspaceId: string) {
	return db
		.select()
		.from(collections)
		.where(eq(collections.workspaceId, workspaceId));
}

export async function getRootCollections(workspaceId: string) {
	return db
		.select()
		.from(collections)
		.where(
			and(
				eq(collections.workspaceId, workspaceId),
				isNull(collections.parentId),
			),
		);
}

export async function getChildCollections(parentId: string) {
	return db
		.select()
		.from(collections)
		.where(eq(collections.parentId, parentId));
}

export async function getCollectionById(id: string) {
	const result = await db
		.select()
		.from(collections)
		.where(eq(collections.id, id))
		.limit(1);
	return result[0] ?? null;
}

export async function createCollection(data: NewCollection) {
	const result = await db.insert(collections).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function updateCollection(
	id: string,
	data: { name?: string | undefined; description?: string | null | undefined },
) {
	const result = await db
		.update(collections)
		.set(data)
		.where(eq(collections.id, id))
		.returning();
	return result[0] ?? null;
}

export async function deleteCollection(id: string) {
	const result = await db
		.delete(collections)
		.where(eq(collections.id, id))
		.returning();
	return result[0] ?? null;
}

export async function getCollectionCount(workspaceId: string) {
	const result = await db
		.select({ total: count() })
		.from(collections)
		.where(eq(collections.workspaceId, workspaceId));
	return result[0]?.total ?? 0;
}

export async function movePromptToCollection(
	promptId: string,
	collectionId: string | null,
) {
	const result = await db
		.update(promptTemplates)
		.set({ collectionId })
		.where(eq(promptTemplates.id, promptId))
		.returning();
	return result[0] ?? null;
}

export async function bulkMoveToCollection(
	promptIds: string[],
	collectionId: string | null,
) {
	if (promptIds.length === 0) return [];
	const results = [];
	for (const id of promptIds) {
		const result = await movePromptToCollection(id, collectionId);
		if (result) results.push(result);
	}
	return results;
}
