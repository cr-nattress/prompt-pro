"use server";

import { generateText } from "ai";
import { checkAnalysisQuota } from "@/lib/ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/types";

export interface FewShotExample {
	input: string;
	output: string;
}

export async function generateFewShotExamplesAction(
	templateText: string,
): Promise<ActionResult<FewShotExample[]>> {
	try {
		const { workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month).`,
			};
		}

		const { text } = await generateText({
			model: getModel("claude-sonnet-4-6-20250514"),
			temperature: 0.5,
			maxOutputTokens: 4096,
			system: `You are a prompt engineering expert. Generate diverse few-shot examples that demonstrate the desired input/output behavior for a given prompt.

Your response MUST follow this exact format, with exactly 3 examples:

EXAMPLE_1_INPUT:
[realistic sample input]
EXAMPLE_1_OUTPUT:
[expected output matching the prompt's requirements]

EXAMPLE_2_INPUT:
[different realistic sample input]
EXAMPLE_2_OUTPUT:
[expected output matching the prompt's requirements]

EXAMPLE_3_INPUT:
[edge case or different scenario input]
EXAMPLE_3_OUTPUT:
[expected output matching the prompt's requirements]

Rules:
- Examples should be diverse (cover different scenarios, not variations of the same thing)
- Example 3 should be an edge case or boundary condition
- Outputs must match the format and style the prompt requests
- Keep each example concise but realistic
- If the prompt has {{parameters}}, use realistic sample values`,
			prompt: `Generate 3 few-shot examples for this prompt:

---
${templateText}
---

Create diverse input/output pairs that demonstrate the behavior this prompt is designed for.`,
		});

		const examples: FewShotExample[] = [];
		for (let i = 1; i <= 3; i++) {
			const inputRegex = new RegExp(
				`EXAMPLE_${i}_INPUT:\\n([\\s\\S]*?)EXAMPLE_${i}_OUTPUT:`,
			);
			const outputRegex = new RegExp(
				`EXAMPLE_${i}_OUTPUT:\\n([\\s\\S]*?)(?:EXAMPLE_${i + 1}_INPUT:|$)`,
			);

			const inputMatch = text.match(inputRegex);
			const outputMatch = text.match(outputRegex);

			if (inputMatch?.[1] && outputMatch?.[1]) {
				examples.push({
					input: inputMatch[1].trim(),
					output: outputMatch[1].trim(),
				});
			}
		}

		if (examples.length === 0) {
			return {
				success: false,
				error: "Failed to generate examples. Try again.",
			};
		}

		return { success: true, data: examples };
	} catch {
		return {
			success: false,
			error: "Failed to generate few-shot examples.",
		};
	}
}
