"use server";

import { requireAuth } from "@/lib/auth";
import { updateLeaderboardOptIn, updateUser } from "@/lib/db/queries/users";
import { updateWorkspace } from "@/lib/db/queries/workspaces";
import { slugify } from "@/lib/prompt-utils";
import type { ActionResult } from "@/types";

export async function updateProfileAction(
	name: string,
): Promise<ActionResult<{ name: string }>> {
	try {
		const { user } = await requireAuth();
		const updated = await updateUser(user.clerkId, { name });
		if (!updated) {
			return { success: false, error: "Failed to update profile" };
		}
		return { success: true, data: { name: updated.name } };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update profile";
		return { success: false, error: message };
	}
}

export async function updateWorkspaceSettingsAction(
	name: string,
): Promise<ActionResult<{ name: string; slug: string }>> {
	try {
		const { workspace } = await requireAuth();
		const slug = slugify(name) || workspace.slug;
		const updated = await updateWorkspace(workspace.id, { name, slug });
		if (!updated) {
			return { success: false, error: "Failed to update workspace" };
		}
		return { success: true, data: { name: updated.name, slug: updated.slug } };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update workspace";
		return { success: false, error: message };
	}
}

export async function updateLeaderboardOptInAction(
	optIn: boolean,
): Promise<ActionResult<{ leaderboardOptIn: boolean }>> {
	try {
		const { user } = await requireAuth();
		const updated = await updateLeaderboardOptIn(user.id, optIn);
		if (!updated) {
			return { success: false, error: "Failed to update preference" };
		}
		return {
			success: true,
			data: { leaderboardOptIn: updated.leaderboardOptIn },
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update preference";
		return { success: false, error: message };
	}
}

export async function deleteWorkspaceAction(
	confirmName: string,
): Promise<ActionResult<{ deleted: boolean }>> {
	try {
		const { workspace } = await requireAuth();
		if (confirmName !== workspace.name) {
			return {
				success: false,
				error: "Workspace name does not match. Deletion cancelled.",
			};
		}
		// For now, we don't actually delete — this requires cascade logic
		// across apps, prompts, blueprints, versions, API keys, analyses, etc.
		// Mark as a placeholder that returns an error for safety.
		return {
			success: false,
			error:
				"Workspace deletion is not yet available. Contact support for account removal.",
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to delete workspace";
		return { success: false, error: message };
	}
}
