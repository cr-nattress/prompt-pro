"use client";

import { History, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/prompt-utils";
import type { VersionStatus } from "@/lib/version-utils";
import { StatusBadge } from "./status-badge";
import { VersionBadge } from "./version-badge";

interface VersionItem {
	id: string;
	version: number;
	status: string;
	changeNote: string | null;
	createdAt: Date;
}

interface VersionPanelProps {
	entityId: string;
	allHref: string;
	fetchVersions: (
		entityId: string,
	) => Promise<{ success: boolean; data?: VersionItem[]; error?: string }>;
}

export function VersionPanel({
	entityId,
	allHref,
	fetchVersions,
}: VersionPanelProps) {
	const [versions, setVersions] = useState<VersionItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		fetchVersions(entityId).then((result) => {
			if (cancelled) return;
			if (result.success && result.data) {
				setVersions(result.data);
			}
			setIsLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [entityId, fetchVersions]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-6">
				<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 p-4">
			<div className="flex items-center justify-between">
				<h4 className="flex items-center gap-1.5 font-medium text-sm">
					<History className="h-4 w-4" />
					Versions
				</h4>
				<Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
					<Link href={allHref}>View all</Link>
				</Button>
			</div>

			{versions.length === 0 && (
				<p className="text-muted-foreground text-sm">No versions yet.</p>
			)}

			{versions.slice(0, 5).map((v) => (
				<div
					key={v.id}
					className="flex items-center gap-2 rounded-md border px-3 py-2"
				>
					<VersionBadge version={v.version} className="text-xs" />
					<StatusBadge status={v.status as VersionStatus} />
					<span className="flex-1 truncate text-muted-foreground text-xs">
						{v.changeNote}
					</span>
					<span className="shrink-0 text-muted-foreground text-xs">
						{timeAgo(v.createdAt)}
					</span>
				</div>
			))}
		</div>
	);
}
