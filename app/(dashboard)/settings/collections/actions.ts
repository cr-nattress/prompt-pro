"use server";

import { z } from "zod/v4";
import { requireRole } from "@/lib/auth";
import {
	bulkMoveToCollection,
	createCollection,
	deleteCollection,
	getCollectionCount,
	getCollections,
	movePromptToCollection,
	updateCollection,
} from "@/lib/db/queries/collections";
import type { Collection } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

const COLLECTION_LIMITS: Record<string, number> = {
	free: 3,
	pro: 999,
	team: 999,
};

const createCollectionSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	parentId: z.string().uuid().optional(),
});

export async function createCollectionAction(
	input: z.infer<typeof createCollectionSchema>,
): Promise<ActionResult<Collection>> {
	try {
		const { workspace } = await requireRole("editor");
		const parsed = createCollectionSchema.safeParse(input);
		if (!parsed.success) {
			return { success: false, error: "Invalid input." };
		}

		// Check plan limit
		const currentCount = await getCollectionCount(workspace.id);
		const limit = COLLECTION_LIMITS[workspace.plan] ?? 3;
		if (currentCount >= limit) {
			return {
				success: false,
				error: `Collection limit reached (${currentCount}/${limit}). Upgrade your plan.`,
			};
		}

		const collection = await createCollection({
			workspaceId: workspace.id,
			name: parsed.data.name,
			description: parsed.data.description,
			parentId: parsed.data.parentId,
		});

		return { success: true, data: collection };
	} catch {
		return { success: false, error: "Failed to create collection." };
	}
}

export async function updateCollectionAction(
	id: string,
	data: { name?: string | undefined; description?: string | null | undefined },
): Promise<ActionResult<Collection>> {
	try {
		await requireRole("editor");
		const result = await updateCollection(id, data);
		if (!result) {
			return { success: false, error: "Collection not found." };
		}
		return { success: true, data: result };
	} catch {
		return { success: false, error: "Failed to update collection." };
	}
}

export async function deleteCollectionAction(
	id: string,
): Promise<ActionResult<null>> {
	try {
		await requireRole("editor");
		const result = await deleteCollection(id);
		if (!result) {
			return { success: false, error: "Collection not found." };
		}
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to delete collection." };
	}
}

export async function getCollectionsAction() {
	const { workspace } = await requireRole("viewer");
	return getCollections(workspace.id);
}

export async function moveToCollectionAction(
	promptId: string,
	collectionId: string | null,
): Promise<ActionResult<null>> {
	try {
		await requireRole("editor");
		await movePromptToCollection(promptId, collectionId);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to move prompt." };
	}
}

export async function bulkMoveToCollectionAction(
	promptIds: string[],
	collectionId: string | null,
): Promise<ActionResult<null>> {
	try {
		await requireRole("editor");
		await bulkMoveToCollection(promptIds, collectionId);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to move prompts." };
	}
}
