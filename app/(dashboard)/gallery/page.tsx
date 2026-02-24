import { GalleryBrowser } from "@/components/gallery/gallery-browser";

export const metadata = {
	title: "Community Gallery",
};

export default function GalleryPage() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
			<div>
				<h1 className="font-semibold text-2xl tracking-tight">
					Community Gallery
				</h1>
				<p className="text-muted-foreground text-sm">
					Discover and fork prompts shared by the community
				</p>
			</div>
			<GalleryBrowser />
		</div>
	);
}
