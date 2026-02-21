"use client";

import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { duplicatePromptAction } from "@/app/(dashboard)/prompts/actions";
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
import type { PromptWithVersion } from "@/types";
import { DeletePromptDialog } from "./delete-prompt-dialog";

interface PromptListItemProps {
	prompt: PromptWithVersion;
}

export function PromptListItem({ prompt }: PromptListItemProps) {
	const router = useRouter();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [isDuplicating, setIsDuplicating] = useState(false);

	async function handleDuplicate() {
		setIsDuplicating(true);
		const result = await duplicatePromptAction(prompt.id);
		setIsDuplicating(false);

		if (result.success) {
			showToast("success", "Prompt duplicated");
			router.push(`/prompts/${result.data.slug}`);
		} else {
			showToast("error", result.error);
		}
	}

	return (
		<>
			<div className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50">
				<Link
					href={`/prompts/${prompt.slug}`}
					className="flex min-w-0 flex-1 flex-col gap-1"
				>
					<div className="flex items-center gap-2">
						<span className="truncate font-medium">{prompt.name}</span>
						{prompt.latestVersion?.llm && (
							<Badge variant="secondary" className="shrink-0 text-xs">
								{prompt.latestVersion.llm}
							</Badge>
						)}
						{prompt.latestVersion && (
							<>
								<VersionBadge
									version={prompt.latestVersion.version}
									className="shrink-0 text-xs"
								/>
								{prompt.latestVersion.status !== "draft" && (
									<StatusBadge
										status={prompt.latestVersion.status}
										className="shrink-0"
									/>
								)}
							</>
						)}
						{prompt.purpose && (
							<Badge
								variant="ghost"
								className="hidden shrink-0 text-xs md:inline-flex"
							>
								{prompt.purpose}
							</Badge>
						)}
					</div>
					{prompt.description && (
						<p className="hidden truncate text-muted-foreground text-sm md:block">
							{prompt.description}
						</p>
					)}
				</Link>

				<span className="hidden shrink-0 text-muted-foreground text-xs md:block">
					{timeAgo(prompt.updatedAt)}
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

			<DeletePromptDialog
				promptId={prompt.id}
				promptName={prompt.name}
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
			/>
		</>
	);
}
