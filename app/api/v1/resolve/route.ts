import { cacheHeaders, checkEtag, computeEtag } from "@/lib/api/cache";
import { ApiErrorCode } from "@/lib/api/errors";
import { hashParameters } from "@/lib/api/key-utils";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, setupRoute } from "@/lib/api/route-helpers";
import { getAppBySlug } from "@/lib/db/queries/apps";
import { createResolveLog } from "@/lib/db/queries/resolve-logs";
import { parseRef } from "@/lib/resolve/ref-parser";
import { interpolateTemplate } from "@/lib/resolve/template-interpolator";
import { resolvePromptVersion } from "@/lib/resolve/version-resolver";
import { countTokens } from "@/lib/token-utils";
import { resolveRequestSchema } from "@/lib/validations/resolve";

export async function POST(request: Request) {
	const startTime = performance.now();

	try {
		const setup = await setupRoute(request, "resolve");
		if (!setup.ok) return setup.response;
		const rc = setup.context;

		const bodyResult = await parseJsonBody(request, rc);
		if (!bodyResult.ok) return bodyResult.response;

		const parsed = resolveRequestSchema.safeParse(bodyResult.body);
		if (!parsed.success) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
				requestId: rc.requestId,
				details: parsed.error.issues,
				headers: rc.rlHeaders,
			});
		}

		const { ref, params = {}, options = {} } = parsed.data;

		// Parse the ref string
		const refResult = parseRef(ref);
		if (!refResult.ok) {
			return apiError(ApiErrorCode.VALIDATION_ERROR, refResult.reason, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		const { appSlug, entitySlug, versionTag } = refResult.ref;

		// Resolve app (workspace scoped via API key)
		const app = await getAppBySlug(rc.ctx.workspaceId, appSlug);
		if (!app) {
			return apiError(ApiErrorCode.NOT_FOUND, `App "${appSlug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			});
		}

		// Enforce app-scoped key restriction
		if (rc.ctx.appId && rc.ctx.appId !== app.id) {
			return apiError(
				ApiErrorCode.FORBIDDEN,
				"This API key is restricted to a different app",
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		// Resolve prompt version
		const { prompt, version } = await resolvePromptVersion(
			app.id,
			entitySlug,
			versionTag,
		);

		if (!prompt) {
			return apiError(
				ApiErrorCode.NOT_FOUND,
				`Prompt "${entitySlug}" not found in app "${appSlug}"`,
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		if (!version) {
			const tagDesc =
				versionTag.type === "latest"
					? "latest"
					: versionTag.type === "status"
						? versionTag.status
						: `v${versionTag.version}`;
			return apiError(
				ApiErrorCode.NOT_FOUND,
				`No version matching "${tagDesc}" found for prompt "${entitySlug}"`,
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			);
		}

		// Interpolate template
		const { resolved, unresolvedParams } = interpolateTemplate(
			version.templateText,
			params,
		);

		const tokenCount = countTokens(resolved);
		const latencyMs = Math.round(performance.now() - startTime);

		// Build resolved ref string
		const resolvedRef = `${appSlug}/${entitySlug}@v${version.version}`;

		// Fire-and-forget resolve log
		void (async () => {
			try {
				const paramsHash =
					Object.keys(params).length > 0 ? await hashParameters(params) : null;
				await createResolveLog({
					promptVersionId: version.id,
					apiKeyId: rc.ctx.apiKeyId,
					parametersUsedHash: paramsHash,
					latencyMs,
				});
			} catch {
				// Non-critical; don't let logging failures affect the response
			}
		})();

		const response: Record<string, unknown> = {
			ref,
			resolved_ref: resolvedRef,
			prompt_version_id: version.id,
			resolved_text: resolved,
			unresolved_params: unresolvedParams,
			token_count: tokenCount,
			latency_ms: latencyMs,
		};

		if (options.include_metadata) {
			response.metadata = {
				prompt_id: prompt.id,
				prompt_name: prompt.name,
				version_number: version.version,
				version_status: version.status,
				llm: version.llm,
				created_at: version.createdAt,
			};
		}

		// ETag caching
		const etag = await computeEtag(resolved);
		if (checkEtag(request, etag)) {
			return new Response(null, {
				status: 304,
				headers: {
					"X-Request-Id": rc.requestId,
					...rc.rlHeaders,
					...cacheHeaders(etag),
				},
			});
		}

		return apiSuccess(response, {
			headers: { ...rc.rlHeaders, ...cacheHeaders(etag) },
		});
	} catch (error) {
		console.error("POST /api/v1/resolve error:", error);
		return apiError(ApiErrorCode.INTERNAL_ERROR, "Internal server error");
	}
}
