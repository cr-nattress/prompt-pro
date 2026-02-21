import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import { deleteBlock, updateBlock } from "@/lib/db/queries/blocks";
import { getBlueprintBySlug } from "@/lib/db/queries/blueprints";
import { updateBlockApiSchema } from "@/lib/validations/api-blueprint";

export async function PATCH(
	request: Request,
	{
		params,
	}: { params: Promise<{ app: string; slug: string; blockId: string }> },
) {
	try {
		const setup = await setupRoute(request, "write");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug, slug, blockId } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const blueprint = await getBlueprintBySlug(appResult.appId, slug);
		if (!blueprint) {
			return apiError(ApiErrorCode.NOT_FOUND, `Blueprint "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		// Verify block belongs to this blueprint
		const blockExists = blueprint.blocks.some((b) => b.id === blockId);
		if (!blockExists) {
			return apiError(ApiErrorCode.NOT_FOUND, "Block not found", {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = updateBlockApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const updated = await updateBlock(blockId, {
			name: parsed.data.name,
			slug: parsed.data.slug,
			type: parsed.data.type,
			description: parsed.data.description,
			content: parsed.data.content,
			isRequired: parsed.data.is_required,
			isConditional: parsed.data.is_conditional,
			condition: parsed.data.condition,
			position: parsed.data.position,
		});

		return apiSuccess({ block: updated }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("PATCH .../blocks/[blockId] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

export async function DELETE(
	request: Request,
	{
		params,
	}: { params: Promise<{ app: string; slug: string; blockId: string }> },
) {
	try {
		const setup = await setupRoute(request, "write");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const { app: appSlug, slug, blockId } = await params;
		const appResult = await resolveApp(appSlug, rc);
		if (!appResult.ok) return appResult.response;

		const blueprint = await getBlueprintBySlug(appResult.appId, slug);
		if (!blueprint) {
			return apiError(ApiErrorCode.NOT_FOUND, `Blueprint "${slug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const blockExists = blueprint.blocks.some((b) => b.id === blockId);
		if (!blockExists) {
			return apiError(ApiErrorCode.NOT_FOUND, "Block not found", {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		await deleteBlock(blockId);

		return new Response(null, {
			status: 204,
			headers: { "X-Request-Id": rc.requestId, ...rc.rlHeaders },
		});
	} catch (error) {
		console.error("DELETE .../blocks/[blockId] error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
