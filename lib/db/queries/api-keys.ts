import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { apiKeys, type NewApiKey, workspaces } from "@/lib/db/schema";

export async function getApiKeysByWorkspace(workspaceId: string) {
	return db
		.select({
			id: apiKeys.id,
			workspaceId: apiKeys.workspaceId,
			label: apiKeys.label,
			scopes: apiKeys.scopes,
			appId: apiKeys.appId,
			expiresAt: apiKeys.expiresAt,
			lastUsedAt: apiKeys.lastUsedAt,
			createdAt: apiKeys.createdAt,
		})
		.from(apiKeys)
		.where(eq(apiKeys.workspaceId, workspaceId))
		.orderBy(apiKeys.createdAt);
}

export async function getApiKeyByHash(keyHash: string) {
	const result = await db
		.select({
			id: apiKeys.id,
			workspaceId: apiKeys.workspaceId,
			keyHash: apiKeys.keyHash,
			label: apiKeys.label,
			scopes: apiKeys.scopes,
			appId: apiKeys.appId,
			expiresAt: apiKeys.expiresAt,
			lastUsedAt: apiKeys.lastUsedAt,
			createdAt: apiKeys.createdAt,
			workspacePlan: workspaces.plan,
		})
		.from(apiKeys)
		.innerJoin(workspaces, eq(apiKeys.workspaceId, workspaces.id))
		.where(eq(apiKeys.keyHash, keyHash))
		.limit(1);

	return result[0] ?? null;
}

export async function createApiKey(data: NewApiKey) {
	const result = await db.insert(apiKeys).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function deleteApiKey(id: string, workspaceId: string) {
	const result = await db.delete(apiKeys).where(eq(apiKeys.id, id)).returning();

	const row = result[0] ?? null;
	if (row && row.workspaceId !== workspaceId) return null;
	return row;
}

export async function touchApiKeyLastUsed(id: string): Promise<void> {
	await db
		.update(apiKeys)
		.set({ lastUsedAt: new Date() })
		.where(eq(apiKeys.id, id));
}

export async function countApiKeysByWorkspace(
	workspaceId: string,
): Promise<number> {
	const result = await db
		.select({ total: count() })
		.from(apiKeys)
		.where(eq(apiKeys.workspaceId, workspaceId));
	return result[0]?.total ?? 0;
}
