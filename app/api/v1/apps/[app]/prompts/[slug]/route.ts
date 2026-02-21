import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import {
	deletePrompt,
	getPromptBySlug,
	updatePrompt,
} from "@/lib/db/queries/prompts";
import { updatePromptApiSchema } from "@/lib/validations/api-prompt";

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

		const prompt = await getPromptBySlug(appResult.appId, slug);
		if (!prompt) {
			return apiError(ApiErrorCode.NOT_FOUND, `Prompt "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		return apiSuccess({ prompt }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("GET /api/v1/apps/[app]/prompts/[slug] error:", error);
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

		const prompt = await getPromptBySlug(appResult.appId, slug);
		if (!prompt) {
			return apiError(ApiErrorCode.NOT_FOUND, `Prompt "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = updatePromptApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const updated = await updatePrompt(prompt.id, parsed.data);

		return apiSuccess({ prompt: updated }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("PATCH /api/v1/apps/[app]/prompts/[slug] error:", error);
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

		const prompt = await getPromptBySlug(appResult.appId, slug);
		if (!prompt) {
			return apiError(ApiErrorCode.NOT_FOUND, `Prompt "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		await deletePrompt(prompt.id);

		return new Response(null, {
			status: 204,
			headers: { "X-Request-Id": rc.requestId, ...rc.rlHeaders },
		});
	} catch (error) {
		console.error("DELETE /api/v1/apps/[app]/prompts/[slug] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
