import { z } from "zod";

export const resolveRequestSchema = z.object({
	ref: z.string().min(1, "Ref is required"),
	params: z.record(z.string(), z.string()).optional(),
	options: z
		.object({
			format: z.enum(["text", "json"]).optional(),
			include_metadata: z.boolean().optional(),
		})
		.optional(),
});

export type ResolveRequestValues = z.infer<typeof resolveRequestSchema>;
