"use client";

import { ArrowRight, Puzzle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	PATTERN_CATEGORIES,
	PROMPT_PATTERNS,
} from "@/lib/data/prompt-patterns";
import { LearnSearch } from "./learn-search";

const CATEGORY_COLORS: Record<string, string> = {
	reasoning: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	structure: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
	output: "bg-green-500/10 text-green-600 dark:text-green-400",
	meta: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function PatternGrid() {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const filtered = PROMPT_PATTERNS.filter((p) => {
		const matchesSearch =
			p.title.toLowerCase().includes(search.toLowerCase()) ||
			p.description.toLowerCase().includes(search.toLowerCase());
		const matchesCategory =
			activeCategory === null || p.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="flex flex-col gap-6">
			<LearnSearch
				placeholder="Search patterns..."
				basePath="/learn/patterns"
				onSearch={setSearch}
			/>

			<div className="flex flex-wrap gap-2">
				<Badge
					variant={activeCategory === null ? "default" : "outline"}
					className="cursor-pointer"
					onClick={() => setActiveCategory(null)}
				>
					All
				</Badge>
				{PATTERN_CATEGORIES.map((cat) => (
					<Badge
						key={cat.value}
						variant={activeCategory === cat.value ? "default" : "outline"}
						className={`cursor-pointer ${activeCategory === cat.value ? "" : (CATEGORY_COLORS[cat.value] ?? "")}`}
						onClick={() =>
							setActiveCategory(activeCategory === cat.value ? null : cat.value)
						}
					>
						{cat.label}
					</Badge>
				))}
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				{filtered.map((pattern) => (
					<Link key={pattern.slug} href={`/learn/patterns/${pattern.slug}`}>
						<Card className="h-full transition-colors hover:border-primary/50">
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="flex items-center gap-2 text-base">
										<Puzzle className="h-4 w-4 shrink-0 text-primary" />
										{pattern.title}
									</CardTitle>
									<Badge
										variant="outline"
										className={`shrink-0 text-xs ${CATEGORY_COLORS[pattern.category] ?? ""}`}
									>
										{pattern.category}
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<CardDescription className="line-clamp-2">
									{pattern.description}
								</CardDescription>
								<span className="mt-3 inline-flex items-center gap-1 text-primary text-xs">
									View template <ArrowRight className="h-3 w-3" />
								</span>
							</CardContent>
						</Card>
					</Link>
				))}
				{filtered.length === 0 && (
					<p className="col-span-2 py-8 text-center text-muted-foreground text-sm">
						No patterns match your search.
					</p>
				)}
			</div>
		</div>
	);
}
