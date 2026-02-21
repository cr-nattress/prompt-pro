import { z } from "zod";

export const blueprintFormSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(200)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	appId: z.string().uuid("Invalid app"),
	targetLlm: z.string().max(100).optional(),
	totalTokenBudget: z.coerce.number().int().positive().optional(),
	description: z.string().max(2000).optional(),
});

export type BlueprintFormValues = z.infer<typeof blueprintFormSchema>;

export const blockFormSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(200)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	type: z.enum(["system", "knowledge", "examples", "tools", "history", "task"]),
	description: z.string().max(2000).optional(),
	content: z.string().optional(),
	isRequired: z.boolean().optional(),
	isConditional: z.boolean().optional(),
	condition: z.string().max(500).optional(),
});

export type BlockFormValues = z.infer<typeof blockFormSchema>;
