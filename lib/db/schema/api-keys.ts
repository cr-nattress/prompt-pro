import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { apps } from "./apps";
import { promptSchema } from "./enums";
import { workspaces } from "./workspaces";

export const apiKeys = promptSchema.table(
	"api_keys",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		keyHash: text("key_hash").notNull(),
		label: text(),
		scopes: text().array(),
		appId: uuid("app_id").references(() => apps.id, { onDelete: "set null" }),
		expiresAt: timestamp("expires_at", { withTimezone: true }),
		lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [index("api_keys_workspace_id_idx").on(table.workspaceId)],
);

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
