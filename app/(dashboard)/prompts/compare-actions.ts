"use server";

import { generateText } from "ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/types";

export interface VersionInsight {
	summary: string;
	assessment: "positive" | "neutral" | "negative" | "mixed";
	details: string[];
}

export async function explainVersionChangesAction(
	oldText: string,
	newText: string,
): Promise<ActionResult<VersionInsight>> {
	try {
		await requireAuth();

		const { text } = await generateText({
			model: getModel("claude-sonnet-4-6-20250514"),
			temperature: 0.3,
			maxOutputTokens: 1024,
			system: `You are a prompt engineering expert analyzing changes between two versions of a prompt.

Your response MUST follow this exact format:
SUMMARY: [1-2 sentence plain-language summary of what changed]
ASSESSMENT: positive | neutral | negative | mixed
DETAILS:
- [specific change 1 and its impact]
- [specific change 2 and its impact]
- [specific change 3 and its impact]`,
			prompt: `Analyze the changes between these two prompt versions:

PREVIOUS VERSION:
---
${oldText}
---

NEW VERSION:
---
${newText}
---

Explain what changed and assess whether the changes are likely improvements.`,
		});

		const summaryMatch = text.match(/SUMMARY:\s*(.+)/);
		const assessmentMatch = text.match(
			/ASSESSMENT:\s*(positive|neutral|negative|mixed)/i,
		);
		const detailsMatch = text.match(/DETAILS:\n([\s\S]*?)$/);

		const summary =
			summaryMatch?.[1]?.trim() ?? "Changes were made to the prompt.";
		const assessment = (assessmentMatch?.[1]?.toLowerCase().trim() ??
			"neutral") as VersionInsight["assessment"];
		const details = detailsMatch?.[1]
			? detailsMatch[1]
					.split("\n")
					.map((line) => line.replace(/^-\s*/, "").trim())
					.filter(Boolean)
			: [];

		return { success: true, data: { summary, assessment, details } };
	} catch {
		return { success: false, error: "Failed to analyze version changes." };
	}
}
