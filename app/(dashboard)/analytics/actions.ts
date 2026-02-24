"use server";

import { resolveLogsToCsv, usageMetricsToCsv } from "@/lib/analytics-export";
import { requireAuth } from "@/lib/auth";
import {
	getAnalyticsSummary,
	getLatencyPercentiles,
	getResolveLogsForExport,
	getResolvesByApp,
	getResolvesByVersion,
	getResolveVolume,
	getTopResolvedPrompts,
	getUsageHeatmap,
	getUsageMetricsForExport,
} from "@/lib/db/queries/resolve-logs";
import type { ActionResult } from "@/types";

type Granularity = "day" | "week" | "month";

interface AnalyticsFilters {
	from: string; // ISO date string
	to: string;
	granularity?: Granularity | undefined;
	promptId?: string | undefined;
}

function parseDateRange(filters: AnalyticsFilters) {
	return {
		from: new Date(filters.from),
		to: new Date(filters.to),
	};
}

export async function getResolveVolumeAction(
	filters: AnalyticsFilters,
): Promise<ActionResult<{ date: string; count: number }[]>> {
	try {
		const { workspace } = await requireAuth();
		const range = parseDateRange(filters);
		const data = await getResolveVolume(
			workspace.id,
			range,
			filters.granularity ?? "day",
		);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load resolve volume." };
	}
}

export async function getTopPromptsAction(filters: AnalyticsFilters): Promise<
	ActionResult<
		{
			promptId: string;
			promptName: string;
			promptSlug: string;
			count: number;
		}[]
	>
> {
	try {
		const { workspace } = await requireAuth();
		const range = parseDateRange(filters);
		const data = await getTopResolvedPrompts(workspace.id, range);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load top prompts." };
	}
}

export async function getResolvesByAppAction(
	filters: AnalyticsFilters,
): Promise<ActionResult<{ appId: string; appName: string; count: number }[]>> {
	try {
		const { workspace } = await requireAuth();
		const range = parseDateRange(filters);
		const data = await getResolvesByApp(workspace.id, range);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load resolves by app." };
	}
}

export async function getResolvesByVersionAction(
	filters: AnalyticsFilters,
): Promise<
	ActionResult<
		{
			versionId: string;
			version: number;
			promptName: string;
			count: number;
		}[]
	>
> {
	try {
		const { workspace } = await requireAuth();
		const range = parseDateRange(filters);
		const data = await getResolvesByVersion(
			workspace.id,
			range,
			filters.promptId,
		);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load resolves by version." };
	}
}

export async function getLatencyAction(
	filters: AnalyticsFilters,
): Promise<
	ActionResult<
		{ date: string; p50: number; p95: number; p99: number; count: number }[]
	>
> {
	try {
		const { workspace } = await requireAuth();
		const range = parseDateRange(filters);
		const data = await getLatencyPercentiles(
			workspace.id,
			range,
			filters.granularity ?? "day",
		);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load latency data." };
	}
}

export async function getHeatmapAction(
	filters: AnalyticsFilters,
): Promise<ActionResult<{ dayOfWeek: number; hour: number; count: number }[]>> {
	try {
		const { workspace } = await requireAuth();
		const range = parseDateRange(filters);
		const data = await getUsageHeatmap(workspace.id, range);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load heatmap data." };
	}
}

export async function getAnalyticsSummaryAction(filters: {
	from: string;
	to: string;
}): Promise<
	ActionResult<{
		totalResolves: number;
		avgLatencyMs: number;
		p95LatencyMs: number;
		uniquePrompts: number;
	}>
> {
	try {
		const { workspace } = await requireAuth();
		const range = parseDateRange(filters);
		const data = await getAnalyticsSummary(workspace.id, range);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load analytics summary." };
	}
}

export async function exportResolveLogsAction(
	filters: AnalyticsFilters,
): Promise<ActionResult<{ csv: string; filename: string }>> {
	try {
		const { workspace } = await requireAuth();
		if (workspace.plan === "free") {
			return { success: false, error: "Export requires a Pro or Team plan." };
		}
		const range = parseDateRange(filters);
		const rows = await getResolveLogsForExport(workspace.id, range);
		const csv = resolveLogsToCsv(rows);
		const filename = `resolve-logs-${filters.from}-${filters.to}.csv`;
		return { success: true, data: { csv, filename } };
	} catch {
		return { success: false, error: "Failed to export resolve logs." };
	}
}

export async function exportUsageMetricsAction(
	filters: AnalyticsFilters,
): Promise<ActionResult<{ csv: string; filename: string }>> {
	try {
		const { workspace } = await requireAuth();
		if (workspace.plan === "free") {
			return {
				success: false,
				error: "Export requires a Pro or Team plan.",
			};
		}
		const range = parseDateRange(filters);
		const rows = await getUsageMetricsForExport(workspace.id, range);
		const csv = usageMetricsToCsv(rows);
		const filename = `usage-metrics-${filters.from}-${filters.to}.csv`;
		return { success: true, data: { csv, filename } };
	} catch {
		return { success: false, error: "Failed to export usage metrics." };
	}
}
