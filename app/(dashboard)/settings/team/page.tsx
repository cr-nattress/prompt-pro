import { TeamManager } from "@/components/settings/team-manager";
import { requireAuth } from "@/lib/auth";
import {
	getPendingInvitations,
	getWorkspaceMembers,
} from "@/lib/db/queries/members";

export const metadata = {
	title: "Team — Settings",
};

export default async function TeamPage() {
	const { workspace, role } = await requireAuth();

	if (workspace.plan !== "team") {
		return (
			<div className="space-y-4">
				<h2 className="font-semibold text-lg">Team Members</h2>
				<p className="text-muted-foreground text-sm">
					Team collaboration features require a Team plan. Upgrade to invite
					team members, assign roles, and collaborate on prompts.
				</p>
			</div>
		);
	}

	const [members, invitations] = await Promise.all([
		getWorkspaceMembers(workspace.id),
		getPendingInvitations(workspace.id),
	]);

	return (
		<TeamManager
			members={members}
			invitations={invitations}
			ownerId={workspace.ownerId}
			isAdmin={role === "admin"}
		/>
	);
}
