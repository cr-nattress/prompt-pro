"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import type { VersionStatus } from "@/lib/version-utils";
import { VersionTimelineEntry } from "./version-timeline-entry";

interface VersionItem {
	id: string;
	version: number;
	status: string;
	changeNote: string | null;
	createdAt: Date;
}

interface VersionTimelineProps {
	entityType: "prompt" | "block" | "blueprint";
	entityId: string;
	entityName: string;
	entitySlug: string;
	versions: VersionItem[];
	backHref: string;
	onPromote: (
		versionId: string,
		entityId: string,
		newStatus: "active" | "stable" | "deprecated",
	) => Promise<{ success: boolean; error?: string }>;
	onRestore: (
		entityId: string,
		sourceVersionId: string,
	) => Promise<{ success: boolean; error?: string }>;
}

export function VersionTimeline({
	entityType,
	entityId,
	entityName,
	entitySlug,
	versions,
	backHref,
	onPromote,
	onRestore,
}: VersionTimelineProps) {
	const router = useRouter();

	const basePath =
		entityType === "prompt"
			? `/prompts/${entitySlug}/versions`
			: entityType === "blueprint"
				? `/blueprints/${entitySlug}/versions`
				: null;

	const handlePromote = useCallback(
		async (
			versionId: string,
			newStatus: "active" | "stable" | "deprecated",
		) => {
			const result = await onPromote(versionId, entityId, newStatus);
			if (result.success) {
				showToast("success", `Version promoted to ${newStatus}`);
				router.refresh();
				return true;
			}
			showToast("error", result.error ?? "Failed to promote version");
			return false;
		},
		[entityId, onPromote, router],
	);

	const handleRestore = useCallback(
		async (sourceVersionId: string, _changeNote: string) => {
			const result = await onRestore(entityId, sourceVersionId);
			if (result.success) {
				showToast("success", "Version restored as new draft");
				router.refresh();
				return true;
			}
			showToast("error", result.error ?? "Failed to restore version");
			return false;
		},
		[entityId, onRestore, router],
	);

	return (
		<div className="mx-auto max-w-2xl px-4 py-6">
			<div className="mb-6 flex items-center gap-2">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href={backHref}>
						<ChevronLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="font-semibold text-lg">{entityName}</h1>
					<p className="text-muted-foreground text-sm">Version history</p>
				</div>
			</div>

			<div className="flex flex-col">
				{versions.map((v, i) => {
					const prevVersion = versions[i + 1];
					const compareHref =
						prevVersion && basePath
							? `${basePath}/compare?from=${prevVersion.id}&to=${v.id}`
							: null;

					return (
						<VersionTimelineEntry
							key={v.id}
							versionId={v.id}
							version={v.version}
							status={v.status as VersionStatus}
							changeNote={v.changeNote}
							createdAt={v.createdAt}
							entityId={entityId}
							entityType={entityType}
							compareHref={compareHref}
							onPromote={handlePromote}
							onRestore={handleRestore}
						/>
					);
				})}
			</div>

			{versions.length === 0 && (
				<p className="py-8 text-center text-muted-foreground">
					No versions yet.
				</p>
			)}
		</div>
	);
}
