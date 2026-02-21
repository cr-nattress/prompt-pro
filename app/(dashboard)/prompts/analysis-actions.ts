"use server";

import type { EnhancePromptResult } from "@/lib/ai";
import { analyzePrompt, checkAnalysisQuota, enhancePrompt } from "@/lib/ai";
import { requireAuth } from "@/lib/auth";
import { createAnalysis, getLatestAnalysis } from "@/lib/db/queries/analyses";
import type { Analysis } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

export async function analyzePromptAction(
	promptId: string,
	templateText: string,
	metadata?: { name?: string; purpose?: string; description?: string },
): Promise<ActionResult<Analysis>> {
	try {
		const { workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month). Upgrade your plan for more analyses.`,
			};
		}

		const result = await analyzePrompt(templateText, metadata);

		const analysis = await createAnalysis({
			promptId,
			clarity: result.scores.clarity,
			specificity: result.scores.specificity,
			contextAdequacy: result.scores.contextAdequacy,
			roleDefinition: result.scores.roleDefinition,
			constraintQuality: result.scores.constraintQuality,
			exampleUsage: result.scores.exampleUsage,
			errorHandling: result.scores.errorHandling,
			outputFormatting: result.scores.outputFormatting,
			tokenEfficiency: result.scores.tokenEfficiency,
			safetyAlignment: result.scores.safetyAlignment,
			taskDecomposition: result.scores.taskDecomposition,
			creativityScope: result.scores.creativityScope,
			overallScore: result.overallScore,
			weaknesses: result.weaknesses,
			suggestions: result.suggestions,
		});

		return { success: true, data: analysis };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to analyze prompt";
		return { success: false, error: message };
	}
}

export async function enhancePromptAction(
	_promptId: string,
	templateText: string,
	weaknesses?: string[],
	suggestions?: string[],
): Promise<ActionResult<EnhancePromptResult>> {
	try {
		const { workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month). Upgrade your plan for more analyses.`,
			};
		}

		const result = await enhancePrompt(templateText, weaknesses, suggestions);

		return { success: true, data: result };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to enhance prompt";
		return { success: false, error: message };
	}
}

export async function getLatestAnalysisAction(
	promptId: string,
): Promise<ActionResult<Analysis | null>> {
	try {
		await requireAuth();
		const analysis = await getLatestAnalysis(promptId);
		return { success: true, data: analysis };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch analysis";
		return { success: false, error: message };
	}
}
