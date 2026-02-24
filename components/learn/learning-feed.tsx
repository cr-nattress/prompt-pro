"use client";

import { ArrowRight, Lightbulb, Sparkles, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { FeedItem } from "@/lib/data/learning-feed";

interface LearningFeedProps {
	items: FeedItem[];
}

const TYPE_CONFIG: Record<
	FeedItem["type"],
	{ icon: typeof Star; label: string; color: string }
> = {
	showcase: {
		icon: Sparkles,
		label: "Showcase",
		color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
	},
	community_highlight: {
		icon: Star,
		label: "Community",
		color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	},
	challenge_showcase: {
		icon: Trophy,
		label: "Challenge",
		color: "bg-green-500/10 text-green-600 dark:text-green-400",
	},
	technique_tip: {
		icon: Lightbulb,
		label: "Technique",
		color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	},
};

export function LearningFeed({ items }: LearningFeedProps) {
	if (items.length === 0) {
		return (
			<div className="py-12 text-center text-muted-foreground text-sm">
				No feed items yet. Check back soon!
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{items.map((item) => {
				const config = TYPE_CONFIG[item.type];
				const Icon = config.icon;

				return (
					<Card
						key={item.id}
						className="transition-colors hover:border-primary/50"
					>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<Badge variant="outline" className={config.color}>
									<Icon className="mr-1 h-3 w-3" />
									{config.label}
								</Badge>
								<span className="text-muted-foreground text-xs">
									{item.category}
								</span>
							</div>
							<CardTitle className="text-base">{item.title}</CardTitle>
							<CardDescription className="line-clamp-2">
								{item.preview}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{item.type === "showcase" && !!item.data.beforePrompt && (
								<div className="space-y-2 text-xs">
									<div className="rounded-md bg-red-500/5 p-2">
										<span className="font-medium text-red-600 dark:text-red-400">
											Before:
										</span>{" "}
										<span className="text-muted-foreground">
											{String(item.data.beforePrompt).slice(0, 100)}...
										</span>
									</div>
									<div className="rounded-md bg-green-500/5 p-2">
										<span className="font-medium text-green-600 dark:text-green-400">
											After:
										</span>{" "}
										<span className="text-muted-foreground">
											{String(item.data.afterPrompt).slice(0, 100)}...
										</span>
									</div>
								</div>
							)}

							{item.type === "community_highlight" && (
								<div className="flex items-center gap-4 text-xs text-muted-foreground">
									{item.data.rating != null && (
										<span className="flex items-center gap-1">
											<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
											{String(item.data.rating)}
										</span>
									)}
									{item.data.forkCount != null && (
										<span>{String(item.data.forkCount)} forks</span>
									)}
								</div>
							)}

							{item.type === "technique_tip" && !!item.data.patternSlug && (
								<Link
									href={`/learn/patterns/${String(item.data.patternSlug)}`}
									className="inline-flex items-center gap-1 text-primary text-xs hover:underline"
								>
									Try this pattern
									<ArrowRight className="h-3 w-3" />
								</Link>
							)}
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
