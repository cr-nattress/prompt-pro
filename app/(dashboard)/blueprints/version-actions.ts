"use server";

import { requireAuth } from "@/lib/auth";
import {
	createBlockVersion,
	getBlockVersions,
	promoteBlockVersion,
	restoreBlockVersion,
} from "@/lib/db/queries/blocks";
import {
	createBlueprintVersion,
	getBlueprintVersions,
	promoteBlueprintVersion,
} from "@/lib/db/queries/blueprint-versions";
import type { BlueprintVersion, ContextBlockVersion } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

export async function createBlueprintVersionAction(
	blueprintId: string,
	data: { changeNote?: string },
): Promise<ActionResult<BlueprintVersion>> {
	try {
		await requireAuth();
		const result = await createBlueprintVersion(blueprintId, data);
		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to create blueprint version";
		return { success: false, error: message };
	}
}

export async function getBlueprintVersionsAction(
	blueprintId: string,
): Promise<ActionResult<BlueprintVersion[]>> {
	try {
		await requireAuth();
		const versions = await getBlueprintVersions(blueprintId);
		return { success: true, data: versions };
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch blueprint versions";
		return { success: false, error: message };
	}
}

export async function promoteBlueprintVersionAction(
	versionId: string,
	blueprintId: string,
	newStatus: "active" | "stable" | "deprecated",
): Promise<ActionResult<BlueprintVersion>> {
	try {
		await requireAuth();
		const result = await promoteBlueprintVersion(
			versionId,
			blueprintId,
			newStatus,
		);
		if (!result) {
			return { success: false, error: "Version not found" };
		}
		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to promote blueprint version";
		return { success: false, error: message };
	}
}

export async function createBlockVersionAction(
	blockId: string,
	data: { content?: string | null; config?: unknown; changeNote?: string },
): Promise<ActionResult<ContextBlockVersion>> {
	try {
		await requireAuth();
		const result = await createBlockVersion(blockId, data);
		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create block version";
		return { success: false, error: message };
	}
}

export async function getBlockVersionsAction(
	blockId: string,
): Promise<ActionResult<ContextBlockVersion[]>> {
	try {
		await requireAuth();
		const versions = await getBlockVersions(blockId);
		return { success: true, data: versions };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch block versions";
		return { success: false, error: message };
	}
}

export async function promoteBlockVersionAction(
	versionId: string,
	blockId: string,
	newStatus: "active" | "stable" | "deprecated",
): Promise<ActionResult<ContextBlockVersion>> {
	try {
		await requireAuth();
		const result = await promoteBlockVersion(versionId, blockId, newStatus);
		if (!result) {
			return { success: false, error: "Version not found" };
		}
		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to promote block version";
		return { success: false, error: message };
	}
}

export async function restoreBlockVersionAction(
	blockId: string,
	sourceVersionId: string,
): Promise<ActionResult<ContextBlockVersion>> {
	try {
		await requireAuth();
		const result = await restoreBlockVersion(blockId, sourceVersionId);
		if (!result) {
			return { success: false, error: "Source version not found" };
		}
		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to restore block version";
		return { success: false, error: message };
	}
}
