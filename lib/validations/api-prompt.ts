import { z } from "zod";

const slugPattern = /^[a-z0-9-]+$/;

export const createPromptApiSchema = z.object({
	name: z.string().min(1).max(200),
	slug: z
		.string()
		.min(1)
		.max(200)
		.regex(
			slugPattern,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	purpose: z.string().max(100).optional(),
	description: z.string().max(2000).optional(),
	tags: z.array(z.string().max(50)).max(20).optional(),
	template_text: z.string().min(1, "Template text is required"),
	llm: z.string().max(100).optional(),
	change_note: z.string().max(500).optional(),
});

export const updatePromptApiSchema = z.object({
	name: z.string().min(1).max(200).optional(),
	slug: z.string().min(1).max(200).regex(slugPattern).optional(),
	purpose: z.string().max(100).optional(),
	description: z.string().max(2000).optional(),
	tags: z.array(z.string().max(50)).max(20).optional(),
});

export const createVersionApiSchema = z.object({
	template_text: z.string().min(1, "Template text is required"),
	llm: z.string().max(100).optional(),
	change_note: z.string().max(500).optional(),
});

export const promoteVersionApiSchema = z.object({
	status: z.enum(["active", "stable", "deprecated"]),
});
