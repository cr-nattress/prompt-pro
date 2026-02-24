"use server";

import { z } from "zod/v4";
import { requireAuth } from "@/lib/auth";
import { ensureDefaultApp } from "@/lib/db/queries/ensure-default-app";
import {
	type GalleryCategory,
	getGalleryListingById,
	getGalleryListingByPromptId,
	getGalleryListings,
	getUserRating,
	incrementForkCount,
	publishToGallery,
	rateGalleryListing,
	unpublishFromGallery,
} from "@/lib/db/queries/gallery";
import {
	createPrompt,
	getPromptById,
	getPromptVersionByStatus,
} from "@/lib/db/queries/prompts";
import { slugify } from "@/lib/prompt-utils";
import type { ActionResult } from "@/types";

const publishSchema = z.object({
	promptTemplateId: z.string().uuid(),
	category: z.enum([
		"writing",
		"coding",
		"analysis",
		"creative",
		"support",
		"education",
		"research",
		"other",
	]),
	description: z.string().min(10).max(500),
	isAnonymous: z.boolean(),
});

export async function publishToGalleryAction(
	input: z.infer<typeof publishSchema>,
): Promise<ActionResult<{ id: string }>> {
	try {
		const { user, workspace } = await requireAuth();
		const parsed = publishSchema.safeParse(input);
		if (!parsed.success) {
			return { success: false, error: "Invalid input." };
		}

		const { promptTemplateId, category, description, isAnonymous } =
			parsed.data;

		// Verify prompt belongs to this workspace
		const prompt = await getPromptById(promptTemplateId);
		if (!prompt || prompt.workspaceId !== workspace.id) {
			return { success: false, error: "Prompt not found." };
		}

		// Check for stable version
		const stableVersion = await getPromptVersionByStatus(
			promptTemplateId,
			"stable",
		);
		if (!stableVersion) {
			return {
				success: false,
				error:
					"Only prompts with a stable version can be published. Promote a version to stable first.",
			};
		}

		// Check not already published
		const existing = await getGalleryListingByPromptId(promptTemplateId);
		if (existing) {
			return { success: false, error: "This prompt is already published." };
		}

		const listing = await publishToGallery({
			promptTemplateId,
			workspaceId: workspace.id,
			authorId: user.id,
			category: category as GalleryCategory,
			description,
			authorName: isAnonymous ? "Anonymous" : user.name,
			isAnonymous,
		});

		return { success: true, data: { id: listing.id } };
	} catch {
		return { success: false, error: "Failed to publish prompt." };
	}
}

export async function unpublishFromGalleryAction(
	promptTemplateId: string,
): Promise<ActionResult<null>> {
	try {
		const { workspace } = await requireAuth();

		const result = await unpublishFromGallery(promptTemplateId, workspace.id);
		if (!result) {
			return { success: false, error: "Listing not found or not yours." };
		}

		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to unpublish." };
	}
}

export async function rateListingAction(
	listingId: string,
	rating: number,
): Promise<ActionResult<{ avgRating: number; ratingCount: number }>> {
	try {
		const { user } = await requireAuth();

		if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
			return { success: false, error: "Rating must be 1-5." };
		}

		const result = await rateGalleryListing(listingId, user.id, rating);
		return { success: true, data: result };
	} catch {
		return { success: false, error: "Failed to rate." };
	}
}

export async function forkGalleryPromptAction(
	listingId: string,
): Promise<ActionResult<{ slug: string }>> {
	try {
		const { workspace } = await requireAuth();

		const listing = await getGalleryListingById(listingId);
		if (!listing || !listing.version) {
			return { success: false, error: "Listing or version not found." };
		}

		const app = await ensureDefaultApp(workspace.id);
		const slug = slugify(`${listing.promptName}-fork`);

		const created = await createPrompt(
			{
				appId: app.id,
				workspaceId: workspace.id,
				slug,
				name: `${listing.promptName} (Fork)`,
				purpose: listing.promptPurpose,
				description: listing.listing.description,
				tags: listing.promptTags,
			},
			{
				templateText: listing.version.templateText,
				changeNote: `Forked from gallery: ${listing.promptName}`,
			},
		);

		await incrementForkCount(listingId);

		return { success: true, data: { slug: created.slug } };
	} catch {
		return { success: false, error: "Failed to fork prompt." };
	}
}

export async function getGalleryListingsAction(filters: {
	search?: string | undefined;
	category?: string | undefined;
	sort?: string | undefined;
	page?: number | undefined;
}) {
	const result = await getGalleryListings({
		search: filters.search,
		category: filters.category as GalleryCategory | undefined,
		sort: filters.sort as "recent" | "rating" | "popular" | undefined,
		page: filters.page,
	});
	return result;
}

export async function getGalleryDetailAction(listingId: string) {
	try {
		const detail = await getGalleryListingById(listingId);
		if (!detail) return null;

		let userRating: number | null = null;
		try {
			const { user } = await requireAuth();
			userRating = await getUserRating(listingId, user.id);
		} catch {
			// Not logged in — no user rating
		}

		return { ...detail, userRating };
	} catch {
		return null;
	}
}

export async function getPublishStatusAction(promptTemplateId: string) {
	try {
		await requireAuth();
		const listing = await getGalleryListingByPromptId(promptTemplateId);
		return listing;
	} catch {
		return null;
	}
}
