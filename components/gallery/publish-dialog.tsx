"use client";

import { Globe, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
	getPublishStatusAction,
	publishToGalleryAction,
	unpublishFromGalleryAction,
} from "@/app/(dashboard)/gallery/actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GALLERY_CATEGORIES } from "@/lib/data/gallery-categories";
import type { GalleryListing } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";

interface PublishDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	promptTemplateId: string;
}

export function PublishDialog({
	open,
	onOpenChange,
	promptTemplateId,
}: PublishDialogProps) {
	const [category, setCategory] = useState<string>("");
	const [description, setDescription] = useState("");
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [existingListing, setExistingListing] = useState<GalleryListing | null>(
		null,
	);
	const [isPublishing, startPublish] = useTransition();
	const [isUnpublishing, startUnpublish] = useTransition();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (open) {
			setIsLoading(true);
			getPublishStatusAction(promptTemplateId).then((listing) => {
				setExistingListing(listing);
				setIsLoading(false);
			});
		}
	}, [open, promptTemplateId]);

	function handlePublish() {
		if (!category || description.length < 10) {
			showToast(
				"error",
				"Please fill in category and description (10+ chars).",
			);
			return;
		}

		startPublish(async () => {
			const result = await publishToGalleryAction({
				promptTemplateId,
				category: category as "writing",
				description,
				isAnonymous,
			});
			if (result.success) {
				showToast("success", "Prompt published to gallery!");
				onOpenChange(false);
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleUnpublish() {
		startUnpublish(async () => {
			const result = await unpublishFromGalleryAction(promptTemplateId);
			if (result.success) {
				showToast("success", "Prompt removed from gallery.");
				setExistingListing(null);
				onOpenChange(false);
			} else {
				showToast("error", result.error);
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Globe className="h-5 w-5" />
						{existingListing ? "Published" : "Publish to Gallery"}
					</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : existingListing ? (
					<div className="space-y-4">
						<p className="text-muted-foreground text-sm">
							This prompt is published in the community gallery. It will
							auto-update when you publish a new stable version.
						</p>
						<div className="rounded-md border bg-muted/30 p-3">
							<p className="text-sm">
								<span className="font-medium">Category:</span>{" "}
								{existingListing.category}
							</p>
							<p className="mt-1 text-sm">
								<span className="font-medium">Forks:</span>{" "}
								{existingListing.forkCount}
							</p>
							<p className="mt-1 text-sm">
								<span className="font-medium">Rating:</span>{" "}
								{Number(existingListing.avgRating).toFixed(1)} (
								{existingListing.ratingCount} ratings)
							</p>
						</div>
						<Button
							variant="destructive"
							className="w-full"
							onClick={handleUnpublish}
							disabled={isUnpublishing}
						>
							{isUnpublishing && (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							)}
							Unpublish
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						<div>
							<Label htmlFor="gallery-category">Category</Label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger id="gallery-category">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{GALLERY_CATEGORIES.map((c) => (
										<SelectItem key={c.value} value={c.value}>
											{c.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="gallery-description">
								Description / Usage Notes
							</Label>
							<Textarea
								id="gallery-description"
								placeholder="Describe what this prompt does and how to use it (min 10 characters)..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="anonymous-toggle">Publish anonymously</Label>
								<p className="text-muted-foreground text-xs">
									Hide your name from the gallery listing
								</p>
							</div>
							<Switch
								id="anonymous-toggle"
								checked={isAnonymous}
								onCheckedChange={setIsAnonymous}
							/>
						</div>

						<div className="rounded-md border bg-muted/30 p-3">
							<p className="text-muted-foreground text-xs">
								By publishing, you agree that this prompt will be shared under
								CC-BY license. Only stable versions can be published.
							</p>
						</div>

						<Button
							className="w-full"
							onClick={handlePublish}
							disabled={isPublishing || !category || description.length < 10}
						>
							{isPublishing && (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							)}
							Publish to Gallery
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
