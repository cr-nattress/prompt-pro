"use client";

import {
	AlertTriangle,
	ArrowRight,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Lightbulb,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	SHOWCASE_CATEGORIES,
	SHOWCASE_ENTRIES,
	type ShowcaseEntry,
} from "@/lib/data/before-after-showcases";

const CATEGORY_COLORS: Record<string, string> = {
	"customer-support": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	content: "bg-green-500/10 text-green-600 dark:text-green-400",
	"data-analysis": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
	coding: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	"creative-writing": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function ShowcaseCard({ entry }: { entry: ShowcaseEntry }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div>
						<CardTitle className="text-base">{entry.title}</CardTitle>
						<CardDescription className="mt-1">
							{entry.improvement}
						</CardDescription>
					</div>
					<Badge
						variant="outline"
						className={CATEGORY_COLORS[entry.category] ?? ""}
					>
						{entry.categoryLabel}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{/* Before/After preview */}
					<div className="grid gap-3 md:grid-cols-2">
						<div className="rounded-md border border-red-500/20 bg-red-500/5 p-3">
							<div className="mb-2 flex items-center gap-1.5">
								<AlertTriangle className="h-3.5 w-3.5 text-red-500" />
								<span className="font-medium text-red-600 text-xs dark:text-red-400">
									Before
								</span>
							</div>
							<pre className="whitespace-pre-wrap font-mono text-muted-foreground text-xs leading-relaxed">
								{entry.beforePrompt}
							</pre>
						</div>
						<div className="rounded-md border border-green-500/20 bg-green-500/5 p-3">
							<div className="mb-2 flex items-center gap-1.5">
								<CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
								<span className="font-medium text-green-600 text-xs dark:text-green-400">
									After
								</span>
							</div>
							<pre className="max-h-32 overflow-hidden whitespace-pre-wrap font-mono text-xs leading-relaxed">
								{expanded
									? entry.afterPrompt
									: `${entry.afterPrompt.slice(0, 200)}...`}
							</pre>
						</div>
					</div>

					{/* Expand/collapse */}
					<Button
						variant="ghost"
						size="sm"
						className="w-full"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<>
								<ChevronUp className="mr-1.5 h-3.5 w-3.5" />
								Show less
							</>
						) : (
							<>
								<ChevronDown className="mr-1.5 h-3.5 w-3.5" />
								Show full transformation
							</>
						)}
					</Button>

					{/* Expanded details */}
					{expanded && (
						<div className="space-y-3 border-t pt-3">
							{/* Problems */}
							<div>
								<div className="mb-1.5 flex items-center gap-1.5">
									<AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
									<span className="font-medium text-sm">
										Problems Identified
									</span>
								</div>
								<ul className="space-y-1">
									{entry.problems.map((problem) => (
										<li
											key={problem}
											className="flex items-start gap-2 text-muted-foreground text-xs"
										>
											<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
											{problem}
										</li>
									))}
								</ul>
							</div>

							{/* Techniques */}
							<div>
								<div className="mb-1.5 flex items-center gap-1.5">
									<Lightbulb className="h-3.5 w-3.5 text-primary" />
									<span className="font-medium text-sm">
										Techniques Applied
									</span>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{entry.techniques.map((technique) => (
										<Badge
											key={technique}
											variant="secondary"
											className="text-xs"
										>
											{technique}
										</Badge>
									))}
								</div>
							</div>

							{/* Full after prompt */}
							<div>
								<div className="mb-1.5 flex items-center gap-1.5">
									<CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
									<span className="font-medium text-sm">Expert Version</span>
								</div>
								<pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 font-mono text-xs leading-relaxed">
									{entry.afterPrompt}
								</pre>
							</div>

							{/* CTA */}
							<Button variant="outline" size="sm" asChild>
								<Link href="/prompts/new?mode=guided">
									<Sparkles className="mr-1.5 h-3.5 w-3.5" />
									Try this pattern on your prompts
									<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
								</Link>
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export function BeforeAfterShowcase() {
	const [activeCategory, setActiveCategory] = useState("all");

	const filtered =
		activeCategory === "all"
			? SHOWCASE_ENTRIES
			: SHOWCASE_ENTRIES.filter((e) => e.category === activeCategory);

	return (
		<div className="space-y-4">
			<div>
				<h2 className="font-semibold text-lg">Before & After Showcase</h2>
				<p className="text-muted-foreground text-sm">
					See how expert prompt engineering transforms mediocre prompts into
					high-performing ones.
				</p>
			</div>

			{/* Category filter */}
			<div className="flex flex-wrap gap-1.5">
				{SHOWCASE_CATEGORIES.map((cat) => (
					<Button
						key={cat.value}
						variant={activeCategory === cat.value ? "default" : "outline"}
						size="sm"
						onClick={() => setActiveCategory(cat.value)}
					>
						{cat.label}
					</Button>
				))}
			</div>

			{/* Entries */}
			<div className="space-y-4">
				{filtered.map((entry) => (
					<ShowcaseCard key={entry.id} entry={entry} />
				))}
			</div>
		</div>
	);
}
