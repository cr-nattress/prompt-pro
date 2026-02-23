import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { apps, promptTemplates } from "@/lib/db/schema";
import type { WorkspacePlan } from "@/types";
import { PLAN_LIMITS } from "./limits";

export interface GatingResult {
	allowed: boolean;
	current: number;
	limit: number;
	limitLabel: string;
}

export async function checkPromptLimit(
	workspaceId: string,
	plan: WorkspacePlan,
): Promise<GatingResult> {
	const limits = PLAN_LIMITS[plan];
	if (limits.maxPrompts === -1) {
		return { allowed: true, current: 0, limit: -1, limitLabel: "Unlimited" };
	}

	const result = await db
		.select({ total: count() })
		.from(promptTemplates)
		.where(eq(promptTemplates.workspaceId, workspaceId));

	const current = result[0]?.total ?? 0;
	return {
		allowed: current < limits.maxPrompts,
		current,
		limit: limits.maxPrompts,
		limitLabel: limits.maxPrompts.toLocaleString(),
	};
}

export async function checkAppLimit(
	workspaceId: string,
	plan: WorkspacePlan,
): Promise<GatingResult> {
	const limits = PLAN_LIMITS[plan];
	if (limits.maxApps === -1) {
		return { allowed: true, current: 0, limit: -1, limitLabel: "Unlimited" };
	}

	const result = await db
		.select({ total: count() })
		.from(apps)
		.where(eq(apps.workspaceId, workspaceId));

	const current = result[0]?.total ?? 0;
	return {
		allowed: current < limits.maxApps,
		current,
		limit: limits.maxApps,
		limitLabel: limits.maxApps.toLocaleString(),
	};
}
