import type { Metadata } from "next";
import { LearningPathList } from "@/components/learn/learning-path-list";
import { requireAuth } from "@/lib/auth";
import { LEARNING_PATHS } from "@/lib/data/learning-paths";
import { getPathProgressSummary } from "@/lib/db/queries/learning-progress";
import { getUserSkillProfile } from "@/lib/db/queries/skill-profile";

export const metadata: Metadata = { title: "Learning Paths" };

export default async function LearningPathsPage() {
	const { user } = await requireAuth();
	const [progressMap, skillProfile] = await Promise.all([
		getPathProgressSummary(user.id),
		getUserSkillProfile(user.id),
	]);

	// Determine which paths are fully completed (for prerequisite gating)
	const completedPaths = new Set<string>();
	for (const path of LEARNING_PATHS) {
		const done = progressMap.get(path.slug) ?? 0;
		if (done >= path.lessons.length) {
			completedPaths.add(path.slug);
		}
	}

	return (
		<LearningPathList
			paths={LEARNING_PATHS}
			progressMap={progressMap}
			completedPaths={completedPaths}
			skillProfile={skillProfile}
		/>
	);
}
