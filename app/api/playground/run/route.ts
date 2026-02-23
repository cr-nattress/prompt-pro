import { streamText } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getAvailableModels } from "@/lib/ai/models";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { playgroundRuns } from "@/lib/db/schema";

const runSchema = z.object({
	resolvedText: z.string().min(1).max(100_000),
	modelId: z.string().min(1),
	temperature: z.number().min(0).max(2).default(1.0),
	maxTokens: z.number().int().min(1).max(32_000).default(4096),
	promptId: z.string().uuid().nullable().default(null),
	promptVersionId: z.string().uuid().nullable().default(null),
	blueprintId: z.string().uuid().nullable().default(null),
	parameters: z.record(z.string(), z.string()).default({}),
});

export async function POST(request: Request) {
	try {
		const { workspace } = await requireAuth();

		const body = await request.json();
		const parsed = runSchema.safeParse(body);
		if (!parsed.success) {
			return Response.json(
				{ error: parsed.error.flatten().fieldErrors },
				{ status: 400 },
			);
		}

		const {
			resolvedText,
			modelId,
			temperature,
			maxTokens,
			promptId,
			promptVersionId,
			blueprintId,
			parameters,
		} = parsed.data;

		// Verify model is available
		const availableModels = getAvailableModels();
		const modelDef = availableModels.find((m) => m.id === modelId);
		if (!modelDef) {
			return Response.json({ error: "Model not available" }, { status: 400 });
		}

		const startTime = Date.now();

		// Create a DB record upfront with status "running"
		const insertResult = await db
			.insert(playgroundRuns)
			.values({
				workspaceId: workspace.id,
				promptId,
				promptVersionId,
				blueprintId,
				modelId,
				resolvedText,
				parameters,
				temperature,
				maxTokens,
				status: "running",
			})
			.returning({ id: playgroundRuns.id });

		const runId = insertResult[0]?.id;

		const model = getModel(modelId);

		const result = streamText({
			model,
			prompt: resolvedText,
			temperature,
			maxOutputTokens: maxTokens,
			onFinish: async ({ text, usage }) => {
				const latencyMs = Date.now() - startTime;
				if (runId) {
					await db
						.update(playgroundRuns)
						.set({
							responseText: text,
							inputTokens: usage.inputTokens ?? 0,
							outputTokens: usage.outputTokens ?? 0,
							latencyMs,
							status: "completed",
						})
						.where(eq(playgroundRuns.id, runId))
						.catch(() => {});
				}
			},
			onError: async () => {
				if (runId) {
					await db
						.update(playgroundRuns)
						.set({ status: "error", error: "Stream failed" })
						.where(eq(playgroundRuns.id, runId))
						.catch(() => {});
				}
			},
		});

		const response = result.toTextStreamResponse();
		response.headers.set("X-Run-Id", runId ?? "");
		return response;
	} catch (error) {
		if (error instanceof Error && error.message === "Authentication required") {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}
