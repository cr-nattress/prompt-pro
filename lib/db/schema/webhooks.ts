import {
	boolean,
	index,
	integer,
	jsonb,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { deliveryStatusEnum, promptSchema, webhookEventEnum } from "./enums";
import { workspaces } from "./workspaces";

export const webhooks = promptSchema.table(
	"webhooks",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		url: text().notNull(),
		secret: text().notNull(),
		events: webhookEventEnum().array().notNull().default([]),
		active: boolean().notNull().default(true),
		description: text(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [index("webhooks_workspace_id_idx").on(table.workspaceId)],
);

export type Webhook = typeof webhooks.$inferSelect;
export type NewWebhook = typeof webhooks.$inferInsert;

export const webhookDeliveries = promptSchema.table(
	"webhook_deliveries",
	{
		id: uuid().defaultRandom().primaryKey(),
		webhookId: uuid("webhook_id")
			.notNull()
			.references(() => webhooks.id, { onDelete: "cascade" }),
		event: webhookEventEnum().notNull(),
		payload: jsonb().notNull(),
		status: deliveryStatusEnum().notNull().default("pending"),
		statusCode: integer("status_code"),
		responseBody: text("response_body"),
		attempts: integer().notNull().default(0),
		nextRetryAt: timestamp("next_retry_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [index("webhook_deliveries_webhook_id_idx").on(table.webhookId)],
);

export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;
export type NewWebhookDelivery = typeof webhookDeliveries.$inferInsert;
