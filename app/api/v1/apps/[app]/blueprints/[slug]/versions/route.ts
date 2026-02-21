import { ApiErrorCode } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, resolveApp, setupRoute } from "@/lib/api/route-helpers";
import {
	createBlueprintVersion,
	getBlueprintVersions,
} from "@/lib/db/queries/blueprint-versions";
import { getBlueprintBySlug } from "@/lib/db/queries/blueprints";
import { createBlueprintVersionApiSchema } from "@/lib/validations/api-blueprint";

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

		const versions = await getBlueprintVersions(blueprint.id);

		return apiSuccess({ versions }, { headers: rc.rlHeaders });
	} catch (error) {
		console.error("GET .../blueprint/versions error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}

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

		const parsed = createBlueprintVersionApiSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const version = await createBlueprintVersion(blueprint.id, {
			changeNote: parsed.data.change_note,
		});

		return apiSuccess({ version }, { status: 201, headers: rc.rlHeaders });
	} catch (error) {
		console.error("POST .../blueprint/versions error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
