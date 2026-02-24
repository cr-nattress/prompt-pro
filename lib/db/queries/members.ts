import crypto from "node:crypto";
import { and, count, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	type NewWorkspaceInvitation,
	type NewWorkspaceMember,
	users,
	workspaceInvitations,
	workspaceMembers,
} from "@/lib/db/schema";

export type WorkspaceRole = "admin" | "editor" | "viewer";

export async function getWorkspaceMembers(workspaceId: string) {
	return db
		.select({
			member: workspaceMembers,
			userName: users.name,
			userEmail: users.email,
			userImageUrl: users.imageUrl,
		})
		.from(workspaceMembers)
		.innerJoin(users, eq(workspaceMembers.userId, users.id))
		.where(eq(workspaceMembers.workspaceId, workspaceId));
}

export async function getWorkspaceMemberCount(workspaceId: string) {
	const result = await db
		.select({ total: count() })
		.from(workspaceMembers)
		.where(eq(workspaceMembers.workspaceId, workspaceId));
	return result[0]?.total ?? 0;
}

export async function getMemberRole(
	workspaceId: string,
	userId: string,
): Promise<WorkspaceRole | null> {
	const result = await db
		.select({ role: workspaceMembers.role })
		.from(workspaceMembers)
		.where(
			and(
				eq(workspaceMembers.workspaceId, workspaceId),
				eq(workspaceMembers.userId, userId),
			),
		)
		.limit(1);
	return (result[0]?.role as WorkspaceRole) ?? null;
}

export async function addWorkspaceMember(data: NewWorkspaceMember) {
	const result = await db
		.insert(workspaceMembers)
		.values(data)
		.onConflictDoNothing()
		.returning();
	return result[0] ?? null;
}

export async function updateMemberRole(
	workspaceId: string,
	userId: string,
	role: WorkspaceRole,
) {
	const result = await db
		.update(workspaceMembers)
		.set({ role })
		.where(
			and(
				eq(workspaceMembers.workspaceId, workspaceId),
				eq(workspaceMembers.userId, userId),
			),
		)
		.returning();
	return result[0] ?? null;
}

export async function removeWorkspaceMember(
	workspaceId: string,
	userId: string,
) {
	const result = await db
		.delete(workspaceMembers)
		.where(
			and(
				eq(workspaceMembers.workspaceId, workspaceId),
				eq(workspaceMembers.userId, userId),
			),
		)
		.returning();
	return result[0] ?? null;
}

export async function createInvitation(
	data: Omit<NewWorkspaceInvitation, "token" | "expiresAt">,
) {
	const token = crypto.randomBytes(32).toString("hex");
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

	const result = await db
		.insert(workspaceInvitations)
		.values({ ...data, token, expiresAt })
		.returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function getInvitationByToken(token: string) {
	const result = await db
		.select()
		.from(workspaceInvitations)
		.where(
			and(
				eq(workspaceInvitations.token, token),
				isNull(workspaceInvitations.acceptedAt),
				gt(workspaceInvitations.expiresAt, new Date()),
			),
		)
		.limit(1);
	return result[0] ?? null;
}

export async function acceptInvitation(invitationId: string) {
	const result = await db
		.update(workspaceInvitations)
		.set({ acceptedAt: new Date() })
		.where(eq(workspaceInvitations.id, invitationId))
		.returning();
	return result[0] ?? null;
}

export async function getPendingInvitations(workspaceId: string) {
	return db
		.select()
		.from(workspaceInvitations)
		.where(
			and(
				eq(workspaceInvitations.workspaceId, workspaceId),
				isNull(workspaceInvitations.acceptedAt),
				gt(workspaceInvitations.expiresAt, new Date()),
			),
		);
}

export async function deleteInvitation(invitationId: string) {
	await db
		.delete(workspaceInvitations)
		.where(eq(workspaceInvitations.id, invitationId));
}
