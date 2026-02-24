"use server";

import { generateObject } from "ai";
import { z } from "zod/v4";
import { checkAnalysisQuota } from "@/lib/ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/types";

export interface ExpertAnnotation {
	original: string;
	replacement: string;
	explanation: string;
	technique: string;
}

export interface ExpertRewriteResult {
	expertText: string;
	annotations: ExpertAnnotation[];
	overallApproach: string;
}

const expertRewriteSchema = z.object({
	expertText: z
		.string()
		.describe("The complete expert-level rewrite of the prompt"),
	annotations: z
		.array(
			z.object({
				original: z
					.string()
					.describe("The original text segment that was changed"),
				replacement: z.string().describe("The new text that replaced it"),
				explanation: z.string().describe("Why this change improves the prompt"),
				technique: z
					.string()
					.describe(
						"The prompt engineering technique applied (e.g., 'Few-shot examples', 'Chain-of-thought', 'Role definition', 'Output formatting', 'Constraint setting', 'Context grounding')",
					),
			}),
		)
		.describe("Annotations explaining each significant change"),
	overallApproach: z
		.string()
		.describe(
			"A 1-2 sentence summary of the expert's overall approach and strategy",
		),
});

export async function expertRewriteAction(
	templateText: string,
): Promise<ActionResult<ExpertRewriteResult>> {
	try {
		const { workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month).`,
			};
		}

		const model = getModel("claude-sonnet-4-6-20250514");

		const { object } = await generateObject({
			model,
			schema: expertRewriteSchema,
			system: `You are a world-class prompt engineer tasked with rewriting a user's prompt to expert quality.

Your rewrite should:
1. Apply proven prompt engineering techniques (few-shot examples, chain-of-thought, role definition, structured output formatting)
2. Improve clarity, specificity, and completeness
3. Add appropriate constraints and guardrails
4. Structure the prompt for optimal AI performance
5. Preserve the user's intent while dramatically improving quality

For each significant change, provide an annotation explaining:
- What was changed and why
- Which specific technique was applied
- How this improves the prompt's effectiveness

Be thorough but practical — the rewrite should be immediately usable, not theoretical.`,
			prompt: `Rewrite this prompt as an expert prompt engineer would:\n\n${templateText}`,
			maxOutputTokens: 4096,
			temperature: 0.3,
		});

		return {
			success: true,
			data: {
				expertText: object.expertText,
				annotations: object.annotations,
				overallApproach: object.overallApproach,
			},
		};
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to generate expert rewrite";
		return { success: false, error: message };
	}
}
