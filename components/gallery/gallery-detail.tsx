"use client";

import { ArrowLeft, Copy, GitFork, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
	forkGalleryPromptAction,
	rateListingAction,
} from "@/app/(dashboard)/gallery/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GalleryListing } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface GalleryDetailProps {
	listing: GalleryListing;
	promptName: string;
	promptPurpose: string | null;
	promptDescription: string | null;
	promptTags: string[] | null;
	versionText: string | null;
	analysisResult: unknown;
	userRating: number | null;
}

export function GalleryDetail({
	listing,
	promptName,
	promptPurpose,
	promptDescription,
	promptTags,
	versionText,
	userRating: initialUserRating,
}: GalleryDetailProps) {
	const router = useRouter();
	const [isForking, startForkTransition] = useTransition();
	const [userRating, setUserRating] = useState(initialUserRating);
	const [avgRating, setAvgRating] = useState(Number(listing.avgRating));
	const [ratingCount, setRatingCount] = useState(listing.ratingCount);
	const [hoverRating, setHoverRating] = useState(0);
	const [isRating, setIsRating] = useState(false);

	function handleFork() {
		startForkTransition(async () => {
			const result = await forkGalleryPromptAction(listing.id);
			if (result.success) {
				showToast("success", "Prompt forked to your vault!");
				router.push(`/prompts/${result.data.slug}`);
			} else {
				showToast("error", result.error);
			}
		});
	}

	async function handleRate(rating: number) {
		setIsRating(true);
		setUserRating(rating);
		const result = await rateListingAction(listing.id, rating);
		setIsRating(false);
		if (result.success) {
			setAvgRating(result.data.avgRating);
			setRatingCount(result.data.ratingCount);
		} else {
			showToast("error", result.error);
			setUserRating(initialUserRating);
		}
	}

	function handleCopy() {
		if (!versionText) return;
		navigator.clipboard.writeText(versionText).then(() => {
			showToast("success", "Prompt copied to clipboard");
		});
	}

	return (
		<div className="space-y-6">
			{/* Back link */}
			<Link
				href="/gallery"
				className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Gallery
			</Link>

			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="font-semibold text-2xl tracking-tight">
						{promptName}
					</h1>
					{promptPurpose && (
						<p className="mt-1 text-muted-foreground">{promptPurpose}</p>
					)}
					<div className="mt-2 flex items-center gap-3 text-muted-foreground text-sm">
						<span>
							by {listing.isAnonymous ? "Anonymous" : listing.authorName}
						</span>
						<span>{listing.forkCount} forks</span>
						{ratingCount > 0 && (
							<span className="flex items-center gap-1">
								<Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
								{avgRating.toFixed(1)} ({ratingCount})
							</span>
						)}
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={handleCopy}
						disabled={!versionText}
					>
						<Copy className="mr-1.5 h-3.5 w-3.5" />
						Copy
					</Button>
					<Button onClick={handleFork} disabled={isForking}>
						{isForking ? (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						) : (
							<GitFork className="mr-1.5 h-3.5 w-3.5" />
						)}
						Fork to Vault
					</Button>
				</div>
			</div>

			{/* Tags */}
			<div className="flex flex-wrap gap-1.5">
				<Badge variant="outline">
					{listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
				</Badge>
				{promptTags?.map((tag) => (
					<Badge key={tag} variant="secondary">
						{tag}
					</Badge>
				))}
			</div>

			{/* Description */}
			{(promptDescription || listing.description) && (
				<Card>
					<CardContent className="p-4">
						<p className="text-sm">
							{promptDescription || listing.description}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Prompt text */}
			{versionText && (
				<div>
					<h2 className="mb-2 font-medium text-sm">Prompt Template</h2>
					<pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 font-mono text-sm">
						{versionText}
					</pre>
				</div>
			)}

			{/* Rating */}
			<Card>
				<CardContent className="flex items-center gap-4 p-4">
					<p className="font-medium text-sm">Rate this prompt:</p>
					<div className="flex gap-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								type="button"
								key={star}
								onClick={() => handleRate(star)}
								onMouseEnter={() => setHoverRating(star)}
								onMouseLeave={() => setHoverRating(0)}
								disabled={isRating}
								className="p-0.5 transition-colors disabled:opacity-50"
							>
								<Star
									className={cn(
										"h-5 w-5 transition-colors",
										(hoverRating || userRating || 0) >= star
											? "fill-amber-400 text-amber-400"
											: "text-muted-foreground",
									)}
								/>
							</button>
						))}
					</div>
					{userRating && (
						<span className="text-muted-foreground text-xs">
							Your rating: {userRating}/5
						</span>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
