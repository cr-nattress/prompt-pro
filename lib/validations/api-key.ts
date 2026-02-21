import { z } from "zod";

export const apiScopeEnum = z.enum(["read", "resolve", "write", "admin"]);

export const createApiKeySchema = z.object({
	label: z
		.string()
		.min(1, "Label is required")
		.max(100, "Label must be 100 characters or fewer"),
	scopes: z.array(apiScopeEnum).min(1, "At least one scope is required").max(4),
	app_id: z.string().uuid("Invalid app ID").optional(),
	expires_at: z.coerce.date().optional(),
});

export type CreateApiKeyValues = z.infer<typeof createApiKeySchema>;
