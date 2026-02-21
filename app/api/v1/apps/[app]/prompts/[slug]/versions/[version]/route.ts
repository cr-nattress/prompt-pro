import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import {
	getPromptBySlug,
	getPromptVersionByNumber,
	promotePromptVersion,
} from "@/lib/db/queries/prompts";
import { promoteVersionApiSchema } from "@/lib/validations/api-prompt";

export async function GET(
	request: Request,
	{
		params,
	}: { params: Promise<{ app: string; slug: string; version: string }> },
) {
	try {
		const setup = await setupRoute(request, "read");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug, slug, version: versionStr } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const prompt = await getPromptBySlug(appResult.appId, slug);
		if (!prompt) {
			return apiError(ApiErrorCode.NOT_FOUND, `Prompt "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const versionNum = Number.parseInt(versionStr, 10);
		if (Number.isNaN(versionNum) || versionNum < 1) {
			return apiError(
				ApiErrorCode.VALIDATION_ERROR,
				"Version must be a positive integer",
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		const version = await getPromptVersionByNumber(prompt.id, versionNum);
		if (!version) {
			return apiError(
				ApiErrorCode.NOT_FOUND,
				`Version ${versionNum} not found for prompt "${slug}"`,
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		return apiSuccess({ version }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("GET .../versions/[version] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function PATCH(
	request: Request,
	{
		params,
	}: { params: Promise<{ app: string; slug: string; version: string }> },
) {
	try {
		const setup = await setupRoute(request, "write");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug, slug, version: versionStr } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const prompt = await getPromptBySlug(appResult.appId, slug);
		if (!prompt) {
			return apiError(ApiErrorCode.NOT_FOUND, `Prompt "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const versionNum = Number.parseInt(versionStr, 10);
		if (Number.isNaN(versionNum) || versionNum < 1) {
			return apiError(
				ApiErrorCode.VALIDATION_ERROR,
				"Version must be a positive integer",
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		const version = await getPromptVersionByNumber(prompt.id, versionNum);
		if (!version) {
			return apiError(
				ApiErrorCode.NOT_FOUND,
				`Version ${versionNum} not found for prompt "${slug}"`,
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = promoteVersionApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const promoted = await promotePromptVersion(
			version.id,
			prompt.id,
			parsed.data.status,
		);

		return apiSuccess({ version: promoted }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("PATCH .../versions/[version] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
