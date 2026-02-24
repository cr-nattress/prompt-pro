import { createHmac } from "node:crypto";
import {
	createWebhookDelivery,
	getActiveWebhooksForEvent,
	updateWebhookDelivery,
} from "@/lib/db/queries/webhooks";

interface WebhookPayload {
	event: string;
	timestamp: string;
	data: Record<string, unknown>;
}

/**
 * Fire webhooks for a given event in a workspace.
 * Runs asynchronously — does not block the caller.
 */
export async function fireWebhooks(
	workspaceId: string,
	event: string,
	data: Record<string, unknown>,
): Promise<void> {
	const webhooks = await getActiveWebhooksForEvent(workspaceId, event);
	if (webhooks.length === 0) return;

	const payload: WebhookPayload = {
		event,
		timestamp: new Date().toISOString(),
		data,
	};
	const payloadStr = JSON.stringify(payload);

	await Promise.allSettled(
		webhooks.map(async (webhook) => {
			const delivery = await createWebhookDelivery({
				webhookId: webhook.id,
				event: event as Parameters<typeof createWebhookDelivery>[0]["event"],
				payload,
				status: "pending",
				attempts: 0,
			});

			try {
				const signature = createHmac("sha256", webhook.secret)
					.update(payloadStr)
					.digest("hex");

				const response = await fetch(webhook.url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Webhook-Signature": `sha256=${signature}`,
						"X-Webhook-Event": event,
						"User-Agent": "PromptVault-Webhooks/1.0",
					},
					body: payloadStr,
					signal: AbortSignal.timeout(10000),
				});

				const responseBody = await response.text().catch(() => "");

				await updateWebhookDelivery(delivery.id, {
					status: response.ok ? "success" : "failed",
					statusCode: response.status,
					responseBody: responseBody.slice(0, 1000),
					attempts: 1,
				});
			} catch (err) {
				await updateWebhookDelivery(delivery.id, {
					status: "failed",
					responseBody: err instanceof Error ? err.message : "Request failed",
					attempts: 1,
				});
			}
		}),
	);
}
