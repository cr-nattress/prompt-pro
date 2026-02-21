import { z } from "zod";
import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, setupRoute } from "@/lib/api/route-helpers";
import { createApp, getAppsByWorkspaceId } from "@/lib/db/queries/apps";

const createAppApiSchema = z.object({
	name: z.string().min(1).max(200),
	slug: z
		.string()
		.min(1)
		.max(200)
		.regex(/^[a-z0-9-]+$/),
	description: z.string().max(2000).optional(),
	default_llm: z.string().max(100).optional(),
});

export async function GET(request: Request) {
	try {
		const setup = await setupRoute(request, "read");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const apps = await getAppsByWorkspaceId(rc.ctx.workspaceId);

		return apiSuccess({ apps }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("GET /api/v1/apps error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function POST(request: Request) {
	try {
		const setup = await setupRoute(request, "admin");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = createAppApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const app = await createApp({
			name: parsed.data.name,
			slug: parsed.data.slug,
			description: parsed.data.description,
			defaultLlm: parsed.data.default_llm,
			workspaceId: rc.ctx.workspaceId,
		});

		return apiSuccess({ app }, { status: 201, headers: rc.rlHeaders });
	} catch (error) {
		console.error("POST /api/v1/apps error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
