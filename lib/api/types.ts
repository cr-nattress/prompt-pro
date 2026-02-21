export type ApiScope = "read" | "resolve" | "write" | "admin";

export interface ApiAuthContext {
	apiKeyId: string;
	workspaceId: string;
	workspacePlan: "free" | "pro" | "team";
	scopes: ApiScope[];
	appId: string | null;
}

export type ApiAuthResult =
	| { ok: true; context: ApiAuthContext }
	| { ok: false; response: Response };

export interface ApiErrorBody {
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
}
