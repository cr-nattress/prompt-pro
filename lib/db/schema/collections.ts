import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { workspaces } from "./workspaces";

export const collections = promptSchema.table(
	"collections",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		parentId: uuid("parent_id"),
		name: text().notNull(),
		description: text(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("collections_workspace_id_idx").on(table.workspaceId),
		index("collections_parent_id_idx").on(table.parentId),
	],
);

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
