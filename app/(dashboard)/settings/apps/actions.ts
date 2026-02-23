"use server";

import { requireAuth } from "@/lib/auth";
import { checkAppLimit } from "@/lib/billing/gating";
import { createApp, deleteApp, updateApp } from "@/lib/db/queries/apps";
import type { App } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

export async function createAppSettingsAction(data: {
	name: string;
	slug: string;
	description?: string;
	defaultLlm?: string;
}): Promise<ActionResult<App>> {
	try {
		const { workspace } = await requireAuth();

		const gate = await checkAppLimit(workspace.id, workspace.plan);
		if (!gate.allowed) {
			return {
				success: false,
				error: `App limit reached (${gate.current}/${gate.limitLabel}). Upgrade your plan to create more apps.`,
			};
		}

		const app = await createApp({
			...data,
			workspaceId: workspace.id,
		});
		return { success: true, data: app };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create app";
		return { success: false, error: message };
	}
}

export async function updateAppAction(
	id: string,
	data: {
		name?: string;
		slug?: string;
		description?: string;
		defaultLlm?: string;
	},
): Promise<ActionResult<App>> {
	try {
		await requireAuth();
		const app = await updateApp(id, data);
		if (!app) return { success: false, error: "App not found" };
		return { success: true, data: app };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to update app";
		return { success: false, error: message };
	}
}

export async function deleteAppAction(id: string): Promise<ActionResult<App>> {
	try {
		await requireAuth();
		const app = await deleteApp(id);
		if (!app) return { success: false, error: "App not found" };
		return { success: true, data: app };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to delete app";
		return { success: false, error: message };
	}
}
