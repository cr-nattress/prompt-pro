"use server";

import { requireAuth } from "@/lib/auth";
import { SHOWCASE_ENTRIES } from "@/lib/data/before-after-showcases";
import type { FeedItem } from "@/lib/data/learning-feed";
import { aggregateFeedItems } from "@/lib/data/learning-feed";
import { PROMPT_PATTERNS } from "@/lib/data/prompt-patterns";
import { getTopGalleryListings } from "@/lib/db/queries/gallery";
import type { ActionResult } from "@/types";

export async function getFeedDataAction(): Promise<ActionResult<FeedItem[]>> {
	try {
		const { workspace } = await requireAuth();

		// Build showcase feed items from static data
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

		// Build community highlights from gallery
		let topGallery: FeedItem[] = [];
		try {
			const listings = await getTopGalleryListings(5);
			topGallery = listings.map((listing) => ({
				id: `gallery-${listing.id}`,
				type: "community_highlight" as const,
				title: listing.title,
				preview: listing.description ?? "",
				category: listing.category,
				data: {
					rating: listing.avgRating,
					forkCount: listing.forkCount,
				},
				publishedAt: new Date(listing.publishedAt),
			}));
		} catch {
			// Gallery may be empty
		}

		// Build technique tips from patterns
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

		const items = aggregateFeedItems(showcases, topGallery, techniqueTips);
		return { success: true, data: items };
	} catch {
		return { success: false, error: "Failed to load feed data." };
	}
}
