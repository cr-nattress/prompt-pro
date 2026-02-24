/**
 * Export utilities for prompts and blueprints.
 * Supports JSON, YAML, Markdown, and CSV formats.
 */

import type { PromptTemplate, PromptVersion } from "@/lib/db/schema";

export type ExportFormat = "json" | "yaml" | "markdown" | "csv";

interface ExportablePrompt {
	name: string;
	slug: string;
	purpose: string | null;
	description: string | null;
	tags: string[] | null;
	parameterSchema: unknown;
	createdAt: Date;
	updatedAt: Date;
	versions: {
		version: number;
		templateText: string;
		llm: string | null;
		status: string;
		changeNote: string | null;
		createdAt: Date;
	}[];
}

export function formatPromptForExport(
	prompt: PromptTemplate,
	versions: PromptVersion[],
): ExportablePrompt {
	return {
		name: prompt.name,
		slug: prompt.slug,
		purpose: prompt.purpose,
		description: prompt.description,
		tags: prompt.tags,
		parameterSchema: prompt.parameterSchema,
		createdAt: prompt.createdAt,
		updatedAt: prompt.updatedAt,
		versions: versions.map((v) => ({
			version: v.version,
			templateText: v.templateText,
			llm: v.llm,
			status: v.status,
			changeNote: v.changeNote,
			createdAt: v.createdAt,
		})),
	};
}

export function exportToJson(
	prompts: ExportablePrompt[],
	pretty = true,
): string {
	const data = {
		exportedAt: new Date().toISOString(),
		format: "promptvault-export-v1",
		count: prompts.length,
		prompts,
	};
	return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

export function exportToYaml(prompts: ExportablePrompt[]): string {
	const lines: string[] = [
		"# PromptVault Export",
		`# Exported at: ${new Date().toISOString()}`,
		`# Count: ${prompts.length}`,
		"---",
	];

	for (const prompt of prompts) {
		lines.push("");
		lines.push(`- name: "${escapeYaml(prompt.name)}"`);
		lines.push(`  slug: "${escapeYaml(prompt.slug)}"`);
		if (prompt.purpose)
			lines.push(`  purpose: "${escapeYaml(prompt.purpose)}"`);
		if (prompt.description)
			lines.push(`  description: "${escapeYaml(prompt.description)}"`);
		if (prompt.tags && prompt.tags.length > 0) {
			lines.push("  tags:");
			for (const tag of prompt.tags) {
				lines.push(`    - "${escapeYaml(tag)}"`);
			}
		}
		lines.push(`  createdAt: "${prompt.createdAt.toISOString()}"`);
		lines.push(`  updatedAt: "${prompt.updatedAt.toISOString()}"`);

		if (prompt.versions.length > 0) {
			lines.push("  versions:");
			for (const v of prompt.versions) {
				lines.push(`    - version: ${v.version}`);
				lines.push(`      status: "${v.status}"`);
				if (v.llm) lines.push(`      llm: "${escapeYaml(v.llm)}"`);
				if (v.changeNote)
					lines.push(`      changeNote: "${escapeYaml(v.changeNote)}"`);
				lines.push(`      createdAt: "${v.createdAt.toISOString()}"`);
				lines.push(`      templateText: |`);
				for (const line of v.templateText.split("\n")) {
					lines.push(`        ${line}`);
				}
			}
		}
	}

	return lines.join("\n");
}

export function exportToMarkdown(prompts: ExportablePrompt[]): string {
	const parts: string[] = [
		"# PromptVault Export",
		"",
		`> Exported at ${new Date().toISOString()} | ${prompts.length} prompt(s)`,
		"",
		"---",
	];

	for (const prompt of prompts) {
		parts.push("");
		parts.push(`## ${prompt.name}`);
		parts.push("");
		if (prompt.description) {
			parts.push(`*${prompt.description}*`);
			parts.push("");
		}
		if (prompt.purpose) {
			parts.push(`**Purpose:** ${prompt.purpose}`);
		}
		if (prompt.tags && prompt.tags.length > 0) {
			parts.push(`**Tags:** ${prompt.tags.join(", ")}`);
		}
		parts.push(`**Slug:** \`${prompt.slug}\``);
		parts.push(`**Created:** ${prompt.createdAt.toISOString().split("T")[0]}`);
		parts.push("");

		for (const v of prompt.versions) {
			parts.push(
				`### Version ${v.version} (${v.status})${v.llm ? ` — ${v.llm}` : ""}`,
			);
			if (v.changeNote) {
				parts.push(`> ${v.changeNote}`);
			}
			parts.push("");
			parts.push("```");
			parts.push(v.templateText);
			parts.push("```");
			parts.push("");
		}

		parts.push("---");
	}

	return parts.join("\n");
}

export function exportToCsv(prompts: ExportablePrompt[]): string {
	const headers = [
		"Name",
		"Slug",
		"Purpose",
		"Description",
		"Tags",
		"Latest Version",
		"Status",
		"LLM",
		"Template Text",
		"Created At",
		"Updated At",
	];

	const rows = prompts.map((prompt) => {
		const latest = prompt.versions[0];
		return [
			csvEscape(prompt.name),
			csvEscape(prompt.slug),
			csvEscape(prompt.purpose ?? ""),
			csvEscape(prompt.description ?? ""),
			csvEscape(prompt.tags?.join("; ") ?? ""),
			latest ? String(latest.version) : "",
			latest?.status ?? "",
			csvEscape(latest?.llm ?? ""),
			csvEscape(latest?.templateText ?? ""),
			prompt.createdAt.toISOString(),
			prompt.updatedAt.toISOString(),
		];
	});

	return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function exportPrompts(
	prompts: ExportablePrompt[],
	format: ExportFormat,
): { content: string; mimeType: string; extension: string } {
	switch (format) {
		case "json":
			return {
				content: exportToJson(prompts),
				mimeType: "application/json",
				extension: "json",
			};
		case "yaml":
			return {
				content: exportToYaml(prompts),
				mimeType: "text/yaml",
				extension: "yaml",
			};
		case "markdown":
			return {
				content: exportToMarkdown(prompts),
				mimeType: "text/markdown",
				extension: "md",
			};
		case "csv":
			return {
				content: exportToCsv(prompts),
				mimeType: "text/csv",
				extension: "csv",
			};
	}
}

function escapeYaml(s: string): string {
	return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function csvEscape(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}
