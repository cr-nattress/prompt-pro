"use server";

import { generateText } from "ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import { checkAndAwardPathBadges } from "@/lib/badges/badge-checker";
import { LEARNING_PATHS } from "@/lib/data/learning-paths";
import {
	completeLesson,
	getPathProgressSummary,
} from "@/lib/db/queries/learning-progress";
import type { ActionResult } from "@/types";

export async function completeLessonAction(
	pathSlug: string,
	lessonSlug: string,
): Promise<ActionResult<null>> {
	try {
		const { user } = await requireAuth();
		await completeLesson(user.id, pathSlug, lessonSlug);

		// Check for path completion badges
		const path = LEARNING_PATHS.find((p) => p.slug === pathSlug);
		if (path) {
			const progressMap = await getPathProgressSummary(user.id);
			const completed = progressMap.get(pathSlug) ?? 0;
			await checkAndAwardPathBadges(
				user.id,
				pathSlug,
				completed,
				path.lessons.length,
			);
		}

		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to mark lesson as complete." };
	}
}

export async function evaluateExerciseAction(
	exerciseText: string,
	criteria: string[],
): Promise<
	ActionResult<{
		passed: boolean;
		feedback: string;
	}>
> {
	try {
		await requireAuth();

		const criteriaList = criteria.map((c, i) => `${i + 1}. ${c}`).join("\n");

		const { text } = await generateText({
			model: getModel(),
			temperature: 0.3,
			maxOutputTokens: 800,
			system: `You are a prompt engineering instructor evaluating a student's exercise submission. Be encouraging but honest. Provide specific, actionable feedback.

Your response MUST follow this exact format:
PASSED: true or false
FEEDBACK: your detailed feedback here (2-4 sentences)`,
			prompt: `Evaluate this prompt against the following criteria:

Criteria:
${criteriaList}

Student's prompt:
---
${exerciseText}
---

Assess whether the prompt meets ALL criteria. A prompt passes only if it satisfactorily addresses every criterion. Be specific about what's good and what could improve.`,
		});

		const passedMatch = text.match(/PASSED:\s*(true|false)/i);
		const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/i);

		const passed = passedMatch?.[1]?.toLowerCase() === "true";
		const feedback =
			feedbackMatch?.[1]?.trim() ??
			"Your prompt was evaluated. Please review the criteria and try again.";

		return { success: true, data: { passed, feedback } };
	} catch {
		return { success: false, error: "Failed to evaluate exercise." };
	}
}
