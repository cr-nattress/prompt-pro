"use server";

import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	createBlock,
	deleteBlock,
	getBlocksByBlueprintId,
	reorderBlocks,
	updateBlock,
} from "@/lib/db/queries/blocks";
import {
	createBlueprint,
	deleteBlueprint,
	duplicateBlueprint,
	getBlueprintBySlugInWorkspace,
	updateBlueprint,
} from "@/lib/db/queries/blueprints";
import {
	type ContextBlock,
	type ContextBlueprint,
	contextBlueprints,
} from "@/lib/db/schema";
import { slugify } from "@/lib/prompt-utils";
import {
	blockFormSchema,
	blueprintFormSchema,
} from "@/lib/validations/blueprint";
import type { ActionResult, BlueprintWithBlocks } from "@/types";

export async function createBlueprintAction(
	input: unknown,
): Promise<ActionResult<BlueprintWithBlocks>> {
	try {
		const { workspace } = await requireAuth();
		const parsed = blueprintFormSchema.safeParse(input);
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Validation failed",
			};
		}

		const { name, slug, appId, targetLlm, totalTokenBudget, description } =
			parsed.data;

		const blueprint = await createBlueprint({
			name,
			slug,
			appId,
			workspaceId: workspace.id,
			targetLlm,
			totalTokenBudget,
			description,
		});

		return { success: true, data: { ...blueprint, blocks: [] } };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create blueprint";
		return { success: false, error: message };
	}
}

export async function updateBlueprintAction(
	id: string,
	data: {
		name?: string | undefined;
		slug?: string | undefined;
		targetLlm?: string | undefined;
		totalTokenBudget?: number | undefined;
		description?: string | undefined;
	},
): Promise<ActionResult<ContextBlueprint>> {
	try {
		await requireAuth();

		const updated = await updateBlueprint(id, data);
		if (!updated) {
			return { success: false, error: "Blueprint not found" };
		}

		return { success: true, data: updated };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update blueprint";
		return { success: false, error: message };
	}
}

export async function deleteBlueprintAction(
	id: string,
): Promise<ActionResult<ContextBlueprint>> {
	try {
		await requireAuth();

		const deleted = await deleteBlueprint(id);
		if (!deleted) {
			return { success: false, error: "Blueprint not found" };
		}

		return { success: true, data: deleted };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to delete blueprint";
		return { success: false, error: message };
	}
}

export async function duplicateBlueprintAction(
	id: string,
): Promise<ActionResult<BlueprintWithBlocks>> {
	try {
		const { workspace } = await requireAuth();

		const origRows = await db
			.select()
			.from(contextBlueprints)
			.where(eq(contextBlueprints.id, id))
			.limit(1);

		const orig = origRows[0];
		if (!orig) {
			return { success: false, error: "Blueprint not found" };
		}

		const baseName = `${orig.name} (copy)`;
		const baseSlug = slugify(baseName);

		let slug = baseSlug;
		let attempt = 0;
		let existing = await getBlueprintBySlugInWorkspace(workspace.id, slug);
		while (existing) {
			attempt++;
			slug = `${baseSlug}-${attempt}`;
			existing = await getBlueprintBySlugInWorkspace(workspace.id, slug);
		}

		const result = await duplicateBlueprint(id, baseName, slug, workspace.id);
		if (!result) {
			return { success: false, error: "Failed to duplicate blueprint" };
		}

		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to duplicate blueprint";
		return { success: false, error: message };
	}
}

export async function createBlockAction(
	blueprintId: string,
	input: unknown,
): Promise<ActionResult<ContextBlock>> {
	try {
		await requireAuth();
		const parsed = blockFormSchema.safeParse(input);
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Validation failed",
			};
		}

		const {
			name,
			slug,
			type,
			description,
			content,
			isRequired,
			isConditional,
			condition,
		} = parsed.data;

		// Get the next position
		const existingBlocks = await getBlocksByBlueprintId(blueprintId);
		const nextPosition = existingBlocks.length;

		const block = await createBlock(blueprintId, {
			name,
			slug,
			type,
			description,
			content,
			isRequired: isRequired ?? true,
			isConditional: isConditional ?? false,
			condition,
			position: nextPosition,
		});

		return { success: true, data: block };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create block";
		return { success: false, error: message };
	}
}

export async function updateBlockAction(
	blockId: string,
	data: {
		name?: string | undefined;
		slug?: string | undefined;
		type?:
			| "system"
			| "knowledge"
			| "examples"
			| "tools"
			| "history"
			| "task"
			| undefined;
		description?: string | undefined;
		content?: string | undefined;
		isRequired?: boolean | undefined;
		isConditional?: boolean | undefined;
		condition?: string | undefined;
	},
): Promise<ActionResult<ContextBlock>> {
	try {
		await requireAuth();

		const updated = await updateBlock(blockId, data);
		if (!updated) {
			return { success: false, error: "Block not found" };
		}

		return { success: true, data: updated };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update block";
		return { success: false, error: message };
	}
}

export async function deleteBlockAction(
	blockId: string,
): Promise<ActionResult<ContextBlock>> {
	try {
		await requireAuth();

		const deleted = await deleteBlock(blockId);
		if (!deleted) {
			return { success: false, error: "Block not found" };
		}

		return { success: true, data: deleted };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to delete block";
		return { success: false, error: message };
	}
}

export async function reorderBlocksAction(
	blueprintId: string,
	orderedIds: string[],
): Promise<ActionResult<null>> {
	try {
		await requireAuth();
		await reorderBlocks(blueprintId, orderedIds);
		return { success: true, data: null };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to reorder blocks";
		return { success: false, error: message };
	}
}
