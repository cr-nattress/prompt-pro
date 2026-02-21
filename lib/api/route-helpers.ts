import { getAppBySlug } from "@/lib/db/queries/apps";
import { authenticateApiRequest } from "./auth-middleware";
import { ApiErrorCode } from "./errors";
import { checkRateLimit, rateLimitHeaders } from "./rate-limiter";
import { apiError } from "./response";
import type { ApiAuthContext, ApiScope } from "./types";

export interface RouteContext {
	requestId: string;
	ctx: ApiAuthContext;
	rlHeaders: Record<string, string>;
}

/**
 * Common setup for all API route handlers:
 * authenticate, rate limit, return context or error Response.
 */
export async function setupRoute(
	request: Request,
	requiredScope: ApiScope,
): Promise<
	{ ok: true; context: RouteContext } | { ok: false; response: Response }
> {
	const requestId = crypto.randomUUID();

	const auth = await authenticateApiRequest(request, requestId, requiredScope);
	if (!auth.ok) return auth;

	const rl = await checkRateLimit(
		auth.context.apiKeyId,
		auth.context.workspacePlan,
	);
	if (!rl.allowed) {
		return {
			ok: false,
			response: apiError(
				ApiErrorCode.RATE_LIMIT_EXCEEDED,
				"Rate limit exceeded",
				{
					requestId,
					headers: rateLimitHeaders(rl),
				},
			),
		};
	}

	return {
		ok: true,
		context: {
			requestId,
			ctx: auth.context,
			rlHeaders: rateLimitHeaders(rl),
		},
	};
}

/**
 * Resolve an app from slug param, enforcing app-scoped key restrictions.
 */
export async function resolveApp(
	appSlug: string,
	rc: RouteContext,
): Promise<{ ok: true; appId: string } | { ok: false; response: Response }> {
	const app = await getAppBySlug(rc.ctx.workspaceId, appSlug);
	if (!app) {
		return {
			ok: false,
			response: apiError(ApiErrorCode.NOT_FOUND, `App "${appSlug}" not found`, {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			}),
		};
	}

	// App-scoped key restriction
	if (rc.ctx.appId && rc.ctx.appId !== app.id) {
		return {
			ok: false,
			response: apiError(
				ApiErrorCode.FORBIDDEN,
				"This API key is restricted to a different app",
				{ requestId: rc.requestId, headers: rc.rlHeaders },
			),
		};
	}

	return { ok: true, appId: app.id };
}

/**
 * Parse JSON body from request, returning an error response if invalid.
 */
export async function parseJsonBody(
	request: Request,
	rc: RouteContext,
): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
	try {
		const body = await request.json();
		return { ok: true, body };
	} catch {
		return {
			ok: false,
			response: apiError(ApiErrorCode.VALIDATION_ERROR, "Invalid JSON body", {
				requestId: rc.requestId,
				headers: rc.rlHeaders,
			}),
		};
	}
}
