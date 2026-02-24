import { index, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { promptSchema, workspaceRoleEnum } from "./enums";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const workspaceMembers = promptSchema.table(
	"workspace_members",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: workspaceRoleEnum().default("editor").notNull(),
		joinedAt: timestamp("joined_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("workspace_members_workspace_user_unique").on(
			table.workspaceId,
			table.userId,
		),
		index("workspace_members_workspace_id_idx").on(table.workspaceId),
		index("workspace_members_user_id_idx").on(table.userId),
	],
);

export const workspaceInvitations = promptSchema.table(
	"workspace_invitations",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		email: text().notNull(),
		role: workspaceRoleEnum().default("editor").notNull(),
		token: text().notNull().unique(),
		invitedBy: uuid("invited_by")
			.notNull()
			.references(() => users.id),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		acceptedAt: timestamp("accepted_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("workspace_invitations_token_idx").on(table.token),
		index("workspace_invitations_workspace_id_idx").on(table.workspaceId),
	],
);

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type WorkspaceInvitation = typeof workspaceInvitations.$inferSelect;
export type NewWorkspaceInvitation = typeof workspaceInvitations.$inferInsert;
