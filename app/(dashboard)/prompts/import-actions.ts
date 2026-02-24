"use server";

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { requireAuth } from "@/lib/auth";
import { checkPromptLimit } from "@/lib/billing/gating";
import { createApp, getAppsByWorkspaceId } from "@/lib/db/queries/apps";
import { createPrompt } from "@/lib/db/queries/prompts";
import { type ImportedPrompt, parseImportFile } from "@/lib/import";
import { slugify } from "@/lib/prompt-utils";
import type { ActionResult } from "@/types";

async function ensureDefaultApp(workspaceId: string) {
	const apps = await getAppsByWorkspaceId(workspaceId);
	// biome-ignore lint/style/noNonNullAssertion: length check guarantees element exists
	if (apps.length > 0) return apps[0]!;
	return createApp({ slug: "default", name: "Default", workspaceId });
}

export async function parseImportFileAction(
	content: string,
	filename: string,
): Promise<ActionResult<{ prompts: ImportedPrompt[]; errors: string[] }>> {
	try {
		await requireAuth();
		const result = parseImportFile(content, filename);
		return { success: true, data: result };
	} catch {
		return { success: false, error: "Failed to parse import file." };
	}
}

export async function importPromptsAction(
	prompts: ImportedPrompt[],
): Promise<
	ActionResult<{ imported: number; skipped: number; errors: string[] }>
> {
	try {
		const { workspace } = await requireAuth();

		const gate = await checkPromptLimit(workspace.id, workspace.plan);
		const available = gate.allowed
			? typeof gate.limit === "number"
				? gate.limit - gate.current
				: 999
			: 0;

		if (!gate.allowed) {
			return {
				success: false,
				error: `Prompt limit reached (${gate.current}/${gate.limitLabel}). Upgrade to import more.`,
			};
		}

		const app = await ensureDefaultApp(workspace.id);
		let imported = 0;
		let skipped = 0;
		const errors: string[] = [];

		for (const prompt of prompts) {
			if (imported >= available) {
				skipped++;
				errors.push(`${prompt.name}: skipped — would exceed plan limit`);
				continue;
			}

			try {
				const slug = slugify(prompt.name);
				const versionData: {
					templateText: string;
					llm?: string;
					changeNote?: string;
				} = {
					templateText: prompt.templateText,
					changeNote: "Imported",
				};
				if (prompt.llm) versionData.llm = prompt.llm;

				await createPrompt(
					{
						appId: app.id,
						workspaceId: workspace.id,
						slug: `${slug}-${Date.now()}`,
						name: prompt.name,
						purpose: prompt.purpose ?? null,
						description: prompt.description ?? null,
						tags: prompt.tags ?? null,
					},
					versionData,
				);
				imported++;
			} catch (e) {
				errors.push(
					`${prompt.name}: ${e instanceof Error ? e.message : "import failed"}`,
				);
				skipped++;
			}
		}

		return { success: true, data: { imported, skipped, errors } };
	} catch {
		return { success: false, error: "Failed to import prompts." };
	}
}

export async function extractFromConversationAction(
	conversationText: string,
): Promise<ActionResult<ImportedPrompt[]>> {
	try {
		await requireAuth();

		if (!conversationText.trim() || conversationText.length < 50) {
			return {
				success: false,
				error: "Please paste a longer conversation (at least 50 characters).",
			};
		}

		const { text } = await generateText({
			model: anthropic("claude-sonnet-4-6-20250514"),
			maxOutputTokens: 4000,
			system: `You extract effective prompts from AI conversation transcripts.
Analyze the conversation and identify the prompt(s) that produced the best results.
Distill each into a clean, parameterized version using {{parameter}} syntax.

Return a JSON array of objects with these fields:
- name: a descriptive name for the prompt
- description: what the prompt does
- templateText: the clean, distilled prompt text with {{parameters}}
- tags: relevant tags as an array

Return ONLY the JSON array, no markdown fences or other text.`,
			prompt: conversationText,
		});

		try {
			const cleaned = text
				.replace(/```json?\n?/g, "")
				.replace(/```/g, "")
				.trim();
			const parsed = JSON.parse(cleaned);
			const results: ImportedPrompt[] = (
				Array.isArray(parsed) ? parsed : [parsed]
			).map(
				(item: {
					name?: string;
					description?: string;
					templateText?: string;
					tags?: string[];
				}) => ({
					name: item.name ?? "Extracted Prompt",
					slug: slugify(item.name ?? "extracted-prompt"),
					description: item.description,
					templateText: item.templateText ?? "",
					tags: item.tags,
				}),
			);

			return { success: true, data: results };
		} catch {
			return {
				success: false,
				error: "Failed to parse AI response. Please try again.",
			};
		}
	} catch {
		return {
			success: false,
			error: "Failed to extract prompts from conversation.",
		};
	}
}
