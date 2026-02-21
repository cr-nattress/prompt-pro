import { z } from "zod";

export const analyzePromptApiSchema = z.object({
	version_id: z.string().uuid().optional(),
});

export const enhancePromptApiSchema = z.object({
	weaknesses: z.array(z.string()).optional(),
	suggestions: z.array(z.string()).optional(),
});
