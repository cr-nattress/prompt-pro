import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import { createBlock } from "@/lib/db/queries/blocks";
import { getBlueprintBySlug } from "@/lib/db/queries/blueprints";
import { createBlockApiSchema } from "@/lib/validations/api-blueprint";

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

		const blueprint = await getBlueprintBySlug(appResult.appId, slug);
		if (!blueprint) {
			return apiError(ApiErrorCode.NOT_FOUND, `Blueprint "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = createBlockApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const blockData: Parameters<typeof createBlock>[1] = {
			name: parsed.data.name,
			slug: parsed.data.slug,
			type: parsed.data.type,
			position: parsed.data.position ?? blueprint.blocks.length,
		};
		if (parsed.data.description !== undefined)
			blockData.description = parsed.data.description;
		if (parsed.data.content !== undefined)
			blockData.content = parsed.data.content;
		if (parsed.data.is_required !== undefined)
			blockData.isRequired = parsed.data.is_required;
		if (parsed.data.is_conditional !== undefined)
			blockData.isConditional = parsed.data.is_conditional;
		if (parsed.data.condition !== undefined)
			blockData.condition = parsed.data.condition;

		const block = await createBlock(blueprint.id, blockData);

		return apiSuccess({ block }, { status: 201, headers: rc.rlHeaders });
	} catch (error) {
		console.error("POST .../blocks error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
