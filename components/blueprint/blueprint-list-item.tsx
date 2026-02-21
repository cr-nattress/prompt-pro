"use client";

import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { duplicateBlueprintAction } from "@/app/(dashboard)/blueprints/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/version/status-badge";
import { VersionBadge } from "@/components/version/version-badge";
import { timeAgo } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";
import type { VersionStatus } from "@/lib/version-utils";
import type { BlueprintWithBlockCount } from "@/types";
import { DeleteBlueprintDialog } from "./delete-blueprint-dialog";

interface BlueprintListItemProps {
	blueprint: BlueprintWithBlockCount;
}

export function BlueprintListItem({ blueprint }: BlueprintListItemProps) {
	const router = useRouter();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [isDuplicating, setIsDuplicating] = useState(false);

	async function handleDuplicate() {
		setIsDuplicating(true);
		const result = await duplicateBlueprintAction(blueprint.id);
		setIsDuplicating(false);

		if (result.success) {
			showToast("success", "Blueprint duplicated");
			router.push(`/blueprints/${result.data.slug}`);
		} else {
			showToast("error", result.error);
		}
	}

	return (
		<>
			<div className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50">
				<Link
					href={`/blueprints/${blueprint.slug}`}
					className="flex min-w-0 flex-1 flex-col gap-1"
				>
					<div className="flex items-center gap-2">
						<span className="truncate font-medium">{blueprint.name}</span>
						{blueprint.targetLlm && (
							<Badge variant="secondary" className="shrink-0 text-xs">
								{blueprint.targetLlm}
							</Badge>
						)}
						<Badge variant="outline" className="shrink-0 text-xs">
							{blueprint.blockCount} block
							{blueprint.blockCount !== 1 ? "s" : ""}
						</Badge>
						{blueprint.latestVersion && (
							<>
								<VersionBadge
									version={blueprint.latestVersion.version}
									className="shrink-0 text-xs"
								/>
								{blueprint.latestVersion.status !== "draft" && (
									<StatusBadge
										status={blueprint.latestVersion.status as VersionStatus}
										className="shrink-0"
									/>
								)}
							</>
						)}
					</div>
					{blueprint.description && (
						<p className="hidden truncate text-muted-foreground text-sm md:block">
							{blueprint.description}
						</p>
					)}
				</Link>

				<span className="hidden shrink-0 text-muted-foreground text-xs md:block">
					{timeAgo(blueprint.updatedAt)}
				</span>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon-sm"
							className="shrink-0 opacity-0 group-hover:opacity-100"
						>
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={handleDuplicate}
							disabled={isDuplicating}
						>
							<Copy className="mr-2 h-4 w-4" />
							Duplicate
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							onClick={() => setDeleteOpen(true)}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<DeleteBlueprintDialog
				blueprintId={blueprint.id}
				blueprintName={blueprint.name}
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
			/>
		</>
	);
}
