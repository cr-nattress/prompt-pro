import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	apiKeys,
	apps,
	type NewResolveLog,
	promptTemplates,
	promptVersions,
	resolveLogs,
} from "@/lib/db/schema";

export async function createResolveLog(data: NewResolveLog) {
	const result = await db.insert(resolveLogs).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

// ── Analytics queries ──────────────────────────────────────────────────

interface DateRange {
	from: Date;
	to: Date;
}

type Granularity = "day" | "week" | "month";

function workspaceAndDateFilters(workspaceId: string, range: DateRange) {
	return and(
		eq(apiKeys.workspaceId, workspaceId),
		gte(resolveLogs.resolvedAt, range.from),
		lte(resolveLogs.resolvedAt, range.to),
	);
}

/**
 * Resolve volume over time, grouped by day/week/month.
 */
export async function getResolveVolume(
	workspaceId: string,
	range: DateRange,
	granularity: Granularity = "day",
) {
	const truncExpr =
		granularity === "week"
			? sql`date_trunc('week', ${resolveLogs.resolvedAt})`
			: granularity === "month"
				? sql`date_trunc('month', ${resolveLogs.resolvedAt})`
				: sql`date_trunc('day', ${resolveLogs.resolvedAt})`;

	const rows = await db
		.select({
			bucket: truncExpr.mapWith(String).as("bucket"),
			count: count().as("count"),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.where(workspaceAndDateFilters(workspaceId, range))
		.groupBy(truncExpr)
		.orderBy(truncExpr);

	return rows.map((r) => ({
		date: r.bucket,
		count: r.count,
	}));
}

/**
 * Top resolved prompts, ranked by count.
 */
export async function getTopResolvedPrompts(
	workspaceId: string,
	range: DateRange,
	limit = 10,
) {
	const rows = await db
		.select({
			promptId: promptTemplates.id,
			promptName: promptTemplates.name,
			promptSlug: promptTemplates.slug,
			count: count().as("count"),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.innerJoin(
			promptVersions,
			eq(resolveLogs.promptVersionId, promptVersions.id),
		)
		.innerJoin(
			promptTemplates,
			eq(promptVersions.promptTemplateId, promptTemplates.id),
		)
		.where(workspaceAndDateFilters(workspaceId, range))
		.groupBy(promptTemplates.id, promptTemplates.name, promptTemplates.slug)
		.orderBy(desc(count()))
		.limit(limit);

	return rows;
}

/**
 * Resolves grouped by app.
 */
export async function getResolvesByApp(workspaceId: string, range: DateRange) {
	const rows = await db
		.select({
			appId: apps.id,
			appName: apps.name,
			count: count().as("count"),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.innerJoin(apps, eq(apiKeys.appId, apps.id))
		.where(workspaceAndDateFilters(workspaceId, range))
		.groupBy(apps.id, apps.name)
		.orderBy(desc(count()));

	return rows;
}

/**
 * Resolves grouped by prompt version.
 */
export async function getResolvesByVersion(
	workspaceId: string,
	range: DateRange,
	promptId?: string | undefined,
) {
	const conditions = [workspaceAndDateFilters(workspaceId, range)];
	if (promptId) {
		conditions.push(eq(promptTemplates.id, promptId));
	}

	const rows = await db
		.select({
			versionId: promptVersions.id,
			version: promptVersions.version,
			promptName: promptTemplates.name,
			count: count().as("count"),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.innerJoin(
			promptVersions,
			eq(resolveLogs.promptVersionId, promptVersions.id),
		)
		.innerJoin(
			promptTemplates,
			eq(promptVersions.promptTemplateId, promptTemplates.id),
		)
		.where(and(...conditions))
		.groupBy(promptVersions.id, promptVersions.version, promptTemplates.name)
		.orderBy(desc(count()))
		.limit(20);

	return rows;
}

/**
 * Latency percentiles (P50, P95, P99) over time.
 */
export async function getLatencyPercentiles(
	workspaceId: string,
	range: DateRange,
	granularity: Granularity = "day",
) {
	const truncExpr =
		granularity === "week"
			? sql`date_trunc('week', ${resolveLogs.resolvedAt})`
			: granularity === "month"
				? sql`date_trunc('month', ${resolveLogs.resolvedAt})`
				: sql`date_trunc('day', ${resolveLogs.resolvedAt})`;

	const rows = await db
		.select({
			bucket: truncExpr.mapWith(String).as("bucket"),
			p50: sql<number>`percentile_cont(0.5) within group (order by ${resolveLogs.latencyMs})`.as(
				"p50",
			),
			p95: sql<number>`percentile_cont(0.95) within group (order by ${resolveLogs.latencyMs})`.as(
				"p95",
			),
			p99: sql<number>`percentile_cont(0.99) within group (order by ${resolveLogs.latencyMs})`.as(
				"p99",
			),
			count: count().as("count"),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.where(
			and(
				workspaceAndDateFilters(workspaceId, range),
				sql`${resolveLogs.latencyMs} is not null`,
			),
		)
		.groupBy(truncExpr)
		.orderBy(truncExpr);

	return rows.map((r) => ({
		date: r.bucket,
		p50: Math.round(r.p50 ?? 0),
		p95: Math.round(r.p95 ?? 0),
		p99: Math.round(r.p99 ?? 0),
		count: r.count,
	}));
}

/**
 * Usage heatmap: day-of-week (0-6) × hour-of-day (0-23).
 */
export async function getUsageHeatmap(workspaceId: string, range: DateRange) {
	const rows = await db
		.select({
			dayOfWeek: sql<number>`extract(dow from ${resolveLogs.resolvedAt})`.as(
				"day_of_week",
			),
			hour: sql<number>`extract(hour from ${resolveLogs.resolvedAt})`.as(
				"hour",
			),
			count: count().as("count"),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.where(workspaceAndDateFilters(workspaceId, range))
		.groupBy(
			sql`extract(dow from ${resolveLogs.resolvedAt})`,
			sql`extract(hour from ${resolveLogs.resolvedAt})`,
		);

	return rows.map((r) => ({
		dayOfWeek: Number(r.dayOfWeek),
		hour: Number(r.hour),
		count: r.count,
	}));
}

/**
 * Summary stats for the dashboard header.
 */
/**
 * Export-oriented query: raw resolve logs joined with prompt/app names.
 */
export async function getResolveLogsForExport(
	workspaceId: string,
	range: DateRange,
	limit = 10000,
) {
	const rows = await db
		.select({
			resolvedAt: resolveLogs.resolvedAt,
			promptName: promptTemplates.name,
			promptSlug: promptTemplates.slug,
			version: promptVersions.version,
			appName: apps.name,
			latencyMs: resolveLogs.latencyMs,
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.innerJoin(apps, eq(apiKeys.appId, apps.id))
		.innerJoin(
			promptVersions,
			eq(resolveLogs.promptVersionId, promptVersions.id),
		)
		.innerJoin(
			promptTemplates,
			eq(promptVersions.promptTemplateId, promptTemplates.id),
		)
		.where(workspaceAndDateFilters(workspaceId, range))
		.orderBy(desc(resolveLogs.resolvedAt))
		.limit(limit);

	return rows.map((r) => ({
		resolvedAt: r.resolvedAt.toISOString(),
		promptName: r.promptName,
		promptSlug: r.promptSlug,
		version: r.version,
		appName: r.appName,
		latencyMs: r.latencyMs,
	}));
}

/**
 * Export-oriented query: usage metrics aggregated by day.
 */
export async function getUsageMetricsForExport(
	workspaceId: string,
	range: DateRange,
) {
	const truncExpr = sql`date_trunc('day', ${resolveLogs.resolvedAt})`;

	const rows = await db
		.select({
			bucket: truncExpr.mapWith(String).as("bucket"),
			totalResolves: count().as("total_resolves"),
			uniquePrompts:
				sql<number>`count(distinct ${resolveLogs.promptVersionId})`.as(
					"unique_prompts",
				),
			avgLatencyMs: sql<number>`round(avg(${resolveLogs.latencyMs}))`.as(
				"avg_latency_ms",
			),
			p95LatencyMs:
				sql<number>`percentile_cont(0.95) within group (order by ${resolveLogs.latencyMs})`.as(
					"p95_latency_ms",
				),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.where(workspaceAndDateFilters(workspaceId, range))
		.groupBy(truncExpr)
		.orderBy(truncExpr);

	return rows.map((r) => ({
		date: r.bucket,
		totalResolves: r.totalResolves,
		uniquePrompts: Number(r.uniquePrompts),
		avgLatencyMs: Math.round(Number(r.avgLatencyMs ?? 0)),
		p95LatencyMs: Math.round(Number(r.p95LatencyMs ?? 0)),
	}));
}

/**
 * Summary stats for the dashboard header.
 */
export async function getAnalyticsSummary(
	workspaceId: string,
	range: DateRange,
) {
	const [totalResult] = await db
		.select({ count: count().as("count") })
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.where(workspaceAndDateFilters(workspaceId, range));

	const [latencyResult] = await db
		.select({
			avgLatency: sql<number>`round(avg(${resolveLogs.latencyMs}))`.as(
				"avg_latency",
			),
			p95: sql<number>`percentile_cont(0.95) within group (order by ${resolveLogs.latencyMs})`.as(
				"p95",
			),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.where(
			and(
				workspaceAndDateFilters(workspaceId, range),
				sql`${resolveLogs.latencyMs} is not null`,
			),
		);

	const [uniquePromptsResult] = await db
		.select({
			count: sql<number>`count(distinct ${resolveLogs.promptVersionId})`.as(
				"count",
			),
		})
		.from(resolveLogs)
		.innerJoin(apiKeys, eq(resolveLogs.apiKeyId, apiKeys.id))
		.where(workspaceAndDateFilters(workspaceId, range));

	return {
		totalResolves: totalResult?.count ?? 0,
		avgLatencyMs: Math.round(Number(latencyResult?.avgLatency ?? 0)),
		p95LatencyMs: Math.round(Number(latencyResult?.p95 ?? 0)),
		uniquePrompts: Number(uniquePromptsResult?.count ?? 0),
	};
}
