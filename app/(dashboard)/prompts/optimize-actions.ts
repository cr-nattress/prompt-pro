"use server";

import { generateText } from "ai";
import { checkAnalysisQuota } from "@/lib/ai";
import { getModel } from "@/lib/ai/provider";
import { requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/types";

export interface ModelOptimization {
	optimizedText: string;
	targetModel: string;
	changesSummary: string[];
}

const MODEL_FAMILIES: Record<string, { label: string; instructions: string }> =
	{
		claude: {
			label: "Claude (Anthropic)",
			instructions: `Optimize this prompt specifically for Claude models. Apply these Claude-specific best practices:
1. Wrap distinct sections in XML tags (e.g., <instructions>, <context>, <examples>, <output_format>)
2. Move behavioral rules and persona into a clear system-level section at the top
3. Use explicit "You are..." role definitions
4. Leverage Claude's strength with structured reasoning — add "Think step by step" where appropriate
5. Use <thinking> tags for chain-of-thought when the task requires reasoning
6. Add explicit output format instructions using XML tags like <answer>
7. Prefer clear, direct instructions over implicit ones`,
		},
		gpt: {
			label: "GPT (OpenAI)",
			instructions: `Optimize this prompt specifically for GPT models. Apply these GPT-specific best practices:
1. Structure as a clear system message + user message split (mark with [SYSTEM] and [USER] headers)
2. Add JSON mode hints if the output should be structured ("Respond with valid JSON")
3. Use numbered instructions for complex tasks (GPT follows numbered lists well)
4. Be very explicit about output format — GPT is more likely to deviate without clear format specs
5. Add "Do not include any text outside the JSON" for structured outputs
6. Use markdown headers for section organization
7. Include explicit temperature/behavior guidance in the system section`,
		},
		"open-source": {
			label: "Open-Source (Llama, Mistral, etc.)",
			instructions: `Optimize this prompt for open-source/smaller models. Apply these best practices:
1. Simplify complex instructions — break into shorter, clearer sentences
2. Add very explicit formatting instructions (smaller models need more guidance)
3. Reduce reliance on implicit understanding — spell everything out
4. Use simple templates with clear delimiters (### markers, --- dividers)
5. Remove nuanced or multi-layered instructions that require strong instruction-following
6. Add explicit examples (few-shot) since smaller models benefit more from examples
7. Keep the total prompt shorter — smaller context windows`,
		},
	};

// OPTIMIZATION_TARGETS moved to lib/data/optimization-targets.ts for client import

export async function optimizeForModelAction(
	templateText: string,
	targetModelFamily: string,
): Promise<ActionResult<ModelOptimization>> {
	try {
		const { workspace } = await requireAuth();

		const quota = await checkAnalysisQuota(workspace.id, workspace.plan);
		if (!quota.allowed) {
			return {
				success: false,
				error: `Analysis quota exceeded (${quota.used}/${quota.limit} this month).`,
			};
		}

		const family = MODEL_FAMILIES[targetModelFamily];
		if (!family) {
			return { success: false, error: "Invalid target model family." };
		}

		const { text } = await generateText({
			model: getModel("claude-sonnet-4-6-20250514"),
			temperature: 0.3,
			maxOutputTokens: 4096,
			system: `You are a prompt optimization expert. Your task is to restructure prompts for specific LLM families while preserving the original intent and functionality.

Rules:
- Preserve ALL original content and intent
- Only restructure, reformat, and add model-specific optimizations
- Do NOT add new instructions that weren't implied by the original
- Do NOT remove any core requirements

Your response MUST follow this exact format:
OPTIMIZED:
[the full optimized prompt]

CHANGES:
- [change 1]
- [change 2]
- [change 3]`,
			prompt: `${family.instructions}

Original prompt to optimize:
---
${templateText}
---

Restructure this prompt for ${family.label}. Preserve the original intent completely.`,
		});

		const optimizedMatch = text.match(/OPTIMIZED:\n([\s\S]*?)(?:\nCHANGES:|$)/);
		const changesMatch = text.match(/CHANGES:\n([\s\S]*?)$/);

		const optimizedText = optimizedMatch?.[1]?.trim() ?? templateText;
		const changesText = changesMatch?.[1]?.trim() ?? "";
		const changesSummary = changesText
			.split("\n")
			.map((line) => line.replace(/^-\s*/, "").trim())
			.filter(Boolean);

		return {
			success: true,
			data: {
				optimizedText,
				targetModel: targetModelFamily,
				changesSummary,
			},
		};
	} catch {
		return {
			success: false,
			error: "Failed to optimize prompt for target model.",
		};
	}
}
