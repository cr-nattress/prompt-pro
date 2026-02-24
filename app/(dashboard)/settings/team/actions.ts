"use server";

import { z } from "zod/v4";
import { requireRole } from "@/lib/auth";
import {
	addWorkspaceMember,
	createInvitation,
	deleteInvitation,
	getPendingInvitations,
	getWorkspaceMemberCount,
	getWorkspaceMembers,
	removeWorkspaceMember,
	updateMemberRole,
	type WorkspaceRole,
} from "@/lib/db/queries/members";
import { getUserByEmail } from "@/lib/db/queries/users";
import type { ActionResult } from "@/types";

const TEAM_MEMBER_LIMIT = 10;

const inviteSchema = z.object({
	email: z.email(),
	role: z.enum(["editor", "viewer"]),
});

export async function getTeamDataAction() {
	const { workspace } = await requireRole("viewer");
	const [members, invitations] = await Promise.all([
		getWorkspaceMembers(workspace.id),
		getPendingInvitations(workspace.id),
	]);
	return { members, invitations, workspaceId: workspace.id };
}

export async function inviteMemberAction(
	input: z.infer<typeof inviteSchema>,
): Promise<ActionResult<{ token: string }>> {
	try {
		const { user, workspace } = await requireRole("admin");

		if (workspace.plan !== "team") {
			return {
				success: false,
				error: "Team features require a Team plan.",
			};
		}

		const parsed = inviteSchema.safeParse(input);
		if (!parsed.success) {
			return { success: false, error: "Invalid email or role." };
		}

		const memberCount = await getWorkspaceMemberCount(workspace.id);
		if (memberCount >= TEAM_MEMBER_LIMIT) {
			return {
				success: false,
				error: `Team member limit reached (${TEAM_MEMBER_LIMIT}).`,
			};
		}

		// Check if user already exists and add directly
		const existingUser = await getUserByEmail(parsed.data.email);
		if (existingUser) {
			await addWorkspaceMember({
				workspaceId: workspace.id,
				userId: existingUser.id,
				role: parsed.data.role as WorkspaceRole,
			});
			return { success: true, data: { token: "" } };
		}

		// Create invitation for non-existing users
		const invitation = await createInvitation({
			workspaceId: workspace.id,
			email: parsed.data.email,
			role: parsed.data.role as WorkspaceRole,
			invitedBy: user.id,
		});

		return { success: true, data: { token: invitation.token } };
	} catch {
		return { success: false, error: "Failed to invite member." };
	}
}

export async function changeMemberRoleAction(
	userId: string,
	role: "admin" | "editor" | "viewer",
): Promise<ActionResult<null>> {
	try {
		const { workspace } = await requireRole("admin");
		await updateMemberRole(workspace.id, userId, role);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to change role." };
	}
}

export async function removeMemberAction(
	userId: string,
): Promise<ActionResult<null>> {
	try {
		const { workspace } = await requireRole("admin");

		// Don't allow removing the owner
		if (workspace.ownerId === userId) {
			return { success: false, error: "Cannot remove workspace owner." };
		}

		await removeWorkspaceMember(workspace.id, userId);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to remove member." };
	}
}

export async function cancelInvitationAction(
	invitationId: string,
): Promise<ActionResult<null>> {
	try {
		await requireRole("admin");
		await deleteInvitation(invitationId);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to cancel invitation." };
	}
}
