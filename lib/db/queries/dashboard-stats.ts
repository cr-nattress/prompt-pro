import { and, avg, count, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	analyses,
	contextBlueprints,
	promptTemplates,
	resolveLogs,
} from "@/lib/db/schema";

export interface DashboardStats {
	totalPrompts: number;
	totalBlueprints: number;
	averageScore: number | null;
	resolvesThisMonth: number;
}

export async function getDashboardStats(
	workspaceId: string,
): Promise<DashboardStats> {
	const [prompts, blueprints, scoreResult, resolves] = await Promise.all([
		db
			.select({ total: count() })
			.from(promptTemplates)
			.where(eq(promptTemplates.workspaceId, workspaceId)),

		db
			.select({ total: count() })
			.from(contextBlueprints)
			.where(eq(contextBlueprints.workspaceId, workspaceId)),

		db
			.select({ avg: avg(analyses.overallScore) })
			.from(analyses)
			.innerJoin(promptTemplates, eq(analyses.promptId, promptTemplates.id))
			.where(eq(promptTemplates.workspaceId, workspaceId)),

		getResolvesThisMonth(workspaceId),
	]);

	const avgScore = scoreResult[0]?.avg;

	return {
		totalPrompts: prompts[0]?.total ?? 0,
		totalBlueprints: blueprints[0]?.total ?? 0,
		averageScore: avgScore ? Number.parseFloat(avgScore) : null,
		resolvesThisMonth: resolves,
	};
}

async function getResolvesThisMonth(workspaceId: string): Promise<number> {
	const startOfMonth = new Date();
	startOfMonth.setDate(1);
	startOfMonth.setHours(0, 0, 0, 0);

	const result = await db
		.select({ total: count() })
		.from(resolveLogs)
		.where(
			and(
				gte(resolveLogs.resolvedAt, startOfMonth),
				sql`${resolveLogs.apiKeyId} IN (
					SELECT id FROM prompt_vault.api_keys
					WHERE workspace_id = ${workspaceId}
				)`,
			),
		);

	return result[0]?.total ?? 0;
}

export interface RecentItem {
	id: string;
	name: string;
	type: "prompt" | "blueprint";
	slug: string;
	appSlug: string;
	updatedAt: Date;
	score: number | null;
}

export async function getRecentItems(
	workspaceId: string,
	limit = 5,
): Promise<RecentItem[]> {
	// Fetch recent prompts and blueprints, merge and sort
	const [recentPrompts, recentBlueprints] = await Promise.all([
		db.execute<{
			id: string;
			name: string;
			slug: string;
			app_slug: string;
			updated_at: Date;
			overall_score: number | null;
		}>(sql`
			SELECT pt.id, pt.name, pt.slug, a.slug AS app_slug, pt.updated_at,
				(SELECT an.overall_score FROM prompt_vault.analyses an
				 WHERE an.prompt_id = pt.id ORDER BY an.created_at DESC LIMIT 1) AS overall_score
			FROM prompt_vault.prompt_templates pt
			JOIN prompt_vault.apps a ON a.id = pt.app_id
			WHERE pt.workspace_id = ${workspaceId}
			ORDER BY pt.updated_at DESC
			LIMIT ${limit}
		`),

		db.execute<{
			id: string;
			name: string;
			slug: string;
			app_slug: string;
			updated_at: Date;
			overall_score: number | null;
		}>(sql`
			SELECT cb.id, cb.name, cb.slug, a.slug AS app_slug, cb.updated_at,
				(SELECT an.overall_score FROM prompt_vault.analyses an
				 WHERE an.blueprint_id = cb.id ORDER BY an.created_at DESC LIMIT 1) AS overall_score
			FROM prompt_vault.context_blueprints cb
			JOIN prompt_vault.apps a ON a.id = cb.app_id
			WHERE cb.workspace_id = ${workspaceId}
			ORDER BY cb.updated_at DESC
			LIMIT ${limit}
		`),
	]);

	const items: RecentItem[] = [
		...recentPrompts.map((r) => ({
			id: r.id,
			name: r.name,
			type: "prompt" as const,
			slug: r.slug,
			appSlug: r.app_slug,
			updatedAt: new Date(r.updated_at),
			score: r.overall_score,
		})),
		...recentBlueprints.map((r) => ({
			id: r.id,
			name: r.name,
			type: "blueprint" as const,
			slug: r.slug,
			appSlug: r.app_slug,
			updatedAt: new Date(r.updated_at),
			score: r.overall_score,
		})),
	];

	items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
	return items.slice(0, limit);
}
