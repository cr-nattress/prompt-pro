import { and, desc, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	blueprintVersions,
	contextBlocks,
	contextBlockVersions,
	type NewBlueprintVersion,
} from "@/lib/db/schema";

export async function getBlueprintVersions(blueprintId: string) {
	return db
		.select()
		.from(blueprintVersions)
		.where(eq(blueprintVersions.blueprintId, blueprintId))
		.orderBy(desc(blueprintVersions.createdAt));
}

export async function getBlueprintVersionById(versionId: string) {
	const result = await db
		.select()
		.from(blueprintVersions)
		.where(eq(blueprintVersions.id, versionId))
		.limit(1);
	return result[0] ?? null;
}

export async function createBlueprintVersion(
	blueprintId: string,
	data: Pick<NewBlueprintVersion, "changeNote">,
) {
	const maxResult = await db
		.select({ maxVersion: max(blueprintVersions.version) })
		.from(blueprintVersions)
		.where(eq(blueprintVersions.blueprintId, blueprintId));

	const nextVersion = (maxResult[0]?.maxVersion ?? 0) + 1;

	// Snapshot current block version IDs
	const blocks = await db
		.select({ id: contextBlocks.id })
		.from(contextBlocks)
		.where(eq(contextBlocks.blueprintId, blueprintId));

	const blockSnapshots: Record<string, number> = {};
	for (const block of blocks) {
		const latestVersion = await db
			.select({ version: contextBlockVersions.version })
			.from(contextBlockVersions)
			.where(eq(contextBlockVersions.blockId, block.id))
			.orderBy(desc(contextBlockVersions.version))
			.limit(1);
		blockSnapshots[block.id] = latestVersion[0]?.version ?? 0;
	}

	const result = await db
		.insert(blueprintVersions)
		.values({
			blueprintId,
			version: nextVersion,
			blockVersionSnapshot: blockSnapshots,
			changeNote: data.changeNote,
			status: "draft" as const,
		})
		.returning();

	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function getBlueprintVersionByStatus(
	blueprintId: string,
	status: "active" | "stable" | "deprecated",
) {
	const result = await db
		.select()
		.from(blueprintVersions)
		.where(
			and(
				eq(blueprintVersions.blueprintId, blueprintId),
				eq(blueprintVersions.status, status),
			),
		)
		.limit(1);
	return result[0] ?? null;
}

export async function getBlueprintVersionByNumber(
	blueprintId: string,
	version: number,
) {
	const result = await db
		.select()
		.from(blueprintVersions)
		.where(
			and(
				eq(blueprintVersions.blueprintId, blueprintId),
				eq(blueprintVersions.version, version),
			),
		)
		.limit(1);
	return result[0] ?? null;
}

export async function promoteBlueprintVersion(
	versionId: string,
	blueprintId: string,
	newStatus: "active" | "stable" | "deprecated",
) {
	return db.transaction(async (tx) => {
		// Demote the current holder of this status to "draft"
		await tx
			.update(blueprintVersions)
			.set({ status: "draft" })
			.where(
				and(
					eq(blueprintVersions.blueprintId, blueprintId),
					eq(blueprintVersions.status, newStatus),
				),
			);

		// Promote the target version
		const result = await tx
			.update(blueprintVersions)
			.set({ status: newStatus })
			.where(eq(blueprintVersions.id, versionId))
			.returning();
		return result[0] ?? null;
	});
}
