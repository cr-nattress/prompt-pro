"use server";

import { analyzeBlueprint, checkAnalysisQuota } from "@/lib/ai";
import { requireAuth } from "@/lib/auth";
import {
	createAnalysis,
	getLatestBlueprintAnalysis,
} from "@/lib/db/queries/analyses";
import type { Analysis } from "@/lib/db/schema";
import type { ActionResult } from "@/types";

interface BlockInput {
	slug: string;
	name: string;
	type: string;
	content: string | null;
	position: number;
	isRequired: boolean;
	isConditional: boolean;
	condition: string | null;
}

interface BlueprintMetadata {
	name?: string;
	description?: string;
	targetLlm?: string;
	totalTokenBudget?: number;
}

export async function analyzeBlueprintAction(
	blueprintId: string,
	blocks: BlockInput[],
	metadata?: BlueprintMetadata,
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

		const result = await analyzeBlueprint(blocks, metadata);

		// Map blueprint analysis scores to DB columns:
		// sufficiency→clarity, relevance→specificity, grounding→contextAdequacy,
		// coherence→roleDefinition, placement→constraintQuality,
		// budgetEfficiency→tokenEfficiency, adaptability→errorHandling
		const analysis = await createAnalysis({
			blueprintId,
			clarity: result.scores.sufficiency,
			specificity: result.scores.relevance,
			contextAdequacy: result.scores.grounding,
			roleDefinition: result.scores.coherence,
			constraintQuality: result.scores.placement,
			tokenEfficiency: result.scores.budgetEfficiency,
			errorHandling: result.scores.adaptability,
			overallScore: result.overallScore,
			weaknesses: result.weaknesses,
			suggestions: result.suggestions,
			// Store block feedback as enhanced prompt text (JSON serialized)
			enhancedPromptText: JSON.stringify(result.blockFeedback),
		});

		return { success: true, data: analysis };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to analyze blueprint";
		return { success: false, error: message };
	}
}

export async function getLatestBlueprintAnalysisAction(
	blueprintId: string,
): Promise<ActionResult<Analysis | null>> {
	try {
		await requireAuth();
		const analysis = await getLatestBlueprintAnalysis(blueprintId);
		return { success: true, data: analysis };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch analysis";
		return { success: false, error: message };
	}
}
