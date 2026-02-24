export type GalleryCategory =
	| "writing"
	| "coding"
	| "analysis"
	| "creative"
	| "support"
	| "education"
	| "research"
	| "other";

export const GALLERY_CATEGORIES: Array<{
	value: GalleryCategory;
	label: string;
}> = [
	{ value: "writing", label: "Writing" },
	{ value: "coding", label: "Coding" },
	{ value: "analysis", label: "Analysis" },
	{ value: "creative", label: "Creative" },
	{ value: "support", label: "Customer Support" },
	{ value: "education", label: "Education" },
	{ value: "research", label: "Research" },
	{ value: "other", label: "Other" },
];
