import { API_ERROR_STATUS, type ApiErrorCode } from "./errors";

export function apiSuccess<T>(
	data: T,
	init?: { status?: number; headers?: Record<string, string> },
): Response {
	const requestId = crypto.randomUUID();
	return Response.json(data, {
		status: init?.status ?? 200,
		headers: {
			"X-Request-Id": requestId,
			...init?.headers,
		},
	});
}

export function apiError(
	code: ApiErrorCode,
	message: string,
	options?: {
		details?: unknown;
		requestId?: string;
		headers?: Record<string, string>;
	},
): Response {
	const status = API_ERROR_STATUS[code];
	const requestId = options?.requestId ?? crypto.randomUUID();
	return Response.json(
		{
			error: {
				code,
				message,
				...(options?.details !== undefined && { details: options.details }),
			},
		},
		{
			status,
			headers: {
				"X-Request-Id": requestId,
				...options?.headers,
			},
		},
	);
}
