"use client";

import { ArrowUpCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RegressionResult } from "@/lib/testing/regression";
import { getAllowedPromotions, type VersionStatus } from "@/lib/version-utils";
import { PromoteConfirmDialog } from "./promote-confirm-dialog";
import { StatusBadge } from "./status-badge";

interface PromoteDropdownProps {
	currentStatus: VersionStatus;
	onPromote: (
		newStatus: "active" | "stable" | "deprecated",
	) => Promise<boolean>;
	regressions?: RegressionResult | null | undefined;
}

export function PromoteDropdown({
	currentStatus,
	onPromote,
	regressions,
}: PromoteDropdownProps) {
	const allowed = getAllowedPromotions(currentStatus);
	const [confirmTarget, setConfirmTarget] = useState<VersionStatus | null>(
		null,
	);

	if (allowed.length === 0) return null;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-7 text-xs">
						<ArrowUpCircle className="mr-1 h-3 w-3" />
						Promote
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{allowed.map((target) => (
						<DropdownMenuItem
							key={target}
							onClick={() => setConfirmTarget(target)}
						>
							<StatusBadge status={target} />
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{confirmTarget && (
				<PromoteConfirmDialog
					open={confirmTarget !== null}
					onOpenChange={(open) => {
						if (!open) setConfirmTarget(null);
					}}
					currentStatus={currentStatus}
					targetStatus={confirmTarget}
					onConfirm={() =>
						onPromote(confirmTarget as "active" | "stable" | "deprecated")
					}
					regressions={regressions}
				/>
			)}
		</>
	);
}
