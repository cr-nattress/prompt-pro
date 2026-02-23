"use client";

import { AlertTriangle, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	deleteWorkspaceAction,
	updateWorkspaceSettingsAction,
} from "@/app/(dashboard)/settings/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { WorkspacePlan } from "@/types";

interface WorkspaceSettingsProps {
	name: string;
	slug: string;
	plan: WorkspacePlan;
}

export function WorkspaceSettings({
	name: initialName,
	slug: initialSlug,
	plan,
}: WorkspaceSettingsProps) {
	const [name, setName] = useState(initialName);
	const [isSaving, setIsSaving] = useState(false);
	const [confirmName, setConfirmName] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleSave() {
		if (!name.trim() || name === initialName) return;
		setIsSaving(true);
		try {
			const result = await updateWorkspaceSettingsAction(name.trim());
			if (result.success) {
				toast.success("Workspace updated");
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to update workspace");
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete() {
		if (confirmName !== initialName) return;
		setIsDeleting(true);
		try {
			const result = await deleteWorkspaceAction(confirmName);
			if (result.success) {
				toast.success("Workspace deleted");
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to delete workspace");
		} finally {
			setIsDeleting(false);
		}
	}

	const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>General</CardTitle>
					<CardDescription>
						Manage your workspace name and settings.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label htmlFor="workspace-name">Workspace name</Label>
						<div className="flex gap-2">
							<Input
								id="workspace-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="max-w-sm"
							/>
							<Button
								onClick={handleSave}
								disabled={isSaving || !name.trim() || name === initialName}
								size="sm"
							>
								{isSaving ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Save className="mr-2 h-4 w-4" />
								)}
								Save
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Workspace slug</Label>
						<p className="text-muted-foreground text-sm">
							<code className="bg-muted rounded px-1.5 py-0.5 text-xs">
								{initialSlug}
							</code>
						</p>
						<p className="text-muted-foreground text-xs">
							The slug is auto-generated from the workspace name.
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Plan</CardTitle>
					<CardDescription>
						Your current workspace plan and usage limits.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<Badge variant={plan === "free" ? "secondary" : "default"}>
							{planLabel}
						</Badge>
						{plan === "free" && (
							<span className="text-muted-foreground text-sm">
								Upgrade for more prompts, API calls, and AI analyses.
							</span>
						)}
					</div>
					<Separator />
					<div className="grid gap-3 text-sm sm:grid-cols-3">
						<div>
							<p className="text-muted-foreground">API rate limit</p>
							<p className="font-medium">
								{plan === "free"
									? "10 req/min"
									: plan === "pro"
										? "60 req/min"
										: "300 req/min"}
							</p>
						</div>
						<div>
							<p className="text-muted-foreground">Monthly API calls</p>
							<p className="font-medium">
								{plan === "free"
									? "500"
									: plan === "pro"
										? "10,000"
										: "100,000"}
							</p>
						</div>
						<div>
							<p className="text-muted-foreground">AI analyses / month</p>
							<p className="font-medium">
								{plan === "free" ? "5" : plan === "pro" ? "100" : "500"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="text-destructive">Danger Zone</CardTitle>
					<CardDescription>
						Irreversible actions that affect your entire workspace.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="confirm-delete">
							Type{" "}
							<code className="bg-muted rounded px-1.5 py-0.5 text-xs font-semibold">
								{initialName}
							</code>{" "}
							to confirm deletion
						</Label>
						<div className="flex gap-2">
							<Input
								id="confirm-delete"
								value={confirmName}
								onChange={(e) => setConfirmName(e.target.value)}
								placeholder={initialName}
								className="max-w-sm"
							/>
							<Button
								variant="destructive"
								onClick={handleDelete}
								disabled={isDeleting || confirmName !== initialName}
								size="sm"
							>
								{isDeleting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<AlertTriangle className="mr-2 h-4 w-4" />
								)}
								Delete Workspace
							</Button>
						</div>
						<p className="text-muted-foreground text-xs">
							This will permanently delete your workspace and all its data. This
							action cannot be undone.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
