"use client";

import { ClipboardList, Download, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
	exportAuditLogCsvAction,
	getAuditLogAction,
} from "@/app/(dashboard)/settings/audit-log/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { AuditLogEntry } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";

const ACTION_LABELS: Record<string, string> = {
	"prompt.create": "Created prompt",
	"prompt.update": "Updated prompt",
	"prompt.delete": "Deleted prompt",
	"prompt.version.promote": "Promoted version",
	"blueprint.create": "Created blueprint",
	"blueprint.update": "Updated blueprint",
	"blueprint.delete": "Deleted blueprint",
	"blueprint.version.promote": "Promoted blueprint version",
	"api_key.create": "Created API key",
	"api_key.revoke": "Revoked API key",
	"member.invite": "Invited member",
	"member.remove": "Removed member",
	"member.role_change": "Changed member role",
	"collection.create": "Created collection",
	"collection.update": "Updated collection",
	"collection.delete": "Deleted collection",
	"workspace.update": "Updated workspace",
	"webhook.create": "Created webhook",
	"webhook.update": "Updated webhook",
	"webhook.delete": "Deleted webhook",
	"export.download": "Exported data",
	"import.upload": "Imported data",
};

const ACTION_COLORS: Record<string, string> = {
	create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	update: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
	promote:
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

function getActionColor(action: string): string {
	if (
		action.includes("delete") ||
		action.includes("revoke") ||
		action.includes("remove")
	)
		return ACTION_COLORS.delete ?? "";
	if (action.includes("create") || action.includes("invite"))
		return ACTION_COLORS.create ?? "";
	if (action.includes("promote")) return ACTION_COLORS.promote ?? "";
	return ACTION_COLORS.update ?? "";
}

export function AuditLogViewer() {
	const [entries, setEntries] = useState<AuditLogEntry[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [actionFilter, setActionFilter] = useState<string>("all");
	const [isPending, startTransition] = useTransition();

	const loadEntries = useCallback(() => {
		startTransition(async () => {
			const result = await getAuditLogAction({
				search: search || undefined,
				action: actionFilter !== "all" ? actionFilter : undefined,
				page,
			});
			if (result.success) {
				setEntries(result.data.entries);
				setTotal(result.data.total);
			}
		});
	}, [search, actionFilter, page]);

	useEffect(() => {
		loadEntries();
	}, [loadEntries]);

	function handleExportCsv() {
		startTransition(async () => {
			const result = await exportAuditLogCsvAction({
				search: search || undefined,
				action: actionFilter !== "all" ? actionFilter : undefined,
			});
			if (result.success) {
				const blob = new Blob([result.data], { type: "text/csv" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `audit-log-${Date.now()}.csv`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
				showToast("success", "Audit log exported");
			} else {
				showToast("error", result.error);
			}
		});
	}

	const totalPages = Math.ceil(total / 50);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-semibold text-lg">Audit Log</h2>
					<p className="text-muted-foreground text-sm">
						{total} event{total !== 1 ? "s" : ""} recorded
					</p>
				</div>
				<Button variant="outline" size="sm" onClick={handleExportCsv}>
					<Download className="mr-1.5 h-3.5 w-3.5" />
					Export CSV
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-2">
				<div className="relative flex-1">
					<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by name or user..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="pl-8"
					/>
				</div>
				<Select
					value={actionFilter}
					onValueChange={(v) => {
						setActionFilter(v);
						setPage(1);
					}}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="All actions" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All actions</SelectItem>
						{Object.entries(ACTION_LABELS).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Log entries */}
			{isPending && entries.length === 0 ? (
				<div className="flex items-center justify-center p-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : entries.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center gap-3 p-8 text-center">
						<ClipboardList className="h-8 w-8 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">
							No audit log entries yet. Actions will appear here as your team
							uses the workspace.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-1">
					{entries.map((entry) => (
						<div
							key={entry.id}
							className="flex items-center gap-3 rounded-md border p-3"
						>
							<Badge
								variant="secondary"
								className={`shrink-0 text-xs ${getActionColor(entry.action)}`}
							>
								{ACTION_LABELS[entry.action] ?? entry.action}
							</Badge>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm">
									<span className="font-medium">
										{entry.userName ?? "System"}
									</span>
									{entry.resourceName && (
										<>
											{" — "}
											<span className="text-muted-foreground">
												{entry.resourceName}
											</span>
										</>
									)}
								</p>
							</div>
							<time className="shrink-0 text-muted-foreground text-xs">
								{new Date(entry.createdAt).toLocaleString()}
							</time>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-sm">
						Page {page} of {totalPages}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => p - 1)}
							disabled={page <= 1 || isPending}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => p + 1)}
							disabled={page >= totalPages || isPending}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
