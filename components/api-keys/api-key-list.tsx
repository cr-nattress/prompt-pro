"use client";

import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteApiKeyAction } from "@/app/(dashboard)/settings/api-keys/actions";
import { CreateKeyDialog } from "@/components/api-keys/create-key-dialog";
import { TokenRevealDialog } from "@/components/api-keys/token-reveal-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { App } from "@/lib/db/schema";
import { timeAgo } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";

interface ApiKeyRow {
	id: string;
	workspaceId: string;
	label: string | null;
	scopes: string[] | null;
	appId: string | null;
	expiresAt: Date | null;
	lastUsedAt: Date | null;
	createdAt: Date;
}

interface ApiKeyListProps {
	keys: ApiKeyRow[];
	apps: App[];
}

export function ApiKeyList({ keys, apps }: ApiKeyListProps) {
	const router = useRouter();
	const [createOpen, setCreateOpen] = useState(false);
	const [revealData, setRevealData] = useState<{
		label: string;
		token: string;
	} | null>(null);
	const [deleteKey, setDeleteKey] = useState<ApiKeyRow | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const appMap = new Map(apps.map((a) => [a.id, a.name]));

	async function handleDelete() {
		if (!deleteKey) return;
		setIsDeleting(true);
		const result = await deleteApiKeyAction(deleteKey.id);
		setIsDeleting(false);

		if (result.success) {
			showToast("success", "API key revoked");
			setDeleteKey(null);
			router.refresh();
		} else {
			showToast("error", result.error);
		}
	}

	return (
		<>
			<div className="flex justify-end">
				<Button onClick={() => setCreateOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Create Key
				</Button>
			</div>

			{keys.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
					<p className="text-muted-foreground">No API keys yet</p>
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create your first API key
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{keys.map((key) => (
						<div
							key={key.id}
							className="flex items-center justify-between rounded-lg border p-4"
						>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="font-medium">
										{key.label ?? "Unnamed key"}
									</span>
									{key.scopes?.map((scope) => (
										<Badge key={scope} variant="outline" className="text-xs">
											{scope}
										</Badge>
									))}
									{key.appId && (
										<Badge variant="secondary" className="text-xs">
											{appMap.get(key.appId) ?? "Unknown app"}
										</Badge>
									)}
								</div>
								<div className="flex gap-3 text-muted-foreground text-xs">
									<span>Created {timeAgo(key.createdAt)}</span>
									{key.lastUsedAt && (
										<span>Last used {timeAgo(key.lastUsedAt)}</span>
									)}
									{key.expiresAt && (
										<span>
											{key.expiresAt < new Date()
												? "Expired"
												: `Expires ${timeAgo(key.expiresAt)}`}
										</span>
									)}
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon-sm">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										className="text-destructive"
										onClick={() => setDeleteKey(key)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Revoke
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					))}
				</div>
			)}

			<CreateKeyDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				apps={apps}
				onCreated={(data) => {
					setRevealData({ label: data.label, token: data.token });
				}}
			/>

			{revealData && (
				<TokenRevealDialog
					open={!!revealData}
					onOpenChange={(open) => {
						if (!open) setRevealData(null);
					}}
					label={revealData.label}
					token={revealData.token}
				/>
			)}

			{deleteKey && (
				<Dialog
					open={!!deleteKey}
					onOpenChange={(open) => {
						if (!open) setDeleteKey(null);
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Revoke API key</DialogTitle>
							<DialogDescription>
								Are you sure you want to revoke &ldquo;
								{deleteKey.label ?? "this key"}&rdquo;? Any applications using
								this key will immediately lose access.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDeleteKey(null)}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={handleDelete}
								disabled={isDeleting}
							>
								{isDeleting ? "Revoking..." : "Revoke Key"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
