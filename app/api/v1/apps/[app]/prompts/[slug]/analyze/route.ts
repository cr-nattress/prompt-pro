import { analyzePrompt, checkAnalysisQuota } from "@/lib/ai";
import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import { createAnalysis } from "@/lib/db/queries/analyses";
import {
	getPromptBySlug,
	getPromptVersionById,
} from "@/lib/db/queries/prompts";
import { analyzePromptApiSchema } from "@/lib/validations/api-analysis";

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

		// Parse optional body
		const bodyResult = await parseJsonBody(request, rc);
		let versionId: string | undefined;
		if (bodyResult.ok) {
			const parsed = analyzePromptApiSchema.safeParse(bodyResult.body);
			if (parsed.success) {
				versionId = parsed.data.version_id;
			}
		}

		// Determine template text to analyze
		let templateText = prompt.latestVersion?.templateText ?? "";
		let promptVersionId: string | undefined;

		if (versionId) {
			const version = await getPromptVersionById(versionId);
			if (!version || version.promptTemplateId !== prompt.id) {
				return apiError(
					ApiErrorCode.NOT_FOUND,
					"Version not found for this prompt",
					{ requestId: rc.requestId, headers: rc.rlHeaders },
				);
			}
			templateText = version.templateText;
			promptVersionId = version.id;
		} else if (prompt.latestVersion) {
			promptVersionId = prompt.latestVersion.id;
		}

		const metadata: { name?: string; purpose?: string; description?: string } =
			{ name: prompt.name };
		if (prompt.purpose) metadata.purpose = prompt.purpose;
		if (prompt.description) metadata.description = prompt.description;

		const result = await analyzePrompt(templateText, metadata);

		const analysis = await createAnalysis({
			promptId: prompt.id,
			promptVersionId,
			clarity: result.scores.clarity,
			specificity: result.scores.specificity,
			contextAdequacy: result.scores.contextAdequacy,
			roleDefinition: result.scores.roleDefinition,
			constraintQuality: result.scores.constraintQuality,
			exampleUsage: result.scores.exampleUsage,
			errorHandling: result.scores.errorHandling,
			outputFormatting: result.scores.outputFormatting,
			tokenEfficiency: result.scores.tokenEfficiency,
			safetyAlignment: result.scores.safetyAlignment,
			taskDecomposition: result.scores.taskDecomposition,
			creativityScope: result.scores.creativityScope,
			overallScore: result.overallScore,
			weaknesses: result.weaknesses,
			suggestions: result.suggestions,
		});

		return apiSuccess({ analysis }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error(
			"POST /api/v1/apps/[app]/prompts/[slug]/analyze error:",
			error,
		);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
