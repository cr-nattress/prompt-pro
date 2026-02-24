"use client";

import {
	ArrowLeft,
	Award,
	CheckCircle2,
	Eye,
	Loader2,
	Send,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
	type ChallengeResult,
	submitChallengeAction,
} from "@/app/(dashboard)/learn/challenges/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import type { Challenge } from "@/lib/data/challenges";
import { cn } from "@/lib/utils";

interface ChallengeWorkspaceProps {
	challenge: Challenge;
	bestScore: number | null;
}

export function ChallengeWorkspace({
	challenge,
	bestScore,
}: ChallengeWorkspaceProps) {
	const [promptText, setPromptText] = useState("");
	const [result, setResult] = useState<ChallengeResult | null>(null);
	const [showExpert, setShowExpert] = useState(false);
	const [isSubmitting, startTransition] = useTransition();

	function handleSubmit() {
		if (!promptText.trim()) return;
		startTransition(async () => {
			const res = await submitChallengeAction(challenge.slug, promptText);
			if (res.success) {
				setResult(res.data);
			}
		});
	}

	return (
		<div className="space-y-6">
			{/* Back link */}
			<Link
				href="/learn/challenges"
				className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				All Challenges
			</Link>

			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="font-semibold text-2xl tracking-tight">
						{challenge.title}
					</h1>
					<div className="mt-1 flex items-center gap-2">
						<Badge variant="secondary">{challenge.difficulty}</Badge>
						<Badge variant="outline">{challenge.category}</Badge>
						<Badge>{challenge.xpReward} XP</Badge>
					</div>
				</div>
				{bestScore !== null && (
					<div className="text-right">
						<p className="text-muted-foreground text-xs">Best Score</p>
						<p className="font-bold text-2xl">{bestScore}</p>
					</div>
				)}
			</div>

			{/* Scenario */}
			<Card>
				<CardContent className="p-4">
					<h2 className="mb-2 font-medium text-sm">Scenario</h2>
					<p className="text-sm">{challenge.scenario}</p>
				</CardContent>
			</Card>

			{/* Requirements */}
			<Card>
				<CardContent className="p-4">
					<h2 className="mb-2 font-medium text-sm">Requirements</h2>
					<ul className="space-y-1.5">
						{challenge.requirements.map((req) => (
							<li key={req} className="flex items-start gap-2 text-sm">
								<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
								{req}
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			{/* Editor */}
			<div>
				<h2 className="mb-2 font-medium text-sm">Your Prompt</h2>
				<Textarea
					value={promptText}
					onChange={(e) => setPromptText(e.target.value)}
					placeholder="Write your best prompt for this challenge..."
					rows={12}
					className="font-mono text-sm"
				/>
				<div className="mt-2 flex items-center justify-between">
					<p className="text-muted-foreground text-xs">
						{promptText.length > 0
							? `${promptText.split(/\s+/).filter(Boolean).length} words`
							: "Start writing..."}
					</p>
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting || !promptText.trim()}
					>
						{isSubmitting ? (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						) : (
							<Send className="mr-1.5 h-3.5 w-3.5" />
						)}
						{isSubmitting ? "Evaluating..." : "Submit"}
					</Button>
				</div>
			</div>

			{/* Results */}
			{result && (
				<Card>
					<CardContent className="space-y-4 p-4">
						<div className="flex items-center justify-between">
							<h2 className="font-medium">Results</h2>
							<div className="flex items-center gap-2">
								<Award className="h-5 w-5 text-amber-500" />
								<span
									className={cn(
										"font-bold text-2xl",
										result.score >= 70
											? "text-emerald-600"
											: result.score >= 40
												? "text-amber-600"
												: "text-red-600",
									)}
								>
									{result.score}
								</span>
								<span className="text-muted-foreground text-sm">/100</span>
							</div>
						</div>

						{/* Strengths */}
						{result.strengths.length > 0 && (
							<div>
								<h3 className="mb-1.5 flex items-center gap-1.5 font-medium text-emerald-600 text-sm dark:text-emerald-400">
									<CheckCircle2 className="h-4 w-4" />
									Strengths
								</h3>
								<ul className="space-y-1">
									{result.strengths.map((s) => (
										<li key={s} className="text-sm">
											{s}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Gaps */}
						{result.gaps.length > 0 && (
							<div>
								<h3 className="mb-1.5 flex items-center gap-1.5 font-medium text-red-600 text-sm dark:text-red-400">
									<XCircle className="h-4 w-4" />
									Gaps
								</h3>
								<ul className="space-y-1">
									{result.gaps.map((g) => (
										<li key={g} className="text-sm">
											{g}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Feedback */}
						{result.feedback && (
							<div className="rounded-md border bg-muted/30 p-3">
								<p className="text-sm">{result.feedback}</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Expert solution */}
			<Collapsible open={showExpert} onOpenChange={setShowExpert}>
				<CollapsibleTrigger asChild>
					<Button variant="outline" className="w-full">
						<Eye className="mr-1.5 h-3.5 w-3.5" />
						{showExpert ? "Hide" : "Show"} Expert Solution
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent className="mt-3 space-y-3">
					<pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 font-mono text-sm">
						{challenge.expertSolution}
					</pre>
					{challenge.expertAnnotations.length > 0 && (
						<Card>
							<CardContent className="p-4">
								<h3 className="mb-2 font-medium text-sm">Why this works</h3>
								<ul className="space-y-1.5">
									{challenge.expertAnnotations.map((annotation) => (
										<li
											key={annotation}
											className="flex items-start gap-2 text-sm"
										>
											<CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
											{annotation}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
