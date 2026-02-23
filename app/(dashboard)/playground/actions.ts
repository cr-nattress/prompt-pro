"use server";

import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	contextBlueprints,
	promptTemplates,
	promptVersions,
} from "@/lib/db/schema";
import type { ActionResult } from "@/types";

interface PromptOption {
	id: string;
	name: string;
	slug: string;
	latestVersionId: string | null;
	latestTemplateText: string | null;
	parameterSchema: unknown;
}

interface BlueprintOption {
	id: string;
	name: string;
	slug: string;
}

export async function getPlaygroundSourcesAction(): Promise<
	ActionResult<{ prompts: PromptOption[]; blueprints: BlueprintOption[] }>
> {
	try {
		const { workspace } = await requireAuth();

		const [prompts, blueprints] = await Promise.all([
			db
				.select({
					id: promptTemplates.id,
					name: promptTemplates.name,
					slug: promptTemplates.slug,
					parameterSchema: promptTemplates.parameterSchema,
				})
				.from(promptTemplates)
				.where(eq(promptTemplates.workspaceId, workspace.id))
				.orderBy(desc(promptTemplates.updatedAt)),
			db
				.select({
					id: contextBlueprints.id,
					name: contextBlueprints.name,
					slug: contextBlueprints.slug,
				})
				.from(contextBlueprints)
				.where(eq(contextBlueprints.workspaceId, workspace.id))
				.orderBy(desc(contextBlueprints.updatedAt)),
		]);

		// Fetch latest version for each prompt
		const promptsWithVersions: PromptOption[] = await Promise.all(
			prompts.map(async (p) => {
				const versions = await db
					.select({
						id: promptVersions.id,
						templateText: promptVersions.templateText,
					})
					.from(promptVersions)
					.where(eq(promptVersions.promptTemplateId, p.id))
					.orderBy(desc(promptVersions.version))
					.limit(1);
				const latest = versions[0];
				return {
					...p,
					latestVersionId: latest?.id ?? null,
					latestTemplateText: latest?.templateText ?? null,
				};
			}),
		);

		return {
			success: true,
			data: { prompts: promptsWithVersions, blueprints },
		};
	} catch {
		return { success: false, error: "Failed to load playground sources" };
	}
}

export async function getPromptVersionTextAction(
	versionId: string,
): Promise<ActionResult<{ templateText: string; parameterSchema: unknown }>> {
	try {
		await requireAuth();

		const result = await db
			.select({
				templateText: promptVersions.templateText,
				promptTemplateId: promptVersions.promptTemplateId,
			})
			.from(promptVersions)
			.where(eq(promptVersions.id, versionId))
			.limit(1);

		const version = result[0];
		if (!version) {
			return { success: false, error: "Version not found" };
		}

		const templateResult = await db
			.select({ parameterSchema: promptTemplates.parameterSchema })
			.from(promptTemplates)
			.where(eq(promptTemplates.id, version.promptTemplateId))
			.limit(1);

		return {
			success: true,
			data: {
				templateText: version.templateText,
				parameterSchema: templateResult[0]?.parameterSchema ?? null,
			},
		};
	} catch {
		return { success: false, error: "Failed to load version" };
	}
}
