import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import {
	deleteBlueprint,
	getBlueprintBySlug,
	updateBlueprint,
} from "@/lib/db/queries/blueprints";
import { updateBlueprintApiSchema } from "@/lib/validations/api-blueprint";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ app: string; slug: string }> },
) {
	try {
		const setup = await setupRoute(request, "read");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug, slug } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const blueprint = await getBlueprintBySlug(appResult.appId, slug);
		if (!blueprint) {
			return apiError(ApiErrorCode.NOT_FOUND, `Blueprint "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		return apiSuccess({ blueprint }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("GET .../blueprints/[slug] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ app: string; slug: string }> },
) {
	try {
		const setup = await setupRoute(request, "write");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug, slug } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const blueprint = await getBlueprintBySlug(appResult.appId, slug);
		if (!blueprint) {
			return apiError(ApiErrorCode.NOT_FOUND, `Blueprint "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = updateBlueprintApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const updated = await updateBlueprint(blueprint.id, {
			name: parsed.data.name,
			slug: parsed.data.slug,
			description: parsed.data.description,
			targetLlm: parsed.data.target_llm,
			totalTokenBudget: parsed.data.total_token_budget,
		});

		return apiSuccess({ blueprint: updated }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("PATCH .../blueprints/[slug] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ app: string; slug: string }> },
) {
	try {
		const setup = await setupRoute(request, "write");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug, slug } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const blueprint = await getBlueprintBySlug(appResult.appId, slug);
		if (!blueprint) {
			return apiError(ApiErrorCode.NOT_FOUND, `Blueprint "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		await deleteBlueprint(blueprint.id);

		return new Response(null, {
			status: 204,
			headers: { "X-Request-Id": rc.requestId, ...rc.rlHeaders },
		});
	} catch (error) {
		console.error("DELETE .../blueprints/[slug] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
