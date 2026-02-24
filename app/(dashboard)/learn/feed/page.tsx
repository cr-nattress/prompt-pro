import type { Metadata } from "next";
import { LearningFeed } from "@/components/learn/learning-feed";
import { SHOWCASE_ENTRIES } from "@/lib/data/before-after-showcases";
import type { FeedItem } from "@/lib/data/learning-feed";
import { aggregateFeedItems } from "@/lib/data/learning-feed";
import { PROMPT_PATTERNS } from "@/lib/data/prompt-patterns";

export const metadata: Metadata = { title: "Learning Feed" };

export default function FeedPage() {
	// Build static feed items (server component — no actions needed)
	const showcases: FeedItem[] = SHOWCASE_ENTRIES.slice(0, 5).map(
		(entry, i) => ({
			id: `showcase-${i}`,
			type: "showcase" as const,
			title: entry.title,
			preview: entry.problems.join(". "),
			category: entry.category,
			data: {
				beforePrompt: entry.beforePrompt,
				afterPrompt: entry.afterPrompt,
				techniques: entry.techniques,
			},
			publishedAt: new Date(),
		}),
	);

	const techniqueTips: FeedItem[] = PROMPT_PATTERNS.slice(0, 3).map(
		(pattern) => ({
			id: `tip-${pattern.slug}`,
			type: "technique_tip" as const,
			title: pattern.title,
			preview: pattern.description.slice(0, 120),
			category: pattern.category,
			data: { patternSlug: pattern.slug },
			publishedAt: new Date(),
		}),
	);

	const items = aggregateFeedItems(showcases, [], techniqueTips);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-semibold text-lg">Learning Feed</h2>
				<p className="text-muted-foreground text-sm">
					Discover showcases, community highlights, and technique tips.
				</p>
			</div>
			<LearningFeed items={items} />
		</div>
	);
}
