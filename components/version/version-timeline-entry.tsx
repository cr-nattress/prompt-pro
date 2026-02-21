"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/prompt-utils";
import type { VersionStatus } from "@/lib/version-utils";
import { PromoteDropdown } from "./promote-dropdown";
import { RestoreConfirmDialog } from "./restore-confirm-dialog";
import { StatusBadge } from "./status-badge";
import { VersionBadge } from "./version-badge";

interface VersionTimelineEntryProps {
	versionId: string;
	version: number;
	status: string;
	changeNote: string | null;
	createdAt: Date;
	entityId: string;
	entityType: "prompt" | "block" | "blueprint";
	compareHref: string | null;
	onPromote: (
		versionId: string,
		newStatus: "active" | "stable" | "deprecated",
	) => Promise<boolean>;
	onRestore: (sourceVersionId: string, changeNote: string) => Promise<boolean>;
}

export function VersionTimelineEntry({
	versionId,
	version,
	status,
	changeNote,
	createdAt,
	entityId: _entityId,
	entityType: _entityType,
	compareHref,
	onPromote,
	onRestore,
}: VersionTimelineEntryProps) {
	const [restoreOpen, setRestoreOpen] = useState(false);

	return (
		<div className="relative flex gap-3 pb-6 last:pb-0">
			{/* Timeline connector */}
			<div className="flex flex-col items-center">
				<div
					className="h-2.5 w-2.5 shrink-0 rounded-full border-2"
					style={{
						borderColor: `var(--status-${status})`,
						backgroundColor:
							status !== "draft" ? `var(--status-${status})` : "transparent",
					}}
				/>
				<div className="w-px flex-1 bg-border" />
			</div>

			{/* Content */}
			<div className="-mt-0.5 flex flex-1 flex-col gap-1.5">
				<div className="flex items-center gap-2">
					<VersionBadge version={version} className="text-xs" />
					<StatusBadge status={status as VersionStatus} />
					<span className="text-muted-foreground text-xs">
						{timeAgo(createdAt)}
					</span>
				</div>

				{changeNote && (
					<p className="text-muted-foreground text-sm">{changeNote}</p>
				)}

				<div className="flex items-center gap-1.5">
					{compareHref && (
						<Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
							<Link href={compareHref}>Compare</Link>
						</Button>
					)}

					<PromoteDropdown
						currentStatus={status as VersionStatus}
						onPromote={(newStatus) => onPromote(versionId, newStatus)}
					/>

					{status !== "deprecated" && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 text-xs"
							onClick={() => setRestoreOpen(true)}
						>
							<RotateCcw className="mr-1 h-3 w-3" />
							Restore
						</Button>
					)}
				</div>
			</div>

			<RestoreConfirmDialog
				open={restoreOpen}
				onOpenChange={setRestoreOpen}
				version={version}
				onConfirm={(note) => onRestore(versionId, note)}
			/>
		</div>
	);
}
