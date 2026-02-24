"use client";

import { Award, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	CHALLENGE_CATEGORIES,
	CHALLENGES,
	type ChallengeDifficulty,
} from "@/lib/data/challenges";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLORS: Record<ChallengeDifficulty, string> = {
	beginner:
		"bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
	intermediate:
		"bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
	advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function ChallengeGrid() {
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

	const filtered = CHALLENGES.filter((c) => {
		if (categoryFilter !== "all" && c.category !== categoryFilter) {
			return false;
		}
		if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) {
			return false;
		}
		return true;
	});

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-2">
				<Filter className="h-4 w-4 text-muted-foreground" />
				<div className="flex gap-1">
					<Button
						size="sm"
						variant={categoryFilter === "all" ? "default" : "outline"}
						onClick={() => setCategoryFilter("all")}
					>
						All
					</Button>
					{CHALLENGE_CATEGORIES.map((cat) => (
						<Button
							key={cat.value}
							size="sm"
							variant={categoryFilter === cat.value ? "default" : "outline"}
							onClick={() => setCategoryFilter(cat.value)}
						>
							{cat.label}
						</Button>
					))}
				</div>
				<div className="ml-2 flex gap-1">
					{(["all", "beginner", "intermediate", "advanced"] as const).map(
						(d) => (
							<Button
								key={d}
								size="sm"
								variant={difficultyFilter === d ? "default" : "outline"}
								onClick={() => setDifficultyFilter(d)}
							>
								{d === "all"
									? "All Levels"
									: d.charAt(0).toUpperCase() + d.slice(1)}
							</Button>
						),
					)}
				</div>
			</div>

			{/* Challenge cards */}
			{filtered.length === 0 ? (
				<div className="flex flex-col items-center gap-3 py-12 text-center">
					<Award className="h-8 w-8 text-muted-foreground" />
					<p className="text-muted-foreground text-sm">
						No challenges match your filters
					</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((challenge) => (
						<Link
							key={challenge.slug}
							href={`/learn/challenges/${challenge.slug}`}
						>
							<Card className="h-full transition-colors hover:bg-muted/50">
								<CardContent className="p-4">
									<div className="mb-2 flex items-start justify-between">
										<h3 className="line-clamp-1 font-medium text-sm">
											{challenge.title}
										</h3>
										<Badge className="ml-2 shrink-0 text-xs">
											{challenge.xpReward} XP
										</Badge>
									</div>
									<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
										{challenge.description}
									</p>
									<div className="flex items-center gap-1.5">
										<Badge
											variant="secondary"
											className={cn(
												"text-xs",
												DIFFICULTY_COLORS[challenge.difficulty],
											)}
										>
											{challenge.difficulty}
										</Badge>
										<Badge variant="outline" className="text-xs">
											{CHALLENGE_CATEGORIES.find(
												(c) => c.value === challenge.category,
											)?.label ?? challenge.category}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
