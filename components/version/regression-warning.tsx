"use client";

import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { RegressionResult } from "@/lib/testing/regression";

interface RegressionWarningProps {
	regressions: RegressionResult;
	onAcknowledge: (acknowledged: boolean) => void;
}

export function RegressionWarning({
	regressions,
	onAcknowledge,
}: RegressionWarningProps) {
	const [expanded, setExpanded] = useState(false);
	const [acknowledged, setAcknowledged] = useState(false);

	if (!regressions.hasRegressions) return null;

	return (
		<div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
			<div className="flex items-start gap-3">
				<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
				<div className="flex-1 space-y-3">
					<div>
						<p className="font-medium text-amber-800 text-sm dark:text-amber-200">
							{regressions.regressionCount} test case
							{regressions.regressionCount === 1 ? "" : "s"} regressed since the
							previous version
						</p>
						<button
							type="button"
							onClick={() => setExpanded(!expanded)}
							className="mt-1 flex items-center gap-1 text-amber-700 text-xs dark:text-amber-300"
						>
							{expanded ? (
								<ChevronDown className="h-3 w-3" />
							) : (
								<ChevronRight className="h-3 w-3" />
							)}
							{expanded ? "Hide" : "Show"} regressed tests
						</button>
					</div>

					{expanded && (
						<ul className="list-inside list-disc space-y-1 text-amber-800 text-xs dark:text-amber-200">
							{regressions.regressions.map((r) => (
								<li key={r.testCaseName}>{r.testCaseName}</li>
							))}
						</ul>
					)}

					<div className="flex items-center gap-2">
						<Checkbox
							id="acknowledge-regressions"
							checked={acknowledged}
							onCheckedChange={(checked) => {
								const value = checked === true;
								setAcknowledged(value);
								onAcknowledge(value);
							}}
						/>
						<Label
							htmlFor="acknowledge-regressions"
							className="text-amber-800 text-xs dark:text-amber-200"
						>
							I acknowledge these regressions
						</Label>
					</div>
				</div>
			</div>
		</div>
	);
}
