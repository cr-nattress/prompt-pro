"use server";

import { requireAuth } from "@/lib/auth";
import type { ExamplePrompt } from "@/lib/data/example-prompts";
import { ensureDefaultApp } from "@/lib/db/queries/ensure-default-app";
import { createPrompt } from "@/lib/db/queries/prompts";
import { slugify } from "@/lib/prompt-utils";
import type { ActionResult, PromptWithVersion } from "@/types";

export async function forkExamplePromptAction(
	example: ExamplePrompt,
): Promise<ActionResult<PromptWithVersion>> {
	try {
		const { workspace } = await requireAuth();
		const app = await ensureDefaultApp(workspace.id);

		const slug = slugify(example.name);

		const result = await createPrompt(
			{
				name: example.name,
				slug,
				appId: app.id,
				workspaceId: workspace.id,
				description: example.description,
				tags: example.tags,
			},
			{
				templateText: example.templateText,
				changeNote: "Forked from example",
			},
		);

		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fork example";
		return { success: false, error: message };
	}
}
