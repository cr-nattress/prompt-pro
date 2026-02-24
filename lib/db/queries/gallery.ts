import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { GalleryCategory } from "@/lib/data/gallery-categories";
import { db } from "@/lib/db";

export {
	GALLERY_CATEGORIES,
	type GalleryCategory,
} from "@/lib/data/gallery-categories";

import {
	galleryListings,
	galleryRatings,
	type NewGalleryListing,
	promptTemplates,
	promptVersions,
} from "@/lib/db/schema";

interface GalleryFilters {
	search?: string | undefined;
	category?: GalleryCategory | undefined;
	sort?: "recent" | "rating" | "popular" | undefined;
	page?: number | undefined;
	pageSize?: number | undefined;
}

export async function getGalleryListings(filters: GalleryFilters = {}) {
	const {
		search,
		category,
		sort = "recent",
		page = 1,
		pageSize = 12,
	} = filters;

	const conditions = [];

	if (search) {
		const searchCondition = or(
			ilike(promptTemplates.name, `%${search}%`),
			ilike(galleryListings.description, `%${search}%`),
		);
		if (searchCondition) conditions.push(searchCondition);
	}

	if (category) {
		conditions.push(eq(galleryListings.category, category));
	}

	const orderBy =
		sort === "rating"
			? desc(galleryListings.avgRating)
			: sort === "popular"
				? desc(galleryListings.forkCount)
				: desc(galleryListings.publishedAt);

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [items, totalResult] = await Promise.all([
		db
			.select({
				listing: galleryListings,
				promptName: promptTemplates.name,
				promptSlug: promptTemplates.slug,
				promptPurpose: promptTemplates.purpose,
				promptTags: promptTemplates.tags,
			})
			.from(galleryListings)
			.innerJoin(
				promptTemplates,
				eq(galleryListings.promptTemplateId, promptTemplates.id),
			)
			.where(whereClause)
			.orderBy(orderBy)
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		db
			.select({ total: count() })
			.from(galleryListings)
			.innerJoin(
				promptTemplates,
				eq(galleryListings.promptTemplateId, promptTemplates.id),
			)
			.where(whereClause),
	]);

	return {
		items,
		total: totalResult[0]?.total ?? 0,
		page,
		pageSize,
	};
}

export async function getTopGalleryListings(limit = 5) {
	const rows = await db
		.select({
			id: galleryListings.id,
			title: promptTemplates.name,
			description: galleryListings.description,
			category: galleryListings.category,
			avgRating: galleryListings.avgRating,
			forkCount: galleryListings.forkCount,
			publishedAt: galleryListings.publishedAt,
		})
		.from(galleryListings)
		.innerJoin(
			promptTemplates,
			eq(galleryListings.promptTemplateId, promptTemplates.id),
		)
		.orderBy(desc(galleryListings.avgRating))
		.limit(limit);

	return rows.map((r) => ({
		...r,
		avgRating: Number(r.avgRating ?? 0),
		publishedAt: r.publishedAt.toISOString(),
	}));
}

export async function getGalleryListingById(listingId: string) {
	const result = await db
		.select({
			listing: galleryListings,
			promptName: promptTemplates.name,
			promptSlug: promptTemplates.slug,
			promptPurpose: promptTemplates.purpose,
			promptDescription: promptTemplates.description,
			promptTags: promptTemplates.tags,
			promptId: promptTemplates.id,
		})
		.from(galleryListings)
		.innerJoin(
			promptTemplates,
			eq(galleryListings.promptTemplateId, promptTemplates.id),
		)
		.where(eq(galleryListings.id, listingId))
		.limit(1);

	const item = result[0];
	if (!item) return null;

	// Get the stable version text
	const stableVersion = await db
		.select()
		.from(promptVersions)
		.where(
			and(
				eq(promptVersions.promptTemplateId, item.promptId),
				eq(promptVersions.status, "stable"),
			),
		)
		.limit(1);

	// Fall back to latest version if no stable version
	const latestVersion = stableVersion[0]
		? stableVersion[0]
		: ((
				await db
					.select()
					.from(promptVersions)
					.where(eq(promptVersions.promptTemplateId, item.promptId))
					.orderBy(desc(promptVersions.version))
					.limit(1)
			)[0] ?? null);

	return { ...item, version: latestVersion };
}

export async function getGalleryListingByPromptId(promptTemplateId: string) {
	const result = await db
		.select()
		.from(galleryListings)
		.where(eq(galleryListings.promptTemplateId, promptTemplateId))
		.limit(1);
	return result[0] ?? null;
}

export async function publishToGallery(data: NewGalleryListing) {
	const result = await db.insert(galleryListings).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function unpublishFromGallery(
	promptTemplateId: string,
	workspaceId: string,
) {
	const result = await db
		.delete(galleryListings)
		.where(
			and(
				eq(galleryListings.promptTemplateId, promptTemplateId),
				eq(galleryListings.workspaceId, workspaceId),
			),
		)
		.returning();
	return result[0] ?? null;
}

export async function rateGalleryListing(
	listingId: string,
	userId: string,
	rating: number,
) {
	return db.transaction(async (tx) => {
		// Upsert rating
		await tx
			.insert(galleryRatings)
			.values({ listingId, userId, rating })
			.onConflictDoUpdate({
				target: [galleryRatings.listingId, galleryRatings.userId],
				set: { rating, updatedAt: new Date() },
			});

		// Recalculate average
		const stats = await tx
			.select({
				avgRating: sql<string>`ROUND(AVG(${galleryRatings.rating})::numeric, 2)`,
				ratingCount: count(),
			})
			.from(galleryRatings)
			.where(eq(galleryRatings.listingId, listingId));

		const avgRating = stats[0]?.avgRating ?? "0";
		const ratingCount = stats[0]?.ratingCount ?? 0;

		await tx
			.update(galleryListings)
			.set({ avgRating, ratingCount })
			.where(eq(galleryListings.id, listingId));

		return { avgRating: Number(avgRating), ratingCount };
	});
}

export async function getUserRating(listingId: string, userId: string) {
	const result = await db
		.select({ rating: galleryRatings.rating })
		.from(galleryRatings)
		.where(
			and(
				eq(galleryRatings.listingId, listingId),
				eq(galleryRatings.userId, userId),
			),
		)
		.limit(1);
	return result[0]?.rating ?? null;
}

export async function incrementForkCount(listingId: string) {
	await db
		.update(galleryListings)
		.set({
			forkCount: sql`${galleryListings.forkCount} + 1`,
		})
		.where(eq(galleryListings.id, listingId));
}
