import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	type NewWebhook,
	type NewWebhookDelivery,
	type Webhook,
	type WebhookDelivery,
	webhookDeliveries,
	webhooks,
} from "@/lib/db/schema";

export async function getWebhooksByWorkspace(
	workspaceId: string,
): Promise<Webhook[]> {
	return db
		.select()
		.from(webhooks)
		.where(eq(webhooks.workspaceId, workspaceId))
		.orderBy(desc(webhooks.createdAt));
}

export async function getWebhookById(id: string): Promise<Webhook | undefined> {
	const rows = await db.select().from(webhooks).where(eq(webhooks.id, id));
	return rows[0];
}

export async function createWebhook(
	data: Omit<NewWebhook, "id" | "createdAt" | "updatedAt">,
): Promise<Webhook> {
	const rows = await db.insert(webhooks).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return rows[0]!;
}

export async function updateWebhook(
	id: string,
	data: {
		[K in "url" | "secret" | "events" | "active" | "description"]?:
			| Webhook[K]
			| undefined;
	},
): Promise<Webhook | undefined> {
	const rows = await db
		.update(webhooks)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(webhooks.id, id))
		.returning();
	return rows[0];
}

export async function deleteWebhook(id: string): Promise<boolean> {
	const rows = await db.delete(webhooks).where(eq(webhooks.id, id)).returning();
	return rows.length > 0;
}

export async function getActiveWebhooksForEvent(
	workspaceId: string,
	event: string,
): Promise<Webhook[]> {
	const all = await db
		.select()
		.from(webhooks)
		.where(
			and(eq(webhooks.workspaceId, workspaceId), eq(webhooks.active, true)),
		);
	return all.filter((w) =>
		w.events.includes(event as Webhook["events"][number]),
	);
}

export async function createWebhookDelivery(
	data: Omit<NewWebhookDelivery, "id" | "createdAt">,
): Promise<WebhookDelivery> {
	const rows = await db.insert(webhookDeliveries).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return rows[0]!;
}

export async function updateWebhookDelivery(
	id: string,
	data: Partial<
		Pick<
			WebhookDelivery,
			"status" | "statusCode" | "responseBody" | "attempts" | "nextRetryAt"
		>
	>,
): Promise<void> {
	await db
		.update(webhookDeliveries)
		.set(data)
		.where(eq(webhookDeliveries.id, id));
}

export async function getWebhookDeliveries(
	webhookId: string,
	limit = 20,
): Promise<WebhookDelivery[]> {
	return db
		.select()
		.from(webhookDeliveries)
		.where(eq(webhookDeliveries.webhookId, webhookId))
		.orderBy(desc(webhookDeliveries.createdAt))
		.limit(limit);
}

export async function getRecentDeliveries(
	workspaceId: string,
	limit = 50,
): Promise<(WebhookDelivery & { webhookUrl: string })[]> {
	const rows = await db
		.select({
			id: webhookDeliveries.id,
			webhookId: webhookDeliveries.webhookId,
			event: webhookDeliveries.event,
			payload: webhookDeliveries.payload,
			status: webhookDeliveries.status,
			statusCode: webhookDeliveries.statusCode,
			responseBody: webhookDeliveries.responseBody,
			attempts: webhookDeliveries.attempts,
			nextRetryAt: webhookDeliveries.nextRetryAt,
			createdAt: webhookDeliveries.createdAt,
			webhookUrl: webhooks.url,
		})
		.from(webhookDeliveries)
		.innerJoin(webhooks, eq(webhookDeliveries.webhookId, webhooks.id))
		.where(eq(webhooks.workspaceId, workspaceId))
		.orderBy(desc(webhookDeliveries.createdAt))
		.limit(limit);
	return rows;
}
