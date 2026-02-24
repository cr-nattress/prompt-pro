"use server";

import { createHmac, randomBytes } from "node:crypto";
import { z } from "zod/v4";
import { requireRole } from "@/lib/auth";
import {
	createWebhook,
	deleteWebhook,
	getRecentDeliveries,
	getWebhookById,
	getWebhooksByWorkspace,
	updateWebhook,
} from "@/lib/db/queries/webhooks";
import type { Webhook, WebhookDelivery } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

const WEBHOOK_EVENTS = [
	"prompt.created",
	"prompt.deleted",
	"prompt.version.promoted",
	"blueprint.created",
	"blueprint.deleted",
	"blueprint.version.promoted",
] as const;

const createWebhookSchema = z.object({
	url: z.url(),
	events: z.array(z.enum(WEBHOOK_EVENTS)).min(1),
	description: z.string().max(200).optional(),
});

export async function getWebhooksAction(): Promise<Webhook[]> {
	const { workspace } = await requireRole("admin");
	return getWebhooksByWorkspace(workspace.id);
}

export async function createWebhookAction(
	input: z.infer<typeof createWebhookSchema>,
): Promise<ActionResult<Webhook>> {
	try {
		const { workspace } = await requireRole("admin");

		if (workspace.plan === "free") {
			return {
				success: false,
				error: "Webhooks require a Pro or Team plan.",
			};
		}

		const parsed = createWebhookSchema.safeParse(input);
		if (!parsed.success) {
			return { success: false, error: "Invalid input." };
		}

		const secret = randomBytes(32).toString("hex");
		const webhook = await createWebhook({
			workspaceId: workspace.id,
			url: parsed.data.url,
			secret,
			events: parsed.data.events as Webhook["events"],
			description: parsed.data.description ?? null,
		});

		return { success: true, data: webhook };
	} catch {
		return { success: false, error: "Failed to create webhook." };
	}
}

export async function updateWebhookAction(
	id: string,
	data: {
		url?: string | undefined;
		events?: string[] | undefined;
		active?: boolean | undefined;
		description?: string | undefined;
	},
): Promise<ActionResult<Webhook>> {
	try {
		await requireRole("admin");

		const update: Parameters<typeof updateWebhook>[1] = {};
		if (data.url !== undefined) update.url = data.url;
		if (data.events !== undefined)
			update.events = data.events as Webhook["events"];
		if (data.active !== undefined) update.active = data.active;
		if (data.description !== undefined) update.description = data.description;

		const result = await updateWebhook(id, update);

		if (!result) {
			return { success: false, error: "Webhook not found." };
		}

		return { success: true, data: result };
	} catch {
		return { success: false, error: "Failed to update webhook." };
	}
}

export async function deleteWebhookAction(
	id: string,
): Promise<ActionResult<null>> {
	try {
		await requireRole("admin");
		const result = await deleteWebhook(id);
		if (!result) {
			return { success: false, error: "Webhook not found." };
		}
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to delete webhook." };
	}
}

export async function getWebhookDeliveriesAction(): Promise<
	(WebhookDelivery & { webhookUrl: string })[]
> {
	const { workspace } = await requireRole("admin");
	return getRecentDeliveries(workspace.id);
}

export async function getWebhookSecretAction(
	id: string,
): Promise<ActionResult<string>> {
	try {
		await requireRole("admin");
		const webhook = await getWebhookById(id);
		if (!webhook) {
			return { success: false, error: "Webhook not found." };
		}
		return { success: true, data: webhook.secret };
	} catch {
		return { success: false, error: "Failed to get webhook secret." };
	}
}

/** Generate HMAC signature for a webhook payload. Used internally when firing webhooks. */
export function signWebhookPayload(secret: string, payload: string): string {
	return createHmac("sha256", secret).update(payload).digest("hex");
}
