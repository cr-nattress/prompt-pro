import { checkAnalysisQuota, enhancePrompt } from "@/lib/ai";
import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import { getPromptBySlug } from "@/lib/db/queries/prompts";
import { enhancePromptApiSchema } from "@/lib/validations/api-analysis";

export async function POST(
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

		// Quota check
		const quota = await checkAnalysisQuota(
			rc.ctx.workspaceId,
			rc.ctx.workspacePlan,
		);
		if (!quota.allowed) {
			return apiError(
				ApiErrorCode.RATE_LIMIT_EXCEEDED,
				`Analysis quota exceeded (${quota.used}/${quota.limit} this month)`,
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		const prompt = await getPromptBySlug(appResult.appId, slug);
		if (!prompt) {
			return apiError(ApiErrorCode.NOT_FOUND, `Prompt "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		// Parse optional body for weaknesses/suggestions
		let weaknesses: string[] | undefined;
		let suggestions: string[] | undefined;
		const bodyResult = await parseJsonBody(request, rc);
		if (bodyResult.ok) {
			const parsed = enhancePromptApiSchema.safeParse(bodyResult.body);
			if (parsed.success) {
				weaknesses = parsed.data.weaknesses;
				suggestions = parsed.data.suggestions;
			}
		}

		const templateText = prompt.latestVersion?.templateText ?? "";
		const result = await enhancePrompt(templateText, weaknesses, suggestions);

		return apiSuccess(
			{
				enhanced_text: result.enhancedText,
				changes_summary: result.changesSummary,
			},
			{ headers: rc.rlHeaders },
		);
	} catch (error) {
		console.error(
			"POST /api/v1/apps/[app]/prompts/[slug]/enhance error:",
			error,
		);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
