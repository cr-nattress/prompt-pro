"use server";

import { requireAuth } from "@/lib/auth";
import {
	createPrompt,
	createPromptVersion,
	deletePrompt,
	getPromptById,
	getPromptBySlugInWorkspace,
	updatePrompt,
} from "@/lib/db/queries/prompts";
import { slugify } from "@/lib/prompt-utils";
import { promptFormSchema } from "@/lib/validations/prompt";
import type { ActionResult, PromptWithVersion } from "@/types";

export async function createPromptAction(
	input: unknown,
): Promise<ActionResult<PromptWithVersion>> {
	try {
		const { workspace } = await requireAuth();
		const parsed = promptFormSchema.safeParse(input);
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Validation failed",
			};
		}

		const {
			name,
			slug,
			appId,
			purpose,
			description,
			tags,
			templateText,
			llm,
			changeNote,
		} = parsed.data;

		const versionData: {
			templateText: string;
			llm?: string;
			changeNote?: string;
		} = {
			templateText,
			changeNote: changeNote ?? "Initial version",
		};
		if (llm) versionData.llm = llm;

		const result = await createPrompt(
			{
				name,
				slug,
				appId,
				workspaceId: workspace.id,
				purpose,
				description,
				tags,
			},
			versionData,
		);

		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create prompt";
		return { success: false, error: message };
	}
}

export async function updatePromptAction(
	id: string,
	data: {
		name?: string | undefined;
		slug?: string | undefined;
		purpose?: string | undefined;
		description?: string | undefined;
		tags?: string[] | undefined;
		parameterSchema?: unknown;
	},
): Promise<ActionResult<PromptWithVersion>> {
	try {
		await requireAuth();

		const updated = await updatePrompt(id, data);
		if (!updated) {
			return { success: false, error: "Prompt not found" };
		}

		const full = await getPromptById(id);
		if (!full) {
			return { success: false, error: "Prompt not found after update" };
		}

		return { success: true, data: full };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update prompt";
		return { success: false, error: message };
	}
}

export async function deletePromptAction(
	id: string,
): Promise<ActionResult<PromptWithVersion>> {
	try {
		await requireAuth();

		// Fetch full data before deleting (for undo support)
		const prompt = await getPromptById(id);
		if (!prompt) {
			return { success: false, error: "Prompt not found" };
		}

		await deletePrompt(id);
		return { success: true, data: prompt };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to delete prompt";
		return { success: false, error: message };
	}
}

export async function duplicatePromptAction(
	id: string,
): Promise<ActionResult<PromptWithVersion>> {
	try {
		const { workspace } = await requireAuth();

		const original = await getPromptById(id);
		if (!original) {
			return { success: false, error: "Prompt not found" };
		}

		const baseName = `${original.name} (copy)`;
		const baseSlug = slugify(baseName);

		// Ensure slug uniqueness by checking workspace
		let slug = baseSlug;
		let attempt = 0;
		let existing = await getPromptBySlugInWorkspace(workspace.id, slug);
		while (existing) {
			attempt++;
			slug = `${baseSlug}-${attempt}`;
			existing = await getPromptBySlugInWorkspace(workspace.id, slug);
		}

		const dupVersionData: {
			templateText: string;
			llm?: string;
			changeNote?: string;
		} = {
			templateText: original.latestVersion?.templateText ?? "",
			changeNote: `Duplicated from "${original.name}"`,
		};
		if (original.latestVersion?.llm)
			dupVersionData.llm = original.latestVersion.llm;

		const result = await createPrompt(
			{
				name: baseName,
				slug,
				appId: original.appId,
				workspaceId: workspace.id,
				purpose: original.purpose,
				description: original.description,
				tags: original.tags,
				parameterSchema: original.parameterSchema,
			},
			dupVersionData,
		);

		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to duplicate prompt";
		return { success: false, error: message };
	}
}

export async function createVersionAction(
	promptTemplateId: string,
	data: {
		templateText: string;
		llm?: string;
		changeNote?: string;
	},
): Promise<ActionResult<{ id: string; version: number }>> {
	try {
		await requireAuth();

		const version = await createPromptVersion(promptTemplateId, data);
		return {
			success: true,
			data: { id: version.id, version: version.version },
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create version";
		return { success: false, error: message };
	}
}
