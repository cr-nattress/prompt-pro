"use client";

import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DriftAlertBannerProps {
	alertId: string;
	promptName: string;
	promptSlug: string;
	similarityScore: number;
	onDismiss: (alertId: string) => Promise<boolean>;
}

export function DriftAlertBanner({
	alertId,
	promptName,
	promptSlug,
	similarityScore,
	onDismiss,
}: DriftAlertBannerProps) {
	const [dismissed, setDismissed] = useState(false);
	const [isPending, startTransition] = useTransition();

	if (dismissed) return null;

	const similarityPercent = Math.round(similarityScore * 100);

	return (
		<Card className="border-amber-500/30 bg-amber-500/5">
			<CardContent className="flex items-center gap-3 pt-4">
				<AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
				<div className="min-w-0 flex-1">
					<p className="font-medium text-sm">
						Drift detected in{" "}
						<Link
							href={`/prompts/${promptSlug}`}
							className="text-primary hover:underline"
						>
							{promptName}
						</Link>
					</p>
					<p className="text-muted-foreground text-xs">
						Output similarity dropped to {similarityPercent}%
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 shrink-0"
					disabled={isPending}
					onClick={() => {
						startTransition(async () => {
							const success = await onDismiss(alertId);
							if (success) setDismissed(true);
						});
					}}
				>
					<X className="h-4 w-4" />
				</Button>
			</CardContent>
		</Card>
	);
}
