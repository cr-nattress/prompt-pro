import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { planEnum, promptSchema } from "./enums";
import { users } from "./users";

export const workspaces = promptSchema.table(
	"workspaces",
	{
		id: uuid().defaultRandom().primaryKey(),
		slug: text().notNull().unique(),
		name: text().notNull(),
		ownerId: uuid("owner_id")
			.notNull()
			.references(() => users.id),
		plan: planEnum().default("free").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [index("workspaces_owner_id_idx").on(table.ownerId)],
);

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
