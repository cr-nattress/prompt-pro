"use client";

import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlaygroundRunResult } from "@/stores/playground-store";

interface RunHistoryProps {
	runs: PlaygroundRunResult[];
	onSelect: (run: PlaygroundRunResult) => void;
}

export function RunHistory({ runs, onSelect }: RunHistoryProps) {
	if (runs.length === 0) {
		return (
			<p className="px-1 py-4 text-center text-muted-foreground text-sm">
				No runs yet
			</p>
		);
	}

	return (
		<ScrollArea className="h-full">
			<div className="flex flex-col gap-1">
				{runs.map((run) => (
					<Button
						key={run.id}
						variant="ghost"
						className="h-auto justify-start p-2 text-left"
						onClick={() => onSelect(run)}
					>
						<div className="flex flex-col gap-0.5">
							<div className="flex items-center gap-1.5">
								<StatusIcon status={run.status} />
								<span className="font-mono text-xs">
									{run.modelId.split("-").slice(0, 2).join(" ")}
								</span>
							</div>
							<span className="line-clamp-1 text-muted-foreground text-xs">
								{run.resolvedText.slice(0, 60)}
								{run.resolvedText.length > 60 ? "..." : ""}
							</span>
							<div className="flex items-center gap-2 text-muted-foreground text-xs">
								<Clock className="h-2.5 w-2.5" />
								{formatTimeAgo(run.createdAt)}
							</div>
						</div>
					</Button>
				))}
			</div>
		</ScrollArea>
	);
}

function StatusIcon({ status }: { status: PlaygroundRunResult["status"] }) {
	switch (status) {
		case "running":
			return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
		case "completed":
			return <CheckCircle className="h-3 w-3 text-green-500" />;
		case "error":
			return <AlertCircle className="h-3 w-3 text-destructive" />;
	}
}

function formatTimeAgo(date: Date): string {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);

	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}
