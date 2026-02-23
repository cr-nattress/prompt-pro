import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	type NewTestCase,
	testCases,
	testRuns,
	testSuites,
} from "@/lib/db/schema";

export async function getTestSuiteByPrompt(promptTemplateId: string) {
	const result = await db
		.select()
		.from(testSuites)
		.where(eq(testSuites.promptTemplateId, promptTemplateId))
		.limit(1);
	return result[0] ?? null;
}

export async function getOrCreateTestSuite(
	promptTemplateId: string,
	workspaceId: string,
) {
	const existing = await getTestSuiteByPrompt(promptTemplateId);
	if (existing) return existing;

	const result = await db
		.insert(testSuites)
		.values({ promptTemplateId, workspaceId })
		.returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns
	return result[0]!;
}

export async function getTestCases(testSuiteId: string) {
	return db
		.select()
		.from(testCases)
		.where(eq(testCases.testSuiteId, testSuiteId))
		.orderBy(asc(testCases.sortOrder));
}

export async function createTestCase(
	data: Pick<
		NewTestCase,
		"testSuiteId" | "name" | "description" | "parameters" | "assertions"
	>,
) {
	const maxOrder = await db
		.select({ sortOrder: testCases.sortOrder })
		.from(testCases)
		.where(eq(testCases.testSuiteId, data.testSuiteId))
		.orderBy(desc(testCases.sortOrder))
		.limit(1);

	const nextOrder = (maxOrder[0]?.sortOrder ?? -1) + 1;

	const result = await db
		.insert(testCases)
		.values({ ...data, sortOrder: nextOrder })
		.returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns
	return result[0]!;
}

export async function updateTestCase(
	id: string,
	data: {
		[K in "name" | "description" | "parameters" | "assertions"]?:
			| NewTestCase[K]
			| undefined;
	},
) {
	const result = await db
		.update(testCases)
		.set(data)
		.where(eq(testCases.id, id))
		.returning();
	return result[0] ?? null;
}

export async function deleteTestCase(id: string) {
	const result = await db
		.delete(testCases)
		.where(eq(testCases.id, id))
		.returning();
	return result[0] ?? null;
}

export async function getTestRunsByVersion(promptVersionId: string) {
	return db
		.select()
		.from(testRuns)
		.where(eq(testRuns.promptVersionId, promptVersionId))
		.orderBy(desc(testRuns.createdAt));
}

export async function getLatestTestRun(testSuiteId: string) {
	const result = await db
		.select()
		.from(testRuns)
		.where(eq(testRuns.testSuiteId, testSuiteId))
		.orderBy(desc(testRuns.createdAt))
		.limit(1);
	return result[0] ?? null;
}

export async function createTestRun(data: {
	testSuiteId: string;
	promptVersionId: string;
	modelId: string;
	total: number;
}) {
	const result = await db
		.insert(testRuns)
		.values({
			...data,
			status: "running",
		})
		.returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns
	return result[0]!;
}

export async function updateTestRun(
	id: string,
	data: {
		status?: string | undefined;
		passed?: number | undefined;
		failed?: number | undefined;
		results?: unknown | undefined;
	},
) {
	const result = await db
		.update(testRuns)
		.set(data)
		.where(eq(testRuns.id, id))
		.returning();
	return result[0] ?? null;
}
