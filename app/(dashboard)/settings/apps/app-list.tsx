"use client";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	createAppSettingsAction,
	deleteAppAction,
	updateAppAction,
} from "@/app/(dashboard)/settings/apps/actions";
import {
	AppDeleteDialog,
	AppFormDialog,
} from "@/components/prompt/app-management-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { App } from "@/lib/db/schema";
import { timeAgo } from "@/lib/prompt-utils";

interface AppWithCount extends App {
	promptCount: number;
}

interface AppListProps {
	apps: AppWithCount[];
}

export function AppList({ apps }: AppListProps) {
	const [createOpen, setCreateOpen] = useState(false);
	const [editApp, setEditApp] = useState<AppWithCount | null>(null);
	const [deleteApp, setDeleteApp] = useState<AppWithCount | null>(null);

	return (
		<>
			<div className="flex justify-end">
				<Button onClick={() => setCreateOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					New App
				</Button>
			</div>

			{apps.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
					<p className="text-muted-foreground">No apps yet</p>
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create your first app
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{apps.map((app) => (
						<div
							key={app.id}
							className="flex items-center justify-between rounded-lg border p-4"
						>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="font-medium">{app.name}</span>
									<Badge variant="outline" className="text-xs">
										{app.promptCount} prompt
										{app.promptCount !== 1 ? "s" : ""}
									</Badge>
									{app.defaultLlm && (
										<Badge variant="secondary" className="text-xs">
											{app.defaultLlm}
										</Badge>
									)}
								</div>
								{app.description && (
									<p className="text-muted-foreground text-sm">
										{app.description}
									</p>
								)}
								<p className="text-muted-foreground text-xs">
									Created {timeAgo(app.createdAt)}
								</p>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon-sm">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => setEditApp(app)}>
										<Pencil className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-destructive"
										onClick={() => setDeleteApp(app)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					))}
				</div>
			)}

			<AppFormDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSave={async (data) => {
					const result = await createAppSettingsAction(data);
					return result.success
						? { success: true }
						: { success: false, error: result.error };
				}}
			/>

			{editApp && (
				<AppFormDialog
					open={!!editApp}
					onOpenChange={(open) => {
						if (!open) setEditApp(null);
					}}
					app={editApp}
					onSave={async (data) => {
						const result = await updateAppAction(editApp.id, data);
						return result.success
							? { success: true }
							: { success: false, error: result.error };
					}}
				/>
			)}

			{deleteApp && (
				<AppDeleteDialog
					open={!!deleteApp}
					onOpenChange={(open) => {
						if (!open) setDeleteApp(null);
					}}
					app={deleteApp}
					promptCount={deleteApp.promptCount}
					onDelete={async () => {
						const result = await deleteAppAction(deleteApp.id);
						return result.success
							? { success: true }
							: { success: false, error: result.error };
					}}
				/>
			)}
		</>
	);
}
