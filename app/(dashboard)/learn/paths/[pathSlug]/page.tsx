import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningPathDetail } from "@/components/learn/learning-path-detail";
import { requireAuth } from "@/lib/auth";
import { getLearningPath } from "@/lib/data/learning-paths";
import { getCompletedLessons } from "@/lib/db/queries/learning-progress";

interface PathPageProps {
	params: Promise<{ pathSlug: string }>;
}

export async function generateMetadata({
	params,
}: PathPageProps): Promise<Metadata> {
	const { pathSlug } = await params;
	const path = getLearningPath(pathSlug);
	return { title: path?.title ?? "Learning Path" };
}

export default async function PathDetailPage({ params }: PathPageProps) {
	const { pathSlug } = await params;
	const path = getLearningPath(pathSlug);
	if (!path) notFound();

	const { user } = await requireAuth();
	const rows = await getCompletedLessons(user.id, pathSlug);
	const completedLessons = new Set(rows.map((r) => r.lessonSlug));

	return <LearningPathDetail path={path} completedLessons={completedLessons} />;
}
