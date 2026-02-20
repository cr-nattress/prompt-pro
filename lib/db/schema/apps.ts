import {
	index,
	jsonb,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { workspaces } from "./workspaces";

export const apps = promptSchema.table(
	"apps",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		slug: text().notNull(),
		name: text().notNull(),
		description: text(),
		defaultLlm: text("default_llm"),
		defaultParams: jsonb("default_params"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("apps_workspace_id_slug_idx").on(table.workspaceId, table.slug),
		index("apps_workspace_id_idx").on(table.workspaceId),
	],
);

export type App = typeof apps.$inferSelect;
export type NewApp = typeof apps.$inferInsert;
