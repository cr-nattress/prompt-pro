import { computeTextSimilarity } from "./similarity";

export interface DriftCheckResult {
	hasDrift: boolean;
	similarity: number;
	driftingCases: {
		testCaseName: string;
		similarity: number;
	}[];
}

interface TestOutput {
	testCaseId: string;
	testCaseName: string;
	output: string;
}

/**
 * Compare current test outputs against baseline outputs.
 * Drift is detected when similarity drops below the threshold.
 */
export function checkForDrift(
	currentResults: TestOutput[],
	baselineResults: TestOutput[],
	threshold = 0.85,
): DriftCheckResult {
	const baselineMap = new Map(baselineResults.map((r) => [r.testCaseId, r]));

	const similarities: number[] = [];
	const driftingCases: DriftCheckResult["driftingCases"] = [];

	for (const current of currentResults) {
		const baseline = baselineMap.get(current.testCaseId);
		if (!baseline) continue;

		const similarity = computeTextSimilarity(current.output, baseline.output);
		similarities.push(similarity);

		if (similarity < threshold) {
			driftingCases.push({
				testCaseName: current.testCaseName,
				similarity: Number(similarity.toFixed(4)),
			});
		}
	}

	const avgSimilarity =
		similarities.length > 0
			? similarities.reduce((a, b) => a + b, 0) / similarities.length
			: 1;

	return {
		hasDrift: driftingCases.length > 0,
		similarity: Number(avgSimilarity.toFixed(4)),
		driftingCases,
	};
}
