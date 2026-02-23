"use server";

import { requireAuth } from "@/lib/auth";
import { dismissLesson } from "@/lib/db/queries/users";
import type { ActionResult } from "@/types";

export async function dismissLessonAction(
	lessonId: string,
): Promise<ActionResult<{ dismissed: boolean }>> {
	try {
		const { user } = await requireAuth();
		await dismissLesson(user.id, lessonId);
		return { success: true, data: { dismissed: true } };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to dismiss lesson";
		return { success: false, error: message };
	}
}
