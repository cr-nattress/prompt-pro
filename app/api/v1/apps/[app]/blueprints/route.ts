import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import {
	createBlueprint,
	getBlueprintsWithBlockCount,
} from "@/lib/db/queries/blueprints";
import { createBlueprintApiSchema } from "@/lib/validations/api-blueprint";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ app: string }> },
) {
	try {
		const setup = await setupRoute(request, "read");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const url = new URL(request.url);
		const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
		const pageSize = Math.min(
			100,
			Math.max(1, Number(url.searchParams.get("page_size")) || 20),
		);
		const search = url.searchParams.get("search") ?? undefined;

		const result = await getBlueprintsWithBlockCount(rc.ctx.workspaceId, {
			search,
			page,
			pageSize,
		});

		const filtered = result.items.filter((b) => b.appId === appResult.appId);

		return apiSuccess(
			{
				blueprints: filtered,
				total: filtered.length,
				page,
				page_size: pageSize,
			},
			{ headers: rc.rlHeaders },
		);
	} catch (error) {
		console.error("GET /api/v1/apps/[app]/blueprints error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ app: string }> },
) {
	try {
		const setup = await setupRoute(request, "write");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = createBlueprintApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const blueprint = await createBlueprint({
			name: parsed.data.name,
			slug: parsed.data.slug,
			description: parsed.data.description,
			targetLlm: parsed.data.target_llm,
			totalTokenBudget: parsed.data.total_token_budget,
			appId: appResult.appId,
			workspaceId: rc.ctx.workspaceId,
		});

		return apiSuccess({ blueprint }, { status: 201, headers: rc.rlHeaders });
	} catch (error) {
		console.error("POST /api/v1/apps/[app]/blueprints error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
