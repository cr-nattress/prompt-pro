import { generateObject } from "ai";
import { z } from "zod";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";

const coachSuggestionSchema = z.object({
	suggestions: z.array(
		z.object({
			id: z.string(),
			type: z.enum([
				"missing_element",
				"technique",
				"complexity",
				"anti_pattern",
				"model_fit",
				"improvement",
			]),
			title: z.string(),
			description: z.string(),
			priority: z.enum(["high", "medium", "low"]),
			snippet: z.string().optional(),
		}),
	),
});

export type CoachSuggestion = z.infer<
	typeof coachSuggestionSchema
>["suggestions"][number];

export async function POST(request: Request) {
	try {
		await requireAuth();

		const { promptText, targetModel } = await request.json();

		if (typeof promptText !== "string" || !promptText.trim()) {
			return Response.json({ error: "promptText required" }, { status: 400 });
		}

		const model = getModel("claude-sonnet-4-6-20250514");

		const modelContext = targetModel
			? `\nThe target LLM for this prompt is: ${targetModel}. Provide model-specific advice where relevant.`
			: "";

		const { object } = await generateObject({
			model,
			schema: coachSuggestionSchema,
			system: `You are an expert prompt engineering coach. Analyze the given prompt and provide actionable suggestions for improvement. Focus on:

1. **Missing elements**: Is there a role/persona? Output format? Constraints? Examples?
2. **Techniques**: Could few-shot, chain-of-thought, or other techniques help?
3. **Complexity**: Is the prompt trying to do too much at once?
4. **Anti-patterns**: Vague directives, ambiguous instructions, conflicting requirements?
5. **Improvements**: Specific, actionable ways to make the prompt better.${modelContext}

Rules:
- Return 2-5 suggestions, prioritized by impact
- Each suggestion should have a unique id (use kebab-case like "add-output-format")
- For suggestions with a code snippet, include the text that could be added/changed
- Keep descriptions concise (1-2 sentences)
- Be specific, not generic`,
			prompt: promptText,
			temperature: 0.3,
		});

		return Response.json(object);
	} catch (error) {
		if (error instanceof Error && error.message === "Authentication required") {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}
