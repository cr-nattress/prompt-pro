"use server";

import { requireAuth } from "@/lib/auth";
import { createApp, getAppsByWorkspaceId } from "@/lib/db/queries/apps";
import type { App } from "@/lib/db/schema";
import { appFormSchema } from "@/lib/validations/prompt";
import type { ActionResult } from "@/types";

export async function createAppAction(
	input: unknown,
): Promise<ActionResult<App>> {
	try {
		const { workspace } = await requireAuth();
		const parsed = appFormSchema.safeParse(input);
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Validation failed",
			};
		}

		const app = await createApp({
			...parsed.data,
			workspaceId: workspace.id,
		});

		return { success: true, data: app };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create app";
		return { success: false, error: message };
	}
}

export async function fetchAppsAction(
	workspaceId: string,
): Promise<ActionResult<App[]>> {
	try {
		await requireAuth();
		const apps = await getAppsByWorkspaceId(workspaceId);
		return { success: true, data: apps };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch apps";
		return { success: false, error: message };
	}
}
