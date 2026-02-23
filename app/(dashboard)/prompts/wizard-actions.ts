"use server";

import { requireAuth } from "@/lib/auth";
import { ensureDefaultApp } from "@/lib/db/queries/ensure-default-app";
import type { ActionResult } from "@/types";

export async function getOrCreateDefaultAppAction(): Promise<
	ActionResult<{ id: string; name: string }>
> {
	try {
		const { workspace } = await requireAuth();
		const app = await ensureDefaultApp(workspace.id);
		return { success: true, data: { id: app.id, name: app.name } };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to get default app";
		return { success: false, error: message };
	}
}
