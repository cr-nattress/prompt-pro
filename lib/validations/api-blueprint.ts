import { z } from "zod";

const slugPattern = /^[a-z0-9-]+$/;

export const createBlueprintApiSchema = z.object({
	name: z.string().min(1).max(200),
	slug: z
		.string()
		.min(1)
		.max(200)
		.regex(
			slugPattern,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	target_llm: z.string().max(100).optional(),
	total_token_budget: z.coerce.number().int().positive().optional(),
	description: z.string().max(2000).optional(),
});

export const updateBlueprintApiSchema = z.object({
	name: z.string().min(1).max(200).optional(),
	slug: z.string().min(1).max(200).regex(slugPattern).optional(),
	target_llm: z.string().max(100).optional(),
	total_token_budget: z.coerce.number().int().positive().optional(),
	description: z.string().max(2000).optional(),
});

export const createBlockApiSchema = z.object({
	name: z.string().min(1).max(200),
	slug: z.string().min(1).max(200).regex(slugPattern),
	type: z.enum(["system", "knowledge", "examples", "tools", "history", "task"]),
	description: z.string().max(2000).optional(),
	content: z.string().optional(),
	is_required: z.boolean().optional(),
	is_conditional: z.boolean().optional(),
	condition: z.string().max(500).optional(),
	position: z.coerce.number().int().nonnegative().optional(),
});

export const updateBlockApiSchema = z.object({
	name: z.string().min(1).max(200).optional(),
	slug: z.string().min(1).max(200).regex(slugPattern).optional(),
	type: z
		.enum(["system", "knowledge", "examples", "tools", "history", "task"])
		.optional(),
	description: z.string().max(2000).optional(),
	content: z.string().optional(),
	is_required: z.boolean().optional(),
	is_conditional: z.boolean().optional(),
	condition: z.string().max(500).optional(),
	position: z.coerce.number().int().nonnegative().optional(),
});

export const createBlueprintVersionApiSchema = z.object({
	change_note: z.string().max(500).optional(),
});

export const promoteBlueprintVersionApiSchema = z.object({
	status: z.enum(["active", "stable", "deprecated"]),
});
