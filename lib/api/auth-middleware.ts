import {
	getApiKeyByHash,
	touchApiKeyLastUsed,
} from "@/lib/db/queries/api-keys";
import { ApiErrorCode } from "./errors";
import { hashApiKey } from "./key-utils";
import { apiError } from "./response";
import type { ApiAuthResult, ApiScope } from "./types";

/**
 * Authenticate an API request using Bearer token auth.
 * Hashes the token, looks up the key in the DB, checks expiry and scope.
 */
export async function authenticateApiRequest(
	request: Request,
	requestId: string,
	requiredScope?: ApiScope,
): Promise<ApiAuthResult> {
	const authHeader = request.headers.get("Authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return {
			ok: false,
			response: apiError(
				ApiErrorCode.UNAUTHORIZED,
				"Missing or invalid Authorization header. Use: Bearer <api-key>",
				{ requestId },
			),
		};
	}

	const token = authHeader.slice(7);
	if (!token) {
		return {
			ok: false,
			response: apiError(ApiErrorCode.UNAUTHORIZED, "API key is empty", {
				requestId,
			}),
		};
	}

	const keyHash = await hashApiKey(token);
	const row = await getApiKeyByHash(keyHash);

	if (!row) {
		return {
			ok: false,
			response: apiError(ApiErrorCode.UNAUTHORIZED, "Invalid API key", {
				requestId,
			}),
		};
	}

	// Check expiry
	if (row.expiresAt && row.expiresAt < new Date()) {
		return {
			ok: false,
			response: apiError(ApiErrorCode.KEY_EXPIRED, "API key has expired", {
				requestId,
			}),
		};
	}

	const scopes = (row.scopes ?? []) as ApiScope[];

	// Admin scope grants all permissions
	if (
		requiredScope &&
		!scopes.includes("admin") &&
		!scopes.includes(requiredScope)
	) {
		return {
			ok: false,
			response: apiError(
				ApiErrorCode.SCOPE_REQUIRED,
				`This endpoint requires the "${requiredScope}" scope`,
				{ requestId },
			),
		};
	}

	// Fire-and-forget lastUsedAt update
	void touchApiKeyLastUsed(row.id);

	return {
		ok: true,
		context: {
			apiKeyId: row.id,
			workspaceId: row.workspaceId,
			workspacePlan: row.workspacePlan,
			scopes,
			appId: row.appId,
		},
	};
}
