import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	type NewPipeline,
	type NewPipelineRun,
	pipelineRuns,
	pipelines,
} from "@/lib/db/schema";

// ── Pipelines CRUD ──────────────────────────────────────────────────

export async function createPipeline(
	data: Omit<NewPipeline, "id" | "createdAt" | "updatedAt">,
) {
	const result = await db.insert(pipelines).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns
	return result[0]!;
}

export async function getPipeline(pipelineId: string) {
	const result = await db
		.select()
		.from(pipelines)
		.where(eq(pipelines.id, pipelineId))
		.limit(1);
	return result[0] ?? null;
}

export async function getPipelineBySlug(workspaceId: string, slug: string) {
	const result = await db
		.select()
		.from(pipelines)
		.where(
			and(eq(pipelines.workspaceId, workspaceId), eq(pipelines.slug, slug)),
		)
		.limit(1);
	return result[0] ?? null;
}

export async function getWorkspacePipelines(workspaceId: string) {
	return db
		.select()
		.from(pipelines)
		.where(eq(pipelines.workspaceId, workspaceId))
		.orderBy(desc(pipelines.updatedAt));
}

export async function updatePipeline(
	pipelineId: string,
	data: {
		[K in "name" | "description" | "steps"]?: NewPipeline[K] | undefined;
	},
) {
	const result = await db
		.update(pipelines)
		.set(data)
		.where(eq(pipelines.id, pipelineId))
		.returning();
	return result[0] ?? null;
}

export async function deletePipeline(pipelineId: string) {
	const result = await db
		.delete(pipelines)
		.where(eq(pipelines.id, pipelineId))
		.returning();
	return result[0] ?? null;
}

// ── Pipeline Runs ───────────────────────────────────────────────────

export async function createPipelineRun(
	data: Omit<NewPipelineRun, "id" | "startedAt">,
) {
	const result = await db.insert(pipelineRuns).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns
	return result[0]!;
}

export async function updatePipelineRun(
	runId: string,
	data: {
		[K in
			| "status"
			| "stepResults"
			| "totalTokens"
			| "totalLatencyMs"
			| "completedAt"]?: NewPipelineRun[K] | undefined;
	},
) {
	const result = await db
		.update(pipelineRuns)
		.set(data)
		.where(eq(pipelineRuns.id, runId))
		.returning();
	return result[0] ?? null;
}

export async function getPipelineRuns(pipelineId: string, limit = 10) {
	return db
		.select()
		.from(pipelineRuns)
		.where(eq(pipelineRuns.pipelineId, pipelineId))
		.orderBy(desc(pipelineRuns.startedAt))
		.limit(limit);
}
