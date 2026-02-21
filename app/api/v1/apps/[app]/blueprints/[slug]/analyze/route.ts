import { analyzeBlueprint, checkAnalysisQuota } from "@/lib/ai";
import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { resolveApp, setupRoute } from "@/lib/api/route-helpers";
import { createAnalysis } from "@/lib/db/queries/analyses";
import { getBlueprintBySlug } from "@/lib/db/queries/blueprints";

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

		const blueprint = await getBlueprintBySlug(appResult.appId, slug);
		if (!blueprint) {
			return apiError(ApiErrorCode.NOT_FOUND, `Blueprint "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const blockInputs = blueprint.blocks.map((b) => ({
			slug: b.slug,
			name: b.name,
			type: b.type,
			content: b.content,
			position: b.position,
			isRequired: b.isRequired,
			isConditional: b.isConditional,
			condition: b.condition,
		}));

		const metadata: {
			name?: string;
			description?: string;
			targetLlm?: string;
			totalTokenBudget?: number;
		} = { name: blueprint.name };
		if (blueprint.description) metadata.description = blueprint.description;
		if (blueprint.targetLlm) metadata.targetLlm = blueprint.targetLlm;
		if (blueprint.totalTokenBudget)
			metadata.totalTokenBudget = blueprint.totalTokenBudget;

		const result = await analyzeBlueprint(blockInputs, metadata);

		// Map blueprint scores to DB columns
		const analysis = await createAnalysis({
			blueprintId: blueprint.id,
			clarity: result.scores.sufficiency,
			specificity: result.scores.relevance,
			contextAdequacy: result.scores.grounding,
			roleDefinition: result.scores.coherence,
			constraintQuality: result.scores.placement,
			tokenEfficiency: result.scores.budgetEfficiency,
			errorHandling: result.scores.adaptability,
			overallScore: result.overallScore,
			weaknesses: result.weaknesses,
			suggestions: result.suggestions,
			enhancedPromptText: JSON.stringify(result.blockFeedback),
		});

		return apiSuccess(
			{
				analysis,
				block_feedback: result.blockFeedback,
			},
			{ headers: rc.rlHeaders },
		);
	} catch (error) {
		console.error(
			"POST /api/v1/apps/[app]/blueprints/[slug]/analyze error:",
			error,
		);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
