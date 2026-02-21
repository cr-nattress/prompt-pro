import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyses, type NewAnalysis } from "@/lib/db/schema";

export async function createAnalysis(data: NewAnalysis) {
	const result = await db.insert(analyses).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function getLatestAnalysis(promptId: string) {
	const result = await db
		.select()
		.from(analyses)
		.where(eq(analyses.promptId, promptId))
		.orderBy(desc(analyses.createdAt))
		.limit(1);

	return result[0] ?? null;
}

export async function getLatestBlueprintAnalysis(blueprintId: string) {
	const result = await db
		.select()
		.from(analyses)
		.where(eq(analyses.blueprintId, blueprintId))
		.orderBy(desc(analyses.createdAt))
		.limit(1);

	return result[0] ?? null;
}

export async function getAnalysisForVersion(promptVersionId: string) {
	const result = await db
		.select()
		.from(analyses)
		.where(eq(analyses.promptVersionId, promptVersionId))
		.orderBy(desc(analyses.createdAt))
		.limit(1);

	return result[0] ?? null;
}
