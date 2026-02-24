/**
 * CSV export utilities for analytics data.
 */

function escapeField(value: string | number | null | undefined): string {
	if (value == null) return "";
	const str = String(value);
	if (str.includes(",") || str.includes('"') || str.includes("\n")) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function toCsvRow(fields: (string | number | null | undefined)[]): string {
	return fields.map(escapeField).join(",");
}

export interface ResolveLogExportRow {
	resolvedAt: string;
	promptName: string;
	promptSlug: string;
	version: number;
	appName: string;
	latencyMs: number | null;
}

export function resolveLogsToCsv(rows: ResolveLogExportRow[]): string {
	const header = toCsvRow([
		"Resolved At",
		"Prompt Name",
		"Prompt Slug",
		"Version",
		"App Name",
		"Latency (ms)",
	]);
	const body = rows.map((r) =>
		toCsvRow([
			r.resolvedAt,
			r.promptName,
			r.promptSlug,
			r.version,
			r.appName,
			r.latencyMs,
		]),
	);
	return [header, ...body].join("\n");
}

export interface UsageMetricsExportRow {
	date: string;
	totalResolves: number;
	uniquePrompts: number;
	avgLatencyMs: number;
	p95LatencyMs: number;
}

export function usageMetricsToCsv(rows: UsageMetricsExportRow[]): string {
	const header = toCsvRow([
		"Date",
		"Total Resolves",
		"Unique Prompts",
		"Avg Latency (ms)",
		"P95 Latency (ms)",
	]);
	const body = rows.map((r) =>
		toCsvRow([
			r.date,
			r.totalResolves,
			r.uniquePrompts,
			r.avgLatencyMs,
			r.p95LatencyMs,
		]),
	);
	return [header, ...body].join("\n");
}
