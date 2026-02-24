"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { RegressionResult } from "@/lib/testing/regression";
import type { VersionStatus } from "@/lib/version-utils";
import { RegressionWarning } from "./regression-warning";
import { StatusBadge } from "./status-badge";

interface PromoteConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentStatus: VersionStatus;
	targetStatus: VersionStatus;
	onConfirm: () => Promise<boolean>;
	regressions?: RegressionResult | null | undefined;
}

export function PromoteConfirmDialog({
	open,
	onOpenChange,
	currentStatus,
	targetStatus,
	onConfirm,
	regressions,
}: PromoteConfirmDialogProps) {
	const [isPending, setIsPending] = useState(false);
	const [regressionsAcknowledged, setRegressionsAcknowledged] = useState(false);

	const hasRegressions = regressions?.hasRegressions ?? false;
	const confirmDisabled =
		isPending || (hasRegressions && !regressionsAcknowledged);

	async function handleConfirm() {
		setIsPending(true);
		const success = await onConfirm();
		setIsPending(false);
		if (success) onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Promote Version</DialogTitle>
					<DialogDescription>
						Any existing version with this status will be demoted to draft.
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center justify-center gap-3 py-4">
					<StatusBadge status={currentStatus} />
					<span className="text-muted-foreground">&rarr;</span>
					<StatusBadge status={targetStatus} />
				</div>

				{regressions?.hasRegressions && (
					<RegressionWarning
						regressions={regressions}
						onAcknowledge={setRegressionsAcknowledged}
					/>
				)}

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={confirmDisabled}>
						{isPending ? "Promoting..." : "Promote"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
