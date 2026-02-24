import { index, jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { auditActionEnum, promptSchema } from "./enums";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const auditLog = promptSchema.table(
	"audit_log",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		userId: uuid("user_id").references(() => users.id, {
			onDelete: "set null",
		}),
		userName: text("user_name"),
		action: auditActionEnum().notNull(),
		resourceType: text("resource_type").notNull(),
		resourceId: text("resource_id"),
		resourceName: text("resource_name"),
		details: jsonb(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("audit_log_workspace_id_idx").on(table.workspaceId),
		index("audit_log_created_at_idx").on(table.workspaceId, table.createdAt),
		index("audit_log_action_idx").on(table.workspaceId, table.action),
	],
);

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;
