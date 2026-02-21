import { and, asc, desc, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	contextBlocks,
	contextBlockVersions,
	type NewContextBlock,
	type NewContextBlockVersion,
} from "@/lib/db/schema";

export async function getBlocksByBlueprintId(blueprintId: string) {
	return db
		.select()
		.from(contextBlocks)
		.where(eq(contextBlocks.blueprintId, blueprintId))
		.orderBy(asc(contextBlocks.position));
}

export async function createBlock(
	blueprintId: string,
	data: Omit<NewContextBlock, "blueprintId">,
) {
	const result = await db
		.insert(contextBlocks)
		.values({ ...data, blueprintId })
		.returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

type BlockUpdateKeys =
	| "type"
	| "slug"
	| "name"
	| "description"
	| "content"
	| "parameters"
	| "config"
	| "position"
	| "isRequired"
	| "isConditional"
	| "condition";
type BlockUpdateData = {
	[K in BlockUpdateKeys]?: NewContextBlock[K] | undefined;
};

export async function updateBlock(id: string, data: BlockUpdateData) {
	const result = await db
		.update(contextBlocks)
		.set(data)
		.where(eq(contextBlocks.id, id))
		.returning();
	return result[0] ?? null;
}

export async function deleteBlock(id: string) {
	const result = await db
		.delete(contextBlocks)
		.where(eq(contextBlocks.id, id))
		.returning();
	return result[0] ?? null;
}

export async function reorderBlocks(
	_blueprintId: string,
	orderedIds: string[],
) {
	const updates = orderedIds.map((id, index) =>
		db
			.update(contextBlocks)
			.set({ position: index })
			.where(eq(contextBlocks.id, id)),
	);
	await Promise.all(updates);
}

export async function createBlockVersion(
	blockId: string,
	data: Pick<NewContextBlockVersion, "content" | "config" | "changeNote">,
) {
	const maxResult = await db
		.select({ maxVersion: max(contextBlockVersions.version) })
		.from(contextBlockVersions)
		.where(eq(contextBlockVersions.blockId, blockId));

	const nextVersion = (maxResult[0]?.maxVersion ?? 0) + 1;

	const result = await db
		.insert(contextBlockVersions)
		.values({
			blockId,
			version: nextVersion,
			content: data.content,
			config: data.config,
			changeNote: data.changeNote,
			status: "draft" as const,
		})
		.returning();

	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function getBlockVersions(blockId: string) {
	return db
		.select()
		.from(contextBlockVersions)
		.where(eq(contextBlockVersions.blockId, blockId))
		.orderBy(desc(contextBlockVersions.createdAt));
}

export async function getBlockVersionById(versionId: string) {
	const result = await db
		.select()
		.from(contextBlockVersions)
		.where(eq(contextBlockVersions.id, versionId))
		.limit(1);
	return result[0] ?? null;
}

export async function promoteBlockVersion(
	versionId: string,
	blockId: string,
	newStatus: "active" | "stable" | "deprecated",
) {
	return db.transaction(async (tx) => {
		// Demote the current holder of this status to "draft"
		await tx
			.update(contextBlockVersions)
			.set({ status: "draft" })
			.where(
				and(
					eq(contextBlockVersions.blockId, blockId),
					eq(contextBlockVersions.status, newStatus),
				),
			);

		// Promote the target version
		const result = await tx
			.update(contextBlockVersions)
			.set({ status: newStatus })
			.where(eq(contextBlockVersions.id, versionId))
			.returning();
		return result[0] ?? null;
	});
}

export async function restoreBlockVersion(
	blockId: string,
	sourceVersionId: string,
) {
	const source = await getBlockVersionById(sourceVersionId);
	if (!source) return null;

	return createBlockVersion(blockId, {
		content: source.content,
		config: source.config,
		changeNote: `Restored from v${source.version}`,
	});
}
