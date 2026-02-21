import { authenticateApiRequest } from "@/lib/api/auth-middleware";
import { ApiErrorCode } from "@/lib/api/errors";
import { checkRateLimit, rateLimitHeaders } from "@/lib/api/rate-limiter";
import { apiError } from "@/lib/api/response";
import { deleteApiKey } from "@/lib/db/queries/api-keys";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const requestId = crypto.randomUUID();
	const { id } = await params;

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

	const deleted = await deleteApiKey(id, auth.context.workspaceId);
	if (!deleted) {
		return apiError(ApiErrorCode.NOT_FOUND, "API key not found", {
			requestId,
			headers: rateLimitHeaders(rl),
		});
	}

	return new Response(null, {
		status: 204,
		headers: {
			"X-Request-Id": requestId,
			...rateLimitHeaders(rl),
		},
	});
}
