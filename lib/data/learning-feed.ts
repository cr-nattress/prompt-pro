export interface FeedItem {
	id: string;
	type:
		| "showcase"
		| "community_highlight"
		| "challenge_showcase"
		| "technique_tip";
	title: string;
	preview: string;
	category: string;
	data: Record<string, unknown>;
	publishedAt: Date;
}

/**
 * Merge and sort feed items with type variety.
 * Interleaves different types to keep the feed visually interesting.
 */
export function aggregateFeedItems(
	showcases: FeedItem[],
	topGallery: FeedItem[],
	recentChallenges: FeedItem[],
): FeedItem[] {
	const all = [...showcases, ...topGallery, ...recentChallenges];

	// Sort by type variety: group by type, then interleave
	const byType = new Map<string, FeedItem[]>();
	for (const item of all) {
		const existing = byType.get(item.type) ?? [];
		existing.push(item);
		byType.set(item.type, existing);
	}

	const result: FeedItem[] = [];
	const types = [...byType.keys()];
	let i = 0;
	let hasMore = true;

	while (hasMore) {
		hasMore = false;
		for (const type of types) {
			const items = byType.get(type);
			const item = items?.[i];
			if (item) {
				result.push(item);
				hasMore = true;
			}
		}
		i++;
	}

	return result;
}
