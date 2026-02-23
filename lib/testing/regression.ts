import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { testRuns } from "@/lib/db/schema";
import type { TestCaseResult } from "./assertions";

export interface RegressionResult {
	hasRegressions: boolean;
	regressionCount: number;
	regressions: {
		testCaseName: string;
		previouslyPassed: boolean;
		currentlyPassed: boolean;
	}[];
	previousRunId: string | null;
}

/**
 * Compare the latest test run for a version against the latest test run
 * for the previous version of the same test suite.
 */
export async function checkRegressions(
	_testSuiteId: string,
	currentVersionId: string,
	previousVersionId: string | null,
): Promise<RegressionResult> {
	if (!previousVersionId) {
		return {
			hasRegressions: false,
			regressionCount: 0,
			regressions: [],
			previousRunId: null,
		};
	}

	// Get the latest completed test run for the current version
	const currentRuns = await db
		.select()
		.from(testRuns)
		.where(eq(testRuns.promptVersionId, currentVersionId))
		.orderBy(desc(testRuns.createdAt))
		.limit(1);

	const currentRun = currentRuns[0];
	if (!currentRun || currentRun.status !== "completed") {
		return {
			hasRegressions: false,
			regressionCount: 0,
			regressions: [],
			previousRunId: null,
		};
	}

	// Get the latest completed test run for the previous version
	const previousRuns = await db
		.select()
		.from(testRuns)
		.where(eq(testRuns.promptVersionId, previousVersionId))
		.orderBy(desc(testRuns.createdAt))
		.limit(1);

	const previousRun = previousRuns[0];
	if (!previousRun || previousRun.status !== "completed") {
		return {
			hasRegressions: false,
			regressionCount: 0,
			regressions: [],
			previousRunId: null,
		};
	}

	const currentResults = (currentRun.results ?? []) as TestCaseResult[];
	const previousResults = (previousRun.results ?? []) as TestCaseResult[];

	// Build a map of previous results by test case ID
	const previousMap = new Map(previousResults.map((r) => [r.testCaseId, r]));

	const regressions: RegressionResult["regressions"] = [];

	for (const current of currentResults) {
		const previous = previousMap.get(current.testCaseId);
		if (previous?.passed && !current.passed) {
			regressions.push({
				testCaseName: current.testCaseName,
				previouslyPassed: true,
				currentlyPassed: false,
			});
		}
	}

	return {
		hasRegressions: regressions.length > 0,
		regressionCount: regressions.length,
		regressions,
		previousRunId: previousRun.id,
	};
}
