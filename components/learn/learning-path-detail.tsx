import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LearningPath } from "@/lib/data/learning-paths";

interface LearningPathDetailProps {
	path: LearningPath;
	completedLessons: Set<string>;
}

const DIFFICULTY_COLORS: Record<string, string> = {
	beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
	intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export function LearningPathDetail({
	path,
	completedLessons,
}: LearningPathDetailProps) {
	const completed = completedLessons.size;
	const total = path.lessons.length;
	const percent = total > 0 ? (completed / total) * 100 : 0;
	const totalMinutes = path.lessons.reduce(
		(sum, l) => sum + l.estimatedMinutes,
		0,
	);

	// Find the next incomplete lesson
	const nextLesson = path.lessons.find((l) => !completedLessons.has(l.slug));

	return (
		<div className="space-y-6">
			{/* Back nav */}
			<Button variant="ghost" size="sm" asChild>
				<Link href="/learn/paths">
					<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
					All Paths
				</Link>
			</Button>

			{/* Header */}
			<div>
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-xl">{path.title}</h2>
					<Badge
						variant="outline"
						className={DIFFICULTY_COLORS[path.difficulty] ?? ""}
					>
						{path.difficulty}
					</Badge>
				</div>
				<p className="mt-1 text-muted-foreground text-sm">{path.description}</p>
			</div>

			{/* Progress bar */}
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="flex items-center gap-1.5 text-muted-foreground">
								<Clock className="h-4 w-4" />~{totalMinutes} minutes total
							</span>
							<span className="font-medium tabular-nums">
								{completed}/{total} completed
							</span>
						</div>
						<Progress value={percent} className="h-2" />
					</div>

					{nextLesson && (
						<div className="mt-4">
							<Button asChild>
								<Link href={`/learn/paths/${path.slug}/${nextLesson.slug}`}>
									{completed === 0 ? "Start Path" : "Continue"}
								</Link>
							</Button>
						</div>
					)}

					{completed >= total && (
						<div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400">
							<CheckCircle2 className="h-5 w-5" />
							<span className="font-medium text-sm">Path completed!</span>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Lesson list */}
			<div className="space-y-2">
				<h3 className="font-medium text-sm">Lessons</h3>
				<div className="space-y-1">
					{path.lessons.map((lesson, index) => {
						const isCompleted = completedLessons.has(lesson.slug);

						return (
							<Link
								key={lesson.slug}
								href={`/learn/paths/${path.slug}/${lesson.slug}`}
								className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
							>
								{isCompleted ? (
									<CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
								) : (
									<Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
								)}
								<div className="min-w-0 flex-1">
									<p className="font-medium text-sm">
										{index + 1}. {lesson.title}
									</p>
									<p className="truncate text-muted-foreground text-xs">
										~{lesson.estimatedMinutes} min
									</p>
								</div>
								{isCompleted && (
									<Badge
										variant="outline"
										className="bg-green-500/10 text-green-600 text-xs dark:text-green-400"
									>
										Done
									</Badge>
								)}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
