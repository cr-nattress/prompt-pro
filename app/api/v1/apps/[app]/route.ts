import { z } from "zod";
import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import { deleteApp, getAppBySlug, updateApp } from "@/lib/db/queries/apps";

const updateAppApiSchema = z.object({
	name: z.string().min(1).max(200).optional(),
	slug: z
		.string()
		.min(1)
		.max(200)
		.regex(/^[a-z0-9-]+$/)
		.optional(),
	description: z.string().max(2000).optional(),
	default_llm: z.string().max(100).optional(),
});

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ app: string }> },
) {
	try {
		const setup = await setupRoute(request, "read");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug } = await params;
		const app = await getAppBySlug(rc.ctx.workspaceId, appSlug);
		if (!app) {
			return apiError(ApiErrorCode.NOT_FOUND, `App "${appSlug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		return apiSuccess({ app }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("GET /api/v1/apps/[app] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ app: string }> },
) {
	try {
		const setup = await setupRoute(request, "admin");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = updateAppApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const updated = await updateApp(appResult.appId, {
			name: parsed.data.name,
			slug: parsed.data.slug,
			description: parsed.data.description,
			defaultLlm: parsed.data.default_llm,
		});

		return apiSuccess({ app: updated }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("PATCH /api/v1/apps/[app] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ app: string }> },
) {
	try {
		const setup = await setupRoute(request, "admin");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		await deleteApp(appResult.appId);

		return new Response(null, {
			status: 204,
			headers: { "X-Request-Id": rc.requestId, ...rc.rlHeaders },
		});
	} catch (error) {
		console.error("DELETE /api/v1/apps/[app] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
