"use client";

import { useMemo } from "react";
import { dismissLessonAction } from "@/app/(dashboard)/learn/actions";
import { MicroLessonCard } from "@/components/education/micro-lesson-card";
import { MICRO_LESSONS } from "@/lib/data/micro-lessons";

interface DashboardLessonProps {
	dismissedLessons: string[];
	totalPrompts: number;
}

export function DashboardLesson({
	dismissedLessons,
	totalPrompts,
}: DashboardLessonProps) {
	const lesson = useMemo(() => {
		const candidates = MICRO_LESSONS.filter(
			(l) => !dismissedLessons.includes(l.id) && l.category === "general",
		);

		// Simple priority: show general tips first
		if (
			totalPrompts === 0 &&
			candidates.find((c) => c.id === "first-analysis")
		) {
			return null; // No lesson if user has no prompts yet
		}

		return candidates[0] ?? null;
	}, [dismissedLessons, totalPrompts]);

	if (!lesson) return null;

	async function handleDismiss(lessonId: string) {
		await dismissLessonAction(lessonId);
	}

	return (
		<MicroLessonCard
			id={lesson.id}
			title={lesson.title}
			body={lesson.body}
			learnMoreSlug={lesson.learnMoreSlug}
			onDismiss={handleDismiss}
		/>
	);
}
