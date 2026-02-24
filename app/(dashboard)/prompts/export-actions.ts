"use server";

import { requireAuth } from "@/lib/auth";
import { getPromptById, getPromptVersions } from "@/lib/db/queries/prompts";
import type { PromptTemplate } from "@/lib/db/schema";
import {
	type ExportFormat,
	exportPrompts,
	formatPromptForExport,
} from "@/lib/export";
import type { ActionResult } from "@/types";

export async function exportPromptsAction(
	promptIds: string[],
	format: ExportFormat,
): Promise<
	ActionResult<{ content: string; filename: string; mimeType: string }>
> {
	try {
		const { workspace } = await requireAuth();

		if (workspace.plan === "free") {
			return {
				success: false,
				error:
					"Export is available on Pro and Team plans. Upgrade to export your prompts.",
			};
		}

		if (promptIds.length === 0) {
			return { success: false, error: "No prompts selected for export." };
		}

		const exportable = await Promise.all(
			promptIds.map(async (id) => {
				const prompt = await getPromptById(id);
				if (!prompt || prompt.workspaceId !== workspace.id) return null;
				const versions = await getPromptVersions(id);
				return formatPromptForExport(prompt as PromptTemplate, versions);
			}),
		);

		const prompts = exportable.filter(
			(p): p is NonNullable<typeof p> => p !== null,
		);

		if (prompts.length === 0) {
			return { success: false, error: "No valid prompts found." };
		}

		const result = exportPrompts(prompts, format);
		const filename =
			prompts.length === 1 && prompts[0]
				? `${prompts[0].slug}.${result.extension}`
				: `promptvault-export-${Date.now()}.${result.extension}`;

		return {
			success: true,
			data: {
				content: result.content,
				filename,
				mimeType: result.mimeType,
			},
		};
	} catch {
		return { success: false, error: "Failed to export prompts." };
	}
}
