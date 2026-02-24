"use client";

import { Download } from "lucide-react";
import { useState, useTransition } from "react";
import {
	exportResolveLogsAction,
	exportUsageMetricsAction,
} from "@/app/(dashboard)/analytics/actions";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { showToast } from "@/lib/toast";

type Granularity = "day" | "week" | "month";

interface ExportButtonProps {
	datePreset: string;
	from: string;
	to: string;
	granularity: Granularity;
}

function downloadCsv(csv: string, filename: string) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function ExportButton({ from, to, granularity }: ExportButtonProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	function handleExport(type: "resolve-logs" | "usage-metrics") {
		startTransition(async () => {
			const filters = { from, to, granularity };

			if (type === "resolve-logs") {
				const result = await exportResolveLogsAction(filters);
				if (result.success) {
					downloadCsv(result.data.csv, result.data.filename);
					showToast("success", "Resolve logs exported");
				} else {
					showToast("error", result.error);
				}
			} else {
				const result = await exportUsageMetricsAction(filters);
				if (result.success) {
					downloadCsv(result.data.csv, result.data.filename);
					showToast("success", "Usage metrics exported");
				} else {
					showToast("error", result.error);
				}
			}
			setOpen(false);
		});
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" disabled={isPending}>
					<Download className="mr-2 h-4 w-4" />
					Export
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-48 p-1" align="end">
				<button
					type="button"
					className="flex w-full items-center rounded-sm px-3 py-2 text-sm hover:bg-muted"
					onClick={() => handleExport("resolve-logs")}
					disabled={isPending}
				>
					Resolve Logs
				</button>
				<button
					type="button"
					className="flex w-full items-center rounded-sm px-3 py-2 text-sm hover:bg-muted"
					onClick={() => handleExport("usage-metrics")}
					disabled={isPending}
				>
					Usage Metrics
				</button>
			</PopoverContent>
		</Popover>
	);
}
