"use server";

import { generateText } from "ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import { getPromptVersionById } from "@/lib/db/queries/prompts";
import {
	createTestCase,
	createTestRun,
	deleteTestCase,
	getOrCreateTestSuite,
	getTestCases,
	getTestSuiteByPrompt,
	updateTestCase,
	updateTestRun,
} from "@/lib/db/queries/test-suites";
import { interpolateTemplate } from "@/lib/resolve/template-interpolator";
import {
	evaluateAssertions,
	type TestAssertion,
	type TestCaseResult,
} from "@/lib/testing/assertions";
import type { ActionResult } from "@/types";

export async function getTestSuiteAction(promptTemplateId: string): Promise<
	ActionResult<{
		suite: Awaited<ReturnType<typeof getTestSuiteByPrompt>>;
		cases: Awaited<ReturnType<typeof getTestCases>>;
	}>
> {
	try {
		await requireAuth();
		const suite = await getTestSuiteByPrompt(promptTemplateId);
		if (!suite) {
			return { success: true, data: { suite: null, cases: [] } };
		}
		const cases = await getTestCases(suite.id);
		return { success: true, data: { suite, cases } };
	} catch {
		return { success: false, error: "Failed to load test suite" };
	}
}

export async function createTestCaseAction(
	promptTemplateId: string,
	data: {
		name: string;
		description?: string | undefined;
		parameters: Record<string, string>;
		assertions: TestAssertion[];
	},
): Promise<ActionResult<{ id: string }>> {
	try {
		const { workspace } = await requireAuth();
		const suite = await getOrCreateTestSuite(promptTemplateId, workspace.id);
		const testCase = await createTestCase({
			testSuiteId: suite.id,
			name: data.name,
			description: data.description,
			parameters: data.parameters,
			assertions: data.assertions,
		});
		return { success: true, data: { id: testCase.id } };
	} catch {
		return { success: false, error: "Failed to create test case" };
	}
}

export async function updateTestCaseAction(
	id: string,
	data: {
		name?: string | undefined;
		description?: string | undefined;
		parameters?: Record<string, string> | undefined;
		assertions?: TestAssertion[] | undefined;
	},
): Promise<ActionResult<null>> {
	try {
		await requireAuth();
		await updateTestCase(id, data);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to update test case" };
	}
}

export async function deleteTestCaseAction(
	id: string,
): Promise<ActionResult<null>> {
	try {
		await requireAuth();
		await deleteTestCase(id);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to delete test case" };
	}
}

export async function runTestSuiteAction(
	promptTemplateId: string,
	promptVersionId: string,
	modelId: string,
): Promise<ActionResult<{ runId: string; results: TestCaseResult[] }>> {
	try {
		const { workspace } = await requireAuth();
		const suite = await getOrCreateTestSuite(promptTemplateId, workspace.id);
		const cases = await getTestCases(suite.id);

		if (cases.length === 0) {
			return { success: false, error: "No test cases defined" };
		}

		const version = await getPromptVersionById(promptVersionId);
		if (!version) {
			return { success: false, error: "Version not found" };
		}

		const run = await createTestRun({
			testSuiteId: suite.id,
			promptVersionId,
			modelId,
			total: cases.length,
		});

		const model = getModel(modelId);
		const results: TestCaseResult[] = [];

		for (const tc of cases) {
			const params = (tc.parameters ?? {}) as Record<string, string>;
			const { resolved } = interpolateTemplate(version.templateText, params);

			const startTime = Date.now();
			try {
				const { text } = await generateText({
					model,
					prompt: resolved,
					maxOutputTokens: 4096,
				});
				const latencyMs = Date.now() - startTime;

				const assertions = (tc.assertions ?? []) as TestAssertion[];
				const { passed, results: assertionResults } = evaluateAssertions(
					text,
					assertions,
				);

				results.push({
					testCaseId: tc.id,
					testCaseName: tc.name,
					passed,
					responseText: text,
					latencyMs,
					assertionResults,
				});
			} catch {
				results.push({
					testCaseId: tc.id,
					testCaseName: tc.name,
					passed: false,
					responseText: "",
					latencyMs: Date.now() - startTime,
					assertionResults: [
						{
							assertion: { type: "contains", value: "" },
							passed: false,
							message: "AI call failed",
						},
					],
				});
			}
		}

		const passed = results.filter((r) => r.passed).length;
		const failed = results.length - passed;

		await updateTestRun(run.id, {
			status: "completed",
			passed,
			failed,
			results,
		});

		return { success: true, data: { runId: run.id, results } };
	} catch {
		return { success: false, error: "Failed to run test suite" };
	}
}
