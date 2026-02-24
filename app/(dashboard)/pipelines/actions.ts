"use server";

import { requireAuth } from "@/lib/auth";
import {
	createPipeline,
	deletePipeline,
	getPipelineBySlug,
	getWorkspacePipelines,
	updatePipeline,
} from "@/lib/db/queries/pipelines";
import type { Pipeline } from "@/lib/db/schema";
import { executePipeline } from "@/lib/pipelines/pipeline-executor";
import type {
	PipelineStep,
	PipelineStepResult,
} from "@/lib/pipelines/pipeline-types";
import { slugify } from "@/lib/prompt-utils";
import type { ActionResult } from "@/types";

export async function getPipelinesAction(): Promise<ActionResult<Pipeline[]>> {
	try {
		const { workspace } = await requireAuth();
		const data = await getWorkspacePipelines(workspace.id);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load pipelines." };
	}
}

export async function createPipelineAction(
	name: string,
	description: string,
): Promise<ActionResult<Pipeline>> {
	try {
		const { workspace } = await requireAuth();
		const slug = slugify(name) || `pipeline-${Date.now()}`;
		const data = await createPipeline({
			workspaceId: workspace.id,
			slug,
			name,
			description,
			steps: [],
		});
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to create pipeline." };
	}
}

export async function updatePipelineAction(
	pipelineId: string,
	updates: {
		name?: string | undefined;
		description?: string | undefined;
		steps?: PipelineStep[] | undefined;
	},
): Promise<ActionResult<Pipeline>> {
	try {
		await requireAuth();
		const data = await updatePipeline(pipelineId, updates);
		if (!data) {
			return { success: false, error: "Pipeline not found." };
		}
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to update pipeline." };
	}
}

export async function deletePipelineAction(
	pipelineId: string,
): Promise<ActionResult<null>> {
	try {
		await requireAuth();
		await deletePipeline(pipelineId);
		return { success: true, data: null };
	} catch {
		return { success: false, error: "Failed to delete pipeline." };
	}
}

export async function executePipelineAction(
	steps: PipelineStep[],
	initialInput: string,
): Promise<
	ActionResult<{
		results: PipelineStepResult[];
		totalTokens: number;
		totalLatencyMs: number;
	}>
> {
	try {
		await requireAuth();
		const data = await executePipeline(steps, initialInput);
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to execute pipeline." };
	}
}

export async function getPipelineBySlugAction(
	slug: string,
): Promise<ActionResult<Pipeline>> {
	try {
		const { workspace } = await requireAuth();
		const data = await getPipelineBySlug(workspace.id, slug);
		if (!data) {
			return { success: false, error: "Pipeline not found." };
		}
		return { success: true, data };
	} catch {
		return { success: false, error: "Failed to load pipeline." };
	}
}
