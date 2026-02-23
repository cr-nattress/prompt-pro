"use server";

import { requireAuth } from "@/lib/auth";
import { ensureDefaultApp } from "@/lib/db/queries/ensure-default-app";
import { createPrompt } from "@/lib/db/queries/prompts";
import { markOnboardingComplete } from "@/lib/db/queries/users";
import { updateWorkspace } from "@/lib/db/queries/workspaces";
import { slugify } from "@/lib/prompt-utils";
import type { ActionResult } from "@/types";

export async function updateWorkspaceNameAction(
	name: string,
): Promise<ActionResult<{ id: string }>> {
	try {
		const { workspace } = await requireAuth();
		const slug = slugify(name) || workspace.slug;
		const updated = await updateWorkspace(workspace.id, { name, slug });
		if (!updated) {
			return { success: false, error: "Failed to update workspace" };
		}
		return { success: true, data: { id: updated.id } };
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to update workspace name";
		return { success: false, error: message };
	}
}

export async function createOnboardingPromptAction(data: {
	role: string;
	task: string;
	output: string;
}): Promise<
	ActionResult<{ promptId: string; slug: string; templateText: string }>
> {
	try {
		const { workspace } = await requireAuth();
		const app = await ensureDefaultApp(workspace.id);

		const sections: string[] = [];
		if (data.role) sections.push(`# Role\nYou are a ${data.role}.`);
		if (data.task) sections.push(`# Task\n${data.task}`);
		if (data.output) sections.push(`# Output Format\n${data.output}`);
		const templateText = sections.join("\n\n");

		const name = data.role
			? `${data.role} — ${data.task.split(/\s+/).slice(0, 4).join(" ")}`
			: "My First Prompt";
		const slug = slugify(name);

		const result = await createPrompt(
			{
				name,
				slug,
				appId: app.id,
				workspaceId: workspace.id,
			},
			{
				templateText,
				changeNote: "Created during onboarding",
			},
		);

		return {
			success: true,
			data: {
				promptId: result.id,
				slug: result.slug,
				templateText,
			},
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create prompt";
		return { success: false, error: message };
	}
}

export async function completeOnboardingAction(): Promise<
	ActionResult<{ done: boolean }>
> {
	try {
		const { user } = await requireAuth();
		await markOnboardingComplete(user.id);
		return { success: true, data: { done: true } };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to complete onboarding";
		return { success: false, error: message };
	}
}
