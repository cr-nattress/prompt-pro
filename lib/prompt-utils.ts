/**
 * Extract `{{paramName}}` parameters from template text.
 */
export function extractParameters(text: string): string[] {
	const matches = text.matchAll(/\{\{([^}]+)\}\}/g);
	const params = new Set<string>();
	for (const match of matches) {
		const name = match[1]?.trim();
		if (name) params.add(name);
	}
	return [...params];
}

/**
 * Convert a name to a URL-safe slug.
 */
export function slugify(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

const UNITS: [string, number][] = [
	["y", 31536000],
	["mo", 2592000],
	["d", 86400],
	["h", 3600],
	["m", 60],
	["s", 1],
];

/**
 * Format a date as relative time (e.g. "2h ago", "3d ago").
 */
export function timeAgo(date: Date): string {
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (seconds < 5) return "just now";

	for (const [unit, threshold] of UNITS) {
		if (seconds >= threshold) {
			const value = Math.floor(seconds / threshold);
			return `${value}${unit} ago`;
		}
	}
	return "just now";
}
