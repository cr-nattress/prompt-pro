"use client";

import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LintViolation } from "@/lib/linter/rules";

interface LinterPanelProps {
	violations: LintViolation[];
}

export function LinterPanel({ violations }: LinterPanelProps) {
	if (violations.length === 0) {
		return (
			<div className="flex items-center gap-2 px-1 py-3 text-sm">
				<CheckCircle className="h-4 w-4 text-green-500" />
				<span className="text-muted-foreground">No linter issues found</span>
			</div>
		);
	}

	const warnings = violations.filter((v) => v.severity === "warning");
	const infos = violations.filter((v) => v.severity === "info");

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<AlertTriangle className="h-4 w-4 text-amber-500" />
				<span className="font-medium text-sm">
					{violations.length} issue{violations.length !== 1 ? "s" : ""}
				</span>
				{warnings.length > 0 && (
					<Badge variant="outline" className="text-xs">
						{warnings.length} warning{warnings.length !== 1 ? "s" : ""}
					</Badge>
				)}
				{infos.length > 0 && (
					<Badge variant="outline" className="text-xs">
						{infos.length} suggestion{infos.length !== 1 ? "s" : ""}
					</Badge>
				)}
			</div>
			<div className="flex flex-col gap-1.5">
				{violations.map((v) => (
					<div
						key={`${v.ruleId}-${v.from ?? "global"}`}
						className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm"
					>
						{v.severity === "warning" ? (
							<AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
						) : (
							<Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
						)}
						<div className="flex flex-col gap-0.5">
							<span className="font-medium text-xs">{v.ruleName}</span>
							<span className="text-muted-foreground text-xs">{v.message}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
