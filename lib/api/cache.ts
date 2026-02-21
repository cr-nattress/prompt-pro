/**
 * Compute a weak ETag from content using SHA-256.
 */
export async function computeEtag(content: string): Promise<string> {
	const encoded = new TextEncoder().encode(content);
	const digest = await crypto.subtle.digest("SHA-256", encoded);
	const hex = Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return `W/"${hex.slice(0, 16)}"`;
}

/**
 * Check if the client's `If-None-Match` header matches the given ETag.
 */
export function checkEtag(request: Request, etag: string): boolean {
	const ifNoneMatch = request.headers.get("If-None-Match");
	if (!ifNoneMatch) return false;
	return ifNoneMatch === etag;
}

/**
 * Generate cache-related response headers.
 */
export function cacheHeaders(
	etag: string,
	maxAge = 60,
): Record<string, string> {
	return {
		ETag: etag,
		"Cache-Control": `public, max-age=${maxAge}`,
	};
}
