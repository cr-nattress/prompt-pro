"use server";

import { requireAuth } from "@/lib/auth";
import { getTemplate } from "@/lib/data/prompt-templates";
import { ensureDefaultApp } from "@/lib/db/queries/ensure-default-app";
import { createPrompt } from "@/lib/db/queries/prompts";
import { slugify } from "@/lib/prompt-utils";
import type { ActionResult } from "@/types";

export async function forkTemplateAction(
	templateSlug: string,
): Promise<ActionResult<{ slug: string }>> {
	try {
		const { workspace } = await requireAuth();

		const template = getTemplate(templateSlug);
		if (!template) {
			return { success: false, error: "Template not found." };
		}

		const app = await ensureDefaultApp(workspace.id);
		const slug = slugify(template.name);

		const created = await createPrompt(
			{
				appId: app.id,
				workspaceId: workspace.id,
				slug,
				name: template.name,
				purpose: template.purpose,
				description: template.description,
				tags: template.tags,
			},
			{
				templateText: template.templateText,
				changeNote: `Created from template: ${template.name}`,
			},
		);

		return { success: true, data: { slug: created.slug } };
	} catch {
		return { success: false, error: "Failed to fork template." };
	}
}
