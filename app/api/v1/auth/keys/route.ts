import { authenticateApiRequest } from "@/lib/api/auth-middleware";
import { ApiErrorCode } from "@/lib/api/errors";
import { generateApiKey, hashApiKey } from "@/lib/api/key-utils";
import { checkRateLimit, rateLimitHeaders } from "@/lib/api/rate-limiter";
import { apiError, apiSuccess } from "@/lib/api/response";
import {
	countApiKeysByWorkspace,
	createApiKey,
	getApiKeysByWorkspace,
} from "@/lib/db/queries/api-keys";
import { createApiKeySchema } from "@/lib/validations/api-key";

const PLAN_KEY_LIMITS = { free: 2, pro: 10, team: Infinity } as const;

export async function GET(request: Request) {
	const requestId = crypto.randomUUID();

	const auth = await authenticateApiRequest(request, requestId, "admin");
	if (!auth.ok) return auth.response;

	const rl = await checkRateLimit(
		auth.context.apiKeyId,
		auth.context.workspacePlan,
	);
	if (!rl.allowed) {
		return apiError(ApiErrorCode.RATE_LIMIT_EXCEEDED, "Rate limit exceeded", {
			requestId,
			headers: rateLimitHeaders(rl),
		});
	}

	const keys = await getApiKeysByWorkspace(auth.context.workspaceId);

	return apiSuccess({ keys }, { headers: rateLimitHeaders(rl) });
}

export async function POST(request: Request) {
	const requestId = crypto.randomUUID();

	const auth = await authenticateApiRequest(request, requestId, "admin");
	if (!auth.ok) return auth.response;

	const rl = await checkRateLimit(
		auth.context.apiKeyId,
		auth.context.workspacePlan,
	);
	if (!rl.allowed) {
		return apiError(ApiErrorCode.RATE_LIMIT_EXCEEDED, "Rate limit exceeded", {
			requestId,
			headers: rateLimitHeaders(rl),
		});
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return apiError(ApiErrorCode.VALIDATION_ERROR, "Invalid JSON body", {
			requestId,
			headers: rateLimitHeaders(rl),
		});
	}

	const parsed = createApiKeySchema.safeParse(body);
	if (!parsed.success) {
		return apiError(ApiErrorCode.VALIDATION_ERROR, "Validation failed", {
			requestId,
			details: parsed.error.issues,
			headers: rateLimitHeaders(rl),
		});
	}

	// Check plan limit
	const currentCount = await countApiKeysByWorkspace(auth.context.workspaceId);
	const limit = PLAN_KEY_LIMITS[auth.context.workspacePlan];
	if (currentCount >= limit) {
		return apiError(
			ApiErrorCode.FORBIDDEN,
			`Your ${auth.context.workspacePlan} plan allows a maximum of ${limit} API keys`,
			{ requestId, headers: rateLimitHeaders(rl) },
		);
	}

	const token = generateApiKey("live");
	const keyHash = await hashApiKey(token);

	const row = await createApiKey({
		workspaceId: auth.context.workspaceId,
		keyHash,
		label: parsed.data.label,
		scopes: parsed.data.scopes,
		appId: parsed.data.app_id ?? null,
		expiresAt: parsed.data.expires_at ?? null,
	});

	return apiSuccess(
		{
			key: {
				id: row.id,
				label: row.label,
				scopes: row.scopes,
				appId: row.appId,
				expiresAt: row.expiresAt,
				createdAt: row.createdAt,
				token,
			},
			note: "Store this token securely. It will not be shown again.",
		},
		{ status: 201, headers: rateLimitHeaders(rl) },
	);
}
