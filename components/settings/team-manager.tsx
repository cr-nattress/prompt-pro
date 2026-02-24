"use client";

import { Clock, Loader2, Mail, Shield, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
	cancelInvitationAction,
	changeMemberRoleAction,
	inviteMemberAction,
	removeMemberAction,
} from "@/app/(dashboard)/settings/team/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { WorkspaceInvitation } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";

type MemberRow = {
	member: { id: string; userId: string; role: string; joinedAt: Date };
	userName: string;
	userEmail: string;
	userImageUrl: string | null;
};

interface TeamManagerProps {
	members: MemberRow[];
	invitations: WorkspaceInvitation[];
	ownerId: string;
	isAdmin: boolean;
}

const ROLE_COLORS: Record<string, string> = {
	admin:
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
	editor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	viewer: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function TeamManager({
	members,
	invitations,
	ownerId,
	isAdmin,
}: TeamManagerProps) {
	const router = useRouter();
	const [inviteOpen, setInviteOpen] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<string>("editor");
	const [isPending, startTransition] = useTransition();

	function handleInvite() {
		startTransition(async () => {
			const result = await inviteMemberAction({
				email: inviteEmail,
				role: inviteRole as "editor" | "viewer",
			});
			if (result.success) {
				showToast(
					"success",
					result.data.token ? "Invitation sent" : "Member added directly",
				);
				setInviteOpen(false);
				setInviteEmail("");
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleChangeRole(userId: string, role: string) {
		startTransition(async () => {
			const result = await changeMemberRoleAction(
				userId,
				role as "admin" | "editor" | "viewer",
			);
			if (result.success) {
				showToast("success", "Role updated");
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleRemove(userId: string) {
		startTransition(async () => {
			const result = await removeMemberAction(userId);
			if (result.success) {
				showToast("success", "Member removed");
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleCancelInvitation(invitationId: string) {
		startTransition(async () => {
			const result = await cancelInvitationAction(invitationId);
			if (result.success) {
				showToast("success", "Invitation cancelled");
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-semibold text-lg">Team Members</h2>
					<p className="text-muted-foreground text-sm">
						{members.length} member{members.length !== 1 ? "s" : ""} (max 10)
					</p>
				</div>
				{isAdmin && (
					<Button size="sm" onClick={() => setInviteOpen(true)}>
						<UserPlus className="mr-1.5 h-3.5 w-3.5" />
						Invite Member
					</Button>
				)}
			</div>

			{/* Member list */}
			<div className="space-y-2">
				{members.map((m) => {
					const isOwner = m.member.userId === ownerId;
					return (
						<Card key={m.member.id}>
							<CardContent className="flex items-center justify-between p-3">
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium text-sm">
										{m.userName.charAt(0).toUpperCase()}
									</div>
									<div>
										<p className="font-medium text-sm">
											{m.userName}
											{isOwner && (
												<span className="ml-1.5 text-muted-foreground text-xs">
													(Owner)
												</span>
											)}
										</p>
										<p className="text-muted-foreground text-xs">
											{m.userEmail}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{isAdmin && !isOwner ? (
										<Select
											value={m.member.role}
											onValueChange={(role) =>
												handleChangeRole(m.member.userId, role)
											}
										>
											<SelectTrigger className="h-8 w-[110px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="admin">Admin</SelectItem>
												<SelectItem value="editor">Editor</SelectItem>
												<SelectItem value="viewer">Viewer</SelectItem>
											</SelectContent>
										</Select>
									) : (
										<Badge
											variant="secondary"
											className={ROLE_COLORS[m.member.role] ?? ""}
										>
											<Shield className="mr-1 h-3 w-3" />
											{m.member.role}
										</Badge>
									)}
									{isAdmin && !isOwner && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemove(m.member.userId)}
											disabled={isPending}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Pending invitations */}
			{invitations.length > 0 && (
				<div className="space-y-2">
					<h3 className="font-medium text-sm">Pending Invitations</h3>
					{invitations.map((inv) => (
						<Card key={inv.id}>
							<CardContent className="flex items-center justify-between p-3">
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
										<Mail className="h-4 w-4 text-muted-foreground" />
									</div>
									<div>
										<p className="font-medium text-sm">{inv.email}</p>
										<p className="flex items-center gap-1 text-muted-foreground text-xs">
											<Clock className="h-3 w-3" />
											Expires {new Date(inv.expiresAt).toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="outline">{inv.role}</Badge>
									{isAdmin && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleCancelInvitation(inv.id)}
											disabled={isPending}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Invite dialog */}
			<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Invite Team Member</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="invite-email">Email address</Label>
							<Input
								id="invite-email"
								type="email"
								value={inviteEmail}
								onChange={(e) => setInviteEmail(e.target.value)}
								placeholder="team@example.com"
							/>
						</div>
						<div>
							<Label htmlFor="invite-role">Role</Label>
							<Select value={inviteRole} onValueChange={setInviteRole}>
								<SelectTrigger id="invite-role">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="editor">
										Editor — can create and edit prompts
									</SelectItem>
									<SelectItem value="viewer">
										Viewer — read-only access
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							className="w-full"
							onClick={handleInvite}
							disabled={isPending || !inviteEmail}
						>
							{isPending && (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							)}
							Send Invitation
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
