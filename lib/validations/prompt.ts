import { z } from "zod";

export const promptFormSchema = z.object({
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
	purpose: z.string().max(100).optional(),
	description: z.string().max(2000).optional(),
	tags: z.array(z.string().max(50)).max(20).optional(),
	templateText: z.string().min(1, "Prompt text is required"),
	llm: z.string().max(100).optional(),
	changeNote: z.string().max(500).optional(),
});

export type PromptFormValues = z.infer<typeof promptFormSchema>;

export const promptFilterSchema = z.object({
	search: z.string().optional(),
	purpose: z.string().optional(),
	tag: z.string().optional(),
	sort: z.enum(["updatedAt", "createdAt", "name"]).optional(),
	order: z.enum(["asc", "desc"]).optional(),
	page: z.coerce.number().int().positive().optional(),
});

export type PromptFilterValues = z.infer<typeof promptFilterSchema>;

export const appFormSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(200)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	description: z.string().max(2000).optional(),
	defaultLlm: z.string().max(100).optional(),
});

export type AppFormValues = z.infer<typeof appFormSchema>;
