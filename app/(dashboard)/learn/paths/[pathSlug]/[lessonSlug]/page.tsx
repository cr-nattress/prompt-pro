import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPage } from "@/components/learn/lesson-page";
import { requireAuth } from "@/lib/auth";
import { getLearningPath, getLesson } from "@/lib/data/learning-paths";
import { isLessonCompleted } from "@/lib/db/queries/learning-progress";
import { completeLessonAction, evaluateExerciseAction } from "../../actions";

interface LessonPageProps {
	params: Promise<{ pathSlug: string; lessonSlug: string }>;
}

export async function generateMetadata({
	params,
}: LessonPageProps): Promise<Metadata> {
	const { pathSlug, lessonSlug } = await params;
	const lesson = getLesson(pathSlug, lessonSlug);
	return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonRoute({ params }: LessonPageProps) {
	const { pathSlug, lessonSlug } = await params;
	const path = getLearningPath(pathSlug);
	if (!path) notFound();

	const lesson = path.lessons.find((l) => l.slug === lessonSlug);
	if (!lesson) notFound();

	const lessonIndex = path.lessons.indexOf(lesson);

	const { user } = await requireAuth();
	const completed = await isLessonCompleted(user.id, pathSlug, lessonSlug);

	return (
		<LessonPage
			path={path}
			lesson={lesson}
			lessonIndex={lessonIndex}
			isCompleted={completed}
			onComplete={completeLessonAction}
			onEvaluate={evaluateExerciseAction}
		/>
	);
}
