import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import {
	createPrompt,
	getPromptsWithLatestVersion,
} from "@/lib/db/queries/prompts";
import { createPromptApiSchema } from "@/lib/validations/api-prompt";

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

		const result = await getPromptsWithLatestVersion(rc.ctx.workspaceId, {
			search,
			page,
			pageSize,
		});

		// Filter to only this app's prompts
		const filtered = result.items.filter((p) => p.appId === appResult.appId);

		return apiSuccess(
			{
				prompts: filtered,
				total: filtered.length,
				page,
				page_size: pageSize,
			},
			{ headers: rc.rlHeaders },
		);
	} catch (error) {
		console.error("GET /api/v1/apps/[app]/prompts error:", error);
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

		const parsed = createPromptApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const { template_text, llm, change_note, ...templateData } = parsed.data;

		const versionData: {
			templateText: string;
			llm?: string;
			changeNote?: string;
		} = {
			templateText: template_text,
		};
		if (llm !== undefined) versionData.llm = llm;
		if (change_note !== undefined) versionData.changeNote = change_note;

		const result = await createPrompt(
			{
				...templateData,
				appId: appResult.appId,
				workspaceId: rc.ctx.workspaceId,
			},
			versionData,
		);

		return apiSuccess(
			{ prompt: result },
			{ status: 201, headers: rc.rlHeaders },
		);
	} catch (error) {
		console.error("POST /api/v1/apps/[app]/prompts error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
