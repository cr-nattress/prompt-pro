"use client";

import { Globe, Loader2, Search, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { getGalleryListingsAction } from "@/app/(dashboard)/gallery/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GALLERY_CATEGORIES } from "@/lib/data/gallery-categories";

type GalleryItem = Awaited<
	ReturnType<typeof getGalleryListingsAction>
>["items"][number];

export function GalleryBrowser() {
	const [items, setItems] = useState<GalleryItem[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<string>("all");
	const [sort, setSort] = useState<string>("recent");
	const [isPending, startTransition] = useTransition();

	function fetchListings(p: number) {
		startTransition(async () => {
			const result = await getGalleryListingsAction({
				search: search || undefined,
				category: category === "all" ? undefined : category,
				sort,
				page: p,
			});
			setItems(result.items);
			setTotal(result.total);
			setPage(p);
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetch on filter changes
	useEffect(() => {
		fetchListings(1);
	}, [search, category, sort]);

	const totalPages = Math.ceil(total / 12);

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search prompts..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select value={category} onValueChange={setCategory}>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{GALLERY_CATEGORIES.map((c) => (
							<SelectItem key={c.value} value={c.value}>
								{c.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={sort} onValueChange={setSort}>
					<SelectTrigger className="w-[140px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="recent">Most Recent</SelectItem>
						<SelectItem value="rating">Top Rated</SelectItem>
						<SelectItem value="popular">Most Forked</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Results */}
			{isPending ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : items.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
					<div className="rounded-full bg-muted p-4">
						<Globe className="h-6 w-6 text-muted-foreground" />
					</div>
					<p className="text-muted-foreground text-sm">
						{search || category !== "all"
							? "No prompts match your filters"
							: "No prompts have been published yet. Be the first!"}
					</p>
				</div>
			) : (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((item) => (
							<GalleryCard key={item.listing.id} item={item} />
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1}
								onClick={() => fetchListings(page - 1)}
							>
								Previous
							</Button>
							<span className="text-muted-foreground text-sm">
								Page {page} of {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={page >= totalPages}
								onClick={() => fetchListings(page + 1)}
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function GalleryCard({ item }: { item: GalleryItem }) {
	const { listing, promptName, promptPurpose, promptTags } = item;
	const avgRating = Number(listing.avgRating);

	return (
		<Link href={`/gallery/${listing.id}`}>
			<Card className="transition-colors hover:bg-muted/50">
				<CardContent className="p-4">
					<div className="mb-2 flex items-start justify-between">
						<h3 className="line-clamp-1 font-medium text-sm">{promptName}</h3>
						{avgRating > 0 && (
							<div className="flex items-center gap-1 text-amber-500">
								<Star className="h-3.5 w-3.5 fill-current" />
								<span className="font-medium text-xs">
									{avgRating.toFixed(1)}
								</span>
							</div>
						)}
					</div>

					{promptPurpose && (
						<p className="mb-2 line-clamp-1 text-muted-foreground text-xs">
							{promptPurpose}
						</p>
					)}

					<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
						{listing.description}
					</p>

					<div className="flex items-center justify-between">
						<div className="flex flex-wrap gap-1">
							<Badge variant="outline" className="text-xs">
								{GALLERY_CATEGORIES.find((c) => c.value === listing.category)
									?.label ?? listing.category}
							</Badge>
							{promptTags?.slice(0, 2).map((tag) => (
								<Badge key={tag} variant="secondary" className="text-xs">
									{tag}
								</Badge>
							))}
						</div>
						<span className="text-muted-foreground text-xs">
							{listing.forkCount} fork{listing.forkCount !== 1 ? "s" : ""}
						</span>
					</div>

					<div className="mt-2 flex items-center justify-between border-t pt-2">
						<span className="text-muted-foreground text-xs">
							by {listing.isAnonymous ? "Anonymous" : listing.authorName}
						</span>
						{listing.ratingCount > 0 && (
							<span className="text-muted-foreground text-xs">
								{listing.ratingCount} rating
								{listing.ratingCount !== 1 ? "s" : ""}
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
