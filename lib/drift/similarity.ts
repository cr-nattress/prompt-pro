/**
 * Compute text similarity using character trigram Jaccard coefficient.
 * Returns a score between 0 and 1 (1 = identical).
 * No external API dependency.
 */
export function computeTextSimilarity(a: string, b: string): number {
	if (a === b) return 1;
	if (a.length === 0 && b.length === 0) return 1;
	if (a.length === 0 || b.length === 0) return 0;

	const trigramsA = getTrigrams(a);
	const trigramsB = getTrigrams(b);

	if (trigramsA.size === 0 && trigramsB.size === 0) return 1;

	let intersection = 0;
	for (const tri of trigramsA) {
		if (trigramsB.has(tri)) intersection++;
	}

	const union = trigramsA.size + trigramsB.size - intersection;
	return union === 0 ? 1 : intersection / union;
}

function getTrigrams(text: string): Set<string> {
	const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();
	const trigrams = new Set<string>();

	for (let i = 0; i <= normalized.length - 3; i++) {
		trigrams.add(normalized.slice(i, i + 3));
	}

	return trigrams;
}
