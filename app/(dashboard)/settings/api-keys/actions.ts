"use server";

import { generateApiKey, hashApiKey } from "@/lib/api/key-utils";
import { requireAuth } from "@/lib/auth";
import {
	countApiKeysByWorkspace,
	createApiKey,
	deleteApiKey,
	getApiKeysByWorkspace,
} from "@/lib/db/queries/api-keys";
import type { ActionResult } from "@/types";

const PLAN_KEY_LIMITS = { free: 2, pro: 10, team: Infinity } as const;

export async function createApiKeyAction(data: {
	label: string;
	scopes: string[];
	appId?: string;
	expiresAt?: string;
}): Promise<ActionResult<{ id: string; label: string; token: string }>> {
	try {
		const { workspace } = await requireAuth();

		const currentCount = await countApiKeysByWorkspace(workspace.id);
		const limit =
			PLAN_KEY_LIMITS[workspace.plan as keyof typeof PLAN_KEY_LIMITS] ?? 2;
		if (currentCount >= limit) {
			return {
				success: false,
				error: `Your ${workspace.plan} plan allows a maximum of ${limit} API keys`,
			};
		}

		const token = generateApiKey("live");
		const keyHash = await hashApiKey(token);

		const row = await createApiKey({
			workspaceId: workspace.id,
			keyHash,
			label: data.label,
			scopes: data.scopes,
			appId: data.appId ?? null,
			expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
		});

		return {
			success: true,
			data: { id: row.id, label: row.label ?? "", token },
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create API key";
		return { success: false, error: message };
	}
}

export async function deleteApiKeyAction(
	id: string,
): Promise<ActionResult<{ id: string }>> {
	try {
		const { workspace } = await requireAuth();
		const deleted = await deleteApiKey(id, workspace.id);
		if (!deleted) return { success: false, error: "API key not found" };
		return { success: true, data: { id: deleted.id } };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to delete API key";
		return { success: false, error: message };
	}
}

export async function getApiKeysAction() {
	const { workspace } = await requireAuth();
	return getApiKeysByWorkspace(workspace.id);
}
