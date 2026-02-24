"use server";

import { generateText } from "ai";
import { checkAnalysisQuota } from "@/lib/ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import { checkAndAwardChallengeBadges } from "@/lib/badges/badge-checker";
import { getChallenge } from "@/lib/data/challenges";
import {
	createChallengeSubmission,
	getUserCompletedChallenges,
} from "@/lib/db/queries/challenge-submissions";
import type { ActionResult } from "@/types";

export interface ChallengeResult {
	score: number;
	strengths: string[];
	gaps: string[];
	feedback: string;
}

export async function submitChallengeAction(
	challengeSlug: string,
	promptText: string,
): Promise<ActionResult<ChallengeResult>> {
	try {
		const { user, workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month).`,
			};
		}

		const challenge = getChallenge(challengeSlug);
		if (!challenge) {
			return { success: false, error: "Challenge not found." };
		}

		const { text } = await generateText({
			model: getModel("claude-sonnet-4-6-20250514"),
			temperature: 0.2,
			maxOutputTokens: 2000,
			system: `You are a prompt engineering evaluator. Score a user's prompt submission against specific challenge criteria. Be fair but rigorous.

Your response MUST follow this exact format:
SCORE: [0-100]

STRENGTHS:
- [strength 1]
- [strength 2]
- [strength 3]

GAPS:
- [gap 1]
- [gap 2]

FEEDBACK:
[2-3 sentences of constructive feedback explaining the score and suggesting improvements]`,
			prompt: `Evaluate this prompt submission for the challenge: "${challenge.title}"

Challenge requirements:
${challenge.requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Evaluation criteria:
${challenge.evaluationCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

User's prompt submission:
---
${promptText}
---

Score this prompt on a 0-100 scale based on how well it meets the requirements and evaluation criteria.`,
		});

		const scoreMatch = text.match(/SCORE:\s*(\d+)/);
		const strengthsMatch = text.match(
			/STRENGTHS:\n([\s\S]*?)(?:\nGAPS:|\nFEEDBACK:|$)/,
		);
		const gapsMatch = text.match(/GAPS:\n([\s\S]*?)(?:\nFEEDBACK:|$)/);
		const feedbackMatch = text.match(/FEEDBACK:\n([\s\S]*?)$/);

		const score = Math.min(100, Math.max(0, Number(scoreMatch?.[1]) || 0));
		const strengths = parseListItems(strengthsMatch?.[1] ?? "");
		const gaps = parseListItems(gapsMatch?.[1] ?? "");
		const feedback = feedbackMatch?.[1]?.trim() ?? "";

		// Save submission
		await createChallengeSubmission({
			userId: user.id,
			challengeSlug,
			promptText,
			score,
			strengths,
			gaps,
			feedback,
		});

		// Check and award badges
		const completed = await getUserCompletedChallenges(user.id);
		const passingCount = completed.filter(
			(c) => (c.bestScore ?? 0) >= 70,
		).length;
		await checkAndAwardChallengeBadges(user.id, score, passingCount);

		return {
			success: true,
			data: { score, strengths, gaps, feedback },
		};
	} catch {
		return { success: false, error: "Failed to evaluate submission." };
	}
}

function parseListItems(text: string): string[] {
	return text
		.split("\n")
		.map((line) => line.replace(/^-\s*/, "").trim())
		.filter(Boolean);
}
