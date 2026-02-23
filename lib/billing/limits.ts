import type { WorkspacePlan } from "@/types";

export interface PlanLimits {
	/** Display name for the plan */
	label: string;
	/** Monthly price in USD (0 for free) */
	priceMonthly: number;
	/** Maximum prompts per workspace */
	maxPrompts: number;
	/** Maximum apps per workspace */
	maxApps: number;
	/** AI analyses per calendar month */
	analysesPerMonth: number;
	/** API requests per minute */
	apiRatePerMinute: number;
	/** API requests per calendar month */
	apiRatePerMonth: number;
	/** Maximum team members (1 = owner only) */
	maxMembers: number;
}

export const PLAN_LIMITS: Record<WorkspacePlan, PlanLimits> = {
	free: {
		label: "Free",
		priceMonthly: 0,
		maxPrompts: 25,
		maxApps: 3,
		analysesPerMonth: 5,
		apiRatePerMinute: 10,
		apiRatePerMonth: 500,
		maxMembers: 1,
	},
	pro: {
		label: "Pro",
		priceMonthly: 19,
		maxPrompts: 500,
		maxApps: 25,
		analysesPerMonth: 100,
		apiRatePerMinute: 60,
		apiRatePerMonth: 10_000,
		maxMembers: 5,
	},
	team: {
		label: "Team",
		priceMonthly: 49,
		maxPrompts: -1, // unlimited
		maxApps: -1,
		analysesPerMonth: 500,
		apiRatePerMinute: 300,
		apiRatePerMonth: 100_000,
		maxMembers: -1,
	},
};

export function getPlanLimits(plan: WorkspacePlan): PlanLimits {
	return PLAN_LIMITS[plan];
}

export function formatLimit(value: number): string {
	if (value === -1) return "Unlimited";
	return value.toLocaleString();
}
