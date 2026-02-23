"use server";

import { generateText } from "ai";
import type { EnhancePromptResult } from "@/lib/ai";
import { analyzePrompt, checkAnalysisQuota, enhancePrompt } from "@/lib/ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import { createAnalysis, getLatestAnalysis } from "@/lib/db/queries/analyses";
import {
	getCurrentWeekStart,
	getOrCreateWeeklyProgress,
	getRecentAnalysesForUser,
	incrementWeeklyCounter,
	updateUserSkillProfile,
} from "@/lib/db/queries/skill-profile";
import type { Analysis } from "@/lib/db/schema";
import { computeSkillProfile } from "@/lib/skills/skill-profile";
import type { ActionResult } from "@/types";

export async function analyzePromptAction(
	promptId: string,
	templateText: string,
	metadata?: { name?: string; purpose?: string; description?: string },
): Promise<ActionResult<Analysis>> {
	try {
		const { user, workspace } = await requireAuth();

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

		// Update skill profile & weekly progress (non-blocking)
		updateSkillProfileAfterAnalysis(user.id, workspace.id).catch(() => {
			// Silently ignore — skill profile update is best-effort
		});

		return { success: true, data: analysis };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to analyze prompt";
		return { success: false, error: message };
	}
}

async function updateSkillProfileAfterAnalysis(
	userId: string,
	workspaceId: string,
) {
	const recentAnalyses = await getRecentAnalysesForUser(workspaceId);
	const profile = computeSkillProfile(recentAnalyses);
	await updateUserSkillProfile(userId, profile);

	// Update weekly progress
	const weekStart = getCurrentWeekStart();
	await getOrCreateWeeklyProgress(userId, weekStart, profile);
	await incrementWeeklyCounter(userId, weekStart, "analysesRun");
}

export async function enhancePromptAction(
	_promptId: string,
	templateText: string,
	weaknesses?: string[],
	suggestions?: string[],
): Promise<ActionResult<EnhancePromptResult>> {
	try {
		const { user, workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month). Upgrade your plan for more analyses.`,
			};
		}

		const result = await enhancePrompt(templateText, weaknesses, suggestions);

		// Increment weekly counter (non-blocking)
		const weekStart = getCurrentWeekStart();
		getOrCreateWeeklyProgressIfProfile(user.id, weekStart)
			.then(() => incrementWeeklyCounter(user.id, weekStart, "promptsImproved"))
			.catch(() => {});

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

export interface CompressResult {
	compressedText: string;
	originalTokens: number;
	compressedTokens: number;
	savings: number;
}

export async function compressPromptAction(
	templateText: string,
): Promise<ActionResult<CompressResult>> {
	try {
		const { workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month).`,
			};
		}

		const model = getModel("claude-sonnet-4-20250514");

		const { text } = await generateText({
			model,
			system: `You are an expert prompt compressor. Your task is to compress the given prompt to use fewer tokens while preserving all meaning, intent, and effectiveness.

Rules:
- Remove redundant phrases and filler words
- Simplify verbose instructions without losing clarity
- Merge overlapping constraints
- Use concise phrasing where possible
- Preserve all examples, variables (like {{param}}), and structural elements
- Do NOT change the meaning or remove any actual requirements
- Output ONLY the compressed prompt text, nothing else`,
			prompt: templateText,
			maxOutputTokens: 4096,
			temperature: 0.2,
		});

		const originalTokens = Math.ceil(templateText.length / 4);
		const compressedTokens = Math.ceil(text.length / 4);
		const savings = originalTokens - compressedTokens;

		return {
			success: true,
			data: {
				compressedText: text.trim(),
				originalTokens,
				compressedTokens,
				savings,
			},
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to compress prompt";
		return { success: false, error: message };
	}
}

/** Ensure weekly row exists for the current user before incrementing. */
async function getOrCreateWeeklyProgressIfProfile(
	userId: string,
	weekStart: string,
) {
	const { getUserSkillProfile } = await import(
		"@/lib/db/queries/skill-profile"
	);
	const profile = await getUserSkillProfile(userId);
	if (profile) {
		await getOrCreateWeeklyProgress(userId, weekStart, profile);
	}
}
