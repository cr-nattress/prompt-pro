"use client";

import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	Lightbulb,
	Loader2,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { LearningPath, Lesson } from "@/lib/data/learning-paths";
import { showToast } from "@/lib/toast";

interface LessonPageProps {
	path: LearningPath;
	lesson: Lesson;
	lessonIndex: number;
	isCompleted: boolean;
	onComplete: (
		pathSlug: string,
		lessonSlug: string,
	) => Promise<{ success: boolean; error?: string }>;
	onEvaluate: (
		exerciseText: string,
		criteria: string[],
	) => Promise<{
		success: boolean;
		data?: { passed: boolean; feedback: string };
		error?: string;
	}>;
}

export function LessonPage({
	path,
	lesson,
	lessonIndex,
	isCompleted,
	onComplete,
	onEvaluate,
}: LessonPageProps) {
	const [exerciseText, setExerciseText] = useState(
		lesson.exercise.starterPrompt,
	);
	const [feedback, setFeedback] = useState<{
		passed: boolean;
		feedback: string;
	} | null>(null);
	const [completed, setCompleted] = useState(isCompleted);
	const [isPending, startTransition] = useTransition();
	const [isEvaluating, setIsEvaluating] = useState(false);

	const nextLesson = path.lessons[lessonIndex + 1];
	const prevLesson = lessonIndex > 0 ? path.lessons[lessonIndex - 1] : null;

	async function handleEvaluate() {
		if (!exerciseText.trim()) return;
		setIsEvaluating(true);
		const result = await onEvaluate(
			exerciseText,
			lesson.exercise.evaluationCriteria,
		);
		setIsEvaluating(false);

		if (result.success && result.data) {
			setFeedback(result.data);
			if (result.data.passed && !completed) {
				startTransition(async () => {
					const completeResult = await onComplete(path.slug, lesson.slug);
					if (completeResult.success) {
						setCompleted(true);
						showToast("success", "Lesson completed!");
					}
				});
			}
		} else {
			showToast("error", result.error ?? "Failed to evaluate exercise");
		}
	}

	function handleMarkComplete() {
		startTransition(async () => {
			const result = await onComplete(path.slug, lesson.slug);
			if (result.success) {
				setCompleted(true);
				showToast("success", "Lesson completed!");
			} else {
				showToast("error", result.error ?? "Failed to mark as complete");
			}
		});
	}

	return (
		<div className="space-y-6">
			{/* Navigation */}
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href={`/learn/paths/${path.slug}`}>
						<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
						{path.title}
					</Link>
				</Button>
				<span className="text-muted-foreground text-xs">
					Lesson {lessonIndex + 1} of {path.lessons.length}
				</span>
			</div>

			{/* Title */}
			<div>
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-xl">{lesson.title}</h2>
					{completed && <CheckCircle2 className="h-5 w-5 text-green-500" />}
				</div>
				<p className="mt-1 text-muted-foreground text-sm">
					~{lesson.estimatedMinutes} minutes
				</p>
			</div>

			{/* Concept explanation */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base">
						<Lightbulb className="h-4 w-4 text-primary" />
						Concept
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
						{lesson.concept}
					</div>
				</CardContent>
			</Card>

			{/* Before/After example */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card className="border-red-500/20">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm text-red-600 dark:text-red-400">
							Before
						</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
							{lesson.beforeExample}
						</pre>
					</CardContent>
				</Card>
				<Card className="border-green-500/20">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm text-green-600 dark:text-green-400">
							After
						</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
							{lesson.afterExample}
						</pre>
					</CardContent>
				</Card>
			</div>

			{/* Key takeaway */}
			<div className="rounded-md border bg-primary/5 p-4">
				<p className="font-medium text-sm">Key Takeaway</p>
				<p className="mt-1 text-muted-foreground text-sm">
					{lesson.keyTakeaway}
				</p>
			</div>

			{/* Exercise */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base">
						<Sparkles className="h-4 w-4 text-primary" />
						Exercise
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm">{lesson.exercise.instruction}</p>

					<div>
						<p className="mb-1 text-muted-foreground text-xs">
							Evaluation criteria:
						</p>
						<ul className="space-y-0.5">
							{lesson.exercise.evaluationCriteria.map((criterion) => (
								<li
									key={criterion}
									className="flex items-start gap-1.5 text-muted-foreground text-xs"
								>
									<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
									{criterion}
								</li>
							))}
						</ul>
					</div>

					<Textarea
						value={exerciseText}
						onChange={(e) => setExerciseText(e.target.value)}
						rows={10}
						className="font-mono text-sm"
						placeholder="Write your improved prompt here..."
					/>

					<div className="flex items-center gap-2">
						<Button
							onClick={handleEvaluate}
							disabled={isEvaluating || !exerciseText.trim()}
						>
							{isEvaluating ? (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							) : (
								<Sparkles className="mr-1.5 h-3.5 w-3.5" />
							)}
							Check My Work
						</Button>
						{!completed && (
							<Button
								variant="outline"
								onClick={handleMarkComplete}
								disabled={isPending}
							>
								{isPending ? (
									<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
								) : (
									<CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
								)}
								Skip & Mark Complete
							</Button>
						)}
					</div>

					{/* Feedback */}
					{feedback && (
						<div
							className={`rounded-md border p-4 ${
								feedback.passed
									? "border-green-500/30 bg-green-500/5"
									: "border-amber-500/30 bg-amber-500/5"
							}`}
						>
							<div className="mb-2 flex items-center gap-2">
								{feedback.passed ? (
									<Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
										Passed
									</Badge>
								) : (
									<Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
										Try Again
									</Badge>
								)}
							</div>
							<p className="whitespace-pre-wrap text-sm">{feedback.feedback}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Navigation */}
			<div className="flex items-center justify-between border-t pt-4">
				{prevLesson ? (
					<Button variant="outline" size="sm" asChild>
						<Link href={`/learn/paths/${path.slug}/${prevLesson.slug}`}>
							<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
							Previous
						</Link>
					</Button>
				) : (
					<div />
				)}
				{nextLesson ? (
					<Button size="sm" asChild>
						<Link href={`/learn/paths/${path.slug}/${nextLesson.slug}`}>
							Next Lesson
							<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
						</Link>
					</Button>
				) : (
					<Button size="sm" asChild>
						<Link href={`/learn/paths/${path.slug}`}>Back to Path</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
