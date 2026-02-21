/**
 * Generate a new API key with a prefix indicating the environment.
 * Format: `pv_live_<base64url>` or `pv_test_<base64url>`
 */
export function generateApiKey(env: "live" | "test"): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	const encoded = btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
	return `pv_${env}_${encoded}`;
}

/**
 * Hash an API key using SHA-256 for storage.
 */
export async function hashApiKey(key: string): Promise<string> {
	const encoded = new TextEncoder().encode(key);
	const digest = await crypto.subtle.digest("SHA-256", encoded);
	return Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

/**
 * Create a deterministic hash of sorted parameters for resolve log dedup.
 */
export async function hashParameters(
	params: Record<string, string>,
): Promise<string> {
	const sorted = JSON.stringify(
		Object.keys(params)
			.sort()
			.reduce<Record<string, string>>((acc, key) => {
				acc[key] = params[key] as string;
				return acc;
			}, {}),
	);
	const encoded = new TextEncoder().encode(sorted);
	const digest = await crypto.subtle.digest("SHA-256", encoded);
	return Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}
