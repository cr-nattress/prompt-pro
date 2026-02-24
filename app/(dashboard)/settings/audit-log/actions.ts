"use server";

import { requireRole } from "@/lib/auth";
import {
	getAuditLog,
	getAuditLogActions,
	getAuditLogUsers,
} from "@/lib/db/queries/audit-log";
import type { AuditLogEntry } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

interface AuditLogFilters {
	userId?: string | undefined;
	action?: string | undefined;
	resourceType?: string | undefined;
	search?: string | undefined;
	startDate?: string | undefined;
	endDate?: string | undefined;
	page?: number | undefined;
}

export async function getAuditLogAction(
	filters: AuditLogFilters,
): Promise<ActionResult<{ entries: AuditLogEntry[]; total: number }>> {
	try {
		const { workspace } = await requireRole("admin");

		const result = await getAuditLog({
			workspaceId: workspace.id,
			userId: filters.userId,
			action: filters.action,
			resourceType: filters.resourceType,
			search: filters.search,
			startDate: filters.startDate ? new Date(filters.startDate) : undefined,
			endDate: filters.endDate ? new Date(filters.endDate) : undefined,
			page: filters.page,
			pageSize: 50,
		});

		return { success: true, data: result };
	} catch {
		return { success: false, error: "Failed to load audit log." };
	}
}

export async function getAuditLogFiltersAction(): Promise<
	ActionResult<{
		actions: string[];
		users: { userId: string | null; userName: string | null }[];
	}>
> {
	try {
		const { workspace } = await requireRole("admin");
		const [actions, users] = await Promise.all([
			getAuditLogActions(workspace.id),
			getAuditLogUsers(workspace.id),
		]);
		return { success: true, data: { actions, users } };
	} catch {
		return { success: false, error: "Failed to load filters." };
	}
}

export async function exportAuditLogCsvAction(
	filters: AuditLogFilters,
): Promise<ActionResult<string>> {
	try {
		const { workspace } = await requireRole("admin");

		if (workspace.plan !== "team") {
			return {
				success: false,
				error: "Audit log export requires a Team plan.",
			};
		}

		const result = await getAuditLog({
			workspaceId: workspace.id,
			userId: filters.userId,
			action: filters.action,
			search: filters.search,
			page: 1,
			pageSize: 10000,
		});

		const headers = [
			"Timestamp",
			"User",
			"Action",
			"Resource Type",
			"Resource Name",
			"Details",
		];
		const rows = result.entries.map((e) => [
			e.createdAt.toISOString(),
			csvEscape(e.userName ?? "Unknown"),
			e.action,
			e.resourceType,
			csvEscape(e.resourceName ?? ""),
			csvEscape(e.details ? JSON.stringify(e.details) : ""),
		]);

		const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
		return { success: true, data: csv };
	} catch {
		return { success: false, error: "Failed to export audit log." };
	}
}

function csvEscape(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}
