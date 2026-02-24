"use client";

import { CheckCircle2, ChevronRight, Clock, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LearningPath } from "@/lib/data/learning-paths";
import { checkPathAccess } from "@/lib/skills/content-gating";
import type { SkillProfile } from "@/lib/skills/skill-profile";

interface LearningPathListProps {
	paths: LearningPath[];
	progressMap: Map<string, number>;
	completedPaths: Set<string>;
	skillProfile?: SkillProfile | null | undefined;
}

const DIFFICULTY_COLORS: Record<string, string> = {
	beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
	intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export function LearningPathList({
	paths,
	progressMap,
	completedPaths,
	skillProfile,
}: LearningPathListProps) {
	return (
		<div className="space-y-4">
			<div>
				<h2 className="font-semibold text-lg">Learning Paths</h2>
				<p className="text-muted-foreground text-sm">
					Structured courses to systematically improve your skills.
				</p>
			</div>

			<div className="grid gap-4">
				{paths.map((path) => {
					const completed = progressMap.get(path.slug) ?? 0;
					const total = path.lessons.length;
					const percent = total > 0 ? (completed / total) * 100 : 0;
					const isComplete = completed >= total;
					const access = checkPathAccess(
						path,
						skillProfile ?? null,
						completedPaths,
					);
					const isLocked = access.isLocked;
					const totalMinutes = path.lessons.reduce(
						(sum, l) => sum + l.estimatedMinutes,
						0,
					);

					return (
						<Link
							key={path.slug}
							href={isLocked ? "#" : `/learn/paths/${path.slug}`}
							className={isLocked ? "pointer-events-none opacity-60" : ""}
						>
							<Card className="transition-colors hover:border-primary/50">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2">
											{isComplete ? (
												<CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
											) : isLocked ? (
												<Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
											) : (
												<ChevronRight className="h-5 w-5 shrink-0 text-primary" />
											)}
											<CardTitle className="text-base">{path.title}</CardTitle>
										</div>
										<Badge
											variant="outline"
											className={DIFFICULTY_COLORS[path.difficulty] ?? ""}
										>
											{path.difficulty}
										</Badge>
									</div>
									<CardDescription>
										{path.description}
										{isLocked && access.reason && (
											<span className="mt-1 block text-amber-600 text-xs dark:text-amber-400">
												{access.reason}
											</span>
										)}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex items-center justify-between text-xs">
											<span className="flex items-center gap-1 text-muted-foreground">
												<Clock className="h-3 w-3" />~{totalMinutes} min
											</span>
											<span className="font-medium tabular-nums">
												{completed}/{total} lessons
											</span>
										</div>
										<Progress value={percent} className="h-1.5" />
									</div>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
