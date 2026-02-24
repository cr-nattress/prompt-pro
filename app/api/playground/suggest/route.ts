import { generateText } from "ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
	try {
		await requireAuth();

		const { textBefore, textAfter } = await request.json();

		if (typeof textBefore !== "string" || !textBefore.trim()) {
			return Response.json({ error: "textBefore required" }, { status: 400 });
		}

		// Use Haiku for speed and cost efficiency
		const model = getModel("claude-haiku-4-5-20251001");

		const { text } = await generateText({
			model,
			system: `You are an AI prompt engineering assistant. Given a partial prompt, suggest a natural continuation. Rules:
- Output ONLY the suggested text (no explanation, no quotes, no prefix)
- Keep the suggestion short (1-2 sentences max)
- Match the style and tone of the existing text
- If the prompt looks complete, respond with an empty string`,
			prompt: `Continue this prompt naturally:

${textBefore}[CURSOR]${typeof textAfter === "string" ? textAfter : ""}`,
			maxOutputTokens: 150,
			temperature: 0.3,
		});

		return Response.json({ suggestion: text.trim() });
	} catch (error) {
		if (error instanceof Error && error.message === "Authentication required") {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}
