export interface AttentionSegment {
	startIndex: number;
	endIndex: number;
	attentionScore: number;
	color: string;
}

/** Structural markers that boost attention scores */
const STRUCTURAL_MARKERS = [
	/^#{1,6}\s/m, // Headings
	/^```/m, // Code blocks
	/^[-*+]\s/m, // Bullet lists
	/^\d+\.\s/m, // Numbered lists
	/^>/m, // Blockquotes
];

/**
 * Generate an oklch color on a red-to-blue gradient based on attention score.
 * Low attention (0.0) → red/warm, High attention (1.0) → blue/cool.
 */
function scoreToColor(score: number): string {
	// oklch: L (lightness 0-1), C (chroma), H (hue)
	// Red ~30°, Blue ~260°
	const hue = 30 + score * 230;
	const lightness = 0.75 - score * 0.1;
	const chroma = 0.12 + score * 0.05;
	return `oklch(${lightness.toFixed(2)} ${chroma.toFixed(3)} ${hue.toFixed(0)})`;
}

/**
 * Compute a heuristic attention heatmap for a text.
 *
 * Based on the "lost in the middle" phenomenon:
 * - First ~15% and last ~15% of text receive high attention (0.8-1.0)
 * - Middle sections receive lower attention (0.2-0.5)
 * - Structural markers (headings, code blocks, bullets) get a boost
 */
export function computeAttentionHeatmap(text: string): AttentionSegment[] {
	// Split by paragraph boundaries (double newlines)
	const paragraphs: { start: number; end: number; text: string }[] = [];
	const parts = text.split(/\n\n+/);
	let offset = 0;

	for (const part of parts) {
		if (part.length > 0) {
			paragraphs.push({
				start: text.indexOf(part, offset),
				end: text.indexOf(part, offset) + part.length,
				text: part,
			});
			offset = text.indexOf(part, offset) + part.length;
		}
	}

	if (paragraphs.length === 0) return [];

	const totalLength = text.length;
	const segments: AttentionSegment[] = [];

	for (const para of paragraphs) {
		const midpoint = (para.start + para.end) / 2;
		const relativePosition = midpoint / totalLength;

		// U-shaped attention curve
		let score: number;
		if (relativePosition <= 0.15) {
			// First 15%: high attention, fading slightly
			score = 1.0 - relativePosition * 1.33;
		} else if (relativePosition >= 0.85) {
			// Last 15%: attention rises again
			score = 0.8 + (relativePosition - 0.85) * 1.33;
		} else {
			// Middle: low attention
			const middleDepth = 1.0 - Math.abs(relativePosition - 0.5) / 0.35;
			score = 0.2 + (1.0 - middleDepth) * 0.3;
		}

		// Structural marker boost
		const hasStructure = STRUCTURAL_MARKERS.some((marker) =>
			marker.test(para.text),
		);
		if (hasStructure) {
			score = Math.min(1.0, score + 0.15);
		}

		score = Math.max(0, Math.min(1, score));

		segments.push({
			startIndex: para.start,
			endIndex: para.end,
			attentionScore: Number(score.toFixed(2)),
			color: scoreToColor(score),
		});
	}

	return segments;
}

/** Instruction keywords that matter when found in low-attention zones */
const INSTRUCTION_KEYWORDS = [
	"must",
	"should",
	"required",
	"important",
	"ensure",
	"always",
	"never",
	"constraint",
	"rule",
	"format",
	"output",
	"return",
	"respond",
];

/**
 * Find low-attention segments that contain instruction keywords.
 * These are the most likely to be "lost in the middle."
 */
export function findLowAttentionInstructions(
	text: string,
	segments: AttentionSegment[],
	threshold = 0.4,
): { segment: AttentionSegment; keywords: string[] }[] {
	const results: { segment: AttentionSegment; keywords: string[] }[] = [];

	for (const seg of segments) {
		if (seg.attentionScore >= threshold) continue;

		const segText = text.slice(seg.startIndex, seg.endIndex).toLowerCase();
		const found = INSTRUCTION_KEYWORDS.filter((kw) => segText.includes(kw));

		if (found.length > 0) {
			results.push({ segment: seg, keywords: found });
		}
	}

	return results;
}
