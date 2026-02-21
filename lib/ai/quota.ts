import { and, count, gte, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import type { WorkspacePlan } from "@/types";

const LIMITS: Record<WorkspacePlan, number> = {
	free: 5,
	pro: 100,
	team: 500,
};

export function getAnalysisLimit(plan: WorkspacePlan): number {
	return LIMITS[plan];
}

/**
 * Count analyses created this calendar month for the given workspace.
 * Analyses are linked to prompts/blueprints which belong to a workspace,
 * so we JOIN through prompt_templates and context_blueprints.
 */
export async function getAnalysisCountThisMonth(
	workspaceId: string,
): Promise<number> {
	const startOfMonth = new Date();
	startOfMonth.setDate(1);
	startOfMonth.setHours(0, 0, 0, 0);

	const result = await db
		.select({ total: count() })
		.from(analyses)
		.where(
			and(
				gte(analyses.createdAt, startOfMonth),
				or(
					sql`${analyses.promptId} IN (SELECT id FROM prompt_vault.prompt_templates WHERE workspace_id = ${workspaceId})`,
					sql`${analyses.blueprintId} IN (SELECT id FROM prompt_vault.context_blueprints WHERE workspace_id = ${workspaceId})`,
				),
			),
		);

	return result[0]?.total ?? 0;
}

export async function checkAnalysisQuota(
	workspaceId: string,
	plan: WorkspacePlan,
): Promise<{ allowed: boolean; used: number; limit: number }> {
	const limit = getAnalysisLimit(plan);
	const used = await getAnalysisCountThisMonth(workspaceId);

	return {
		allowed: used < limit,
		used,
		limit,
	};
}
