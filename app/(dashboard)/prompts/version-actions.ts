"use server";

import { requireAuth } from "@/lib/auth";
import {
	getPromptVersions,
	promotePromptVersion,
	restorePromptVersion,
} from "@/lib/db/queries/prompts";
import type { PromptVersion } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

export async function getPromptVersionsAction(
	promptTemplateId: string,
): Promise<ActionResult<PromptVersion[]>> {
	try {
		await requireAuth();
		const versions = await getPromptVersions(promptTemplateId);
		return { success: true, data: versions };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch versions";
		return { success: false, error: message };
	}
}

export async function promotePromptVersionAction(
	versionId: string,
	promptTemplateId: string,
	newStatus: "active" | "stable" | "deprecated",
): Promise<ActionResult<PromptVersion>> {
	try {
		await requireAuth();
		const result = await promotePromptVersion(
			versionId,
			promptTemplateId,
			newStatus,
		);
		if (!result) {
			return { success: false, error: "Version not found" };
		}
		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to promote version";
		return { success: false, error: message };
	}
}

export async function restorePromptVersionAction(
	promptTemplateId: string,
	sourceVersionId: string,
): Promise<ActionResult<PromptVersion>> {
	try {
		await requireAuth();
		const result = await restorePromptVersion(
			promptTemplateId,
			sourceVersionId,
		);
		if (!result) {
			return { success: false, error: "Source version not found" };
		}
		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to restore version";
		return { success: false, error: message };
	}
}
