/**
 * Import utilities for prompts.
 * Parses JSON and YAML export formats back into importable data.
 */

export interface ImportedPrompt {
	name: string;
	slug: string;
	purpose?: string | undefined;
	description?: string | undefined;
	tags?: string[] | undefined;
	templateText: string;
	llm?: string | undefined;
}

interface ImportResult {
	prompts: ImportedPrompt[];
	errors: string[];
}

export function parseImportFile(
	content: string,
	filename: string,
): ImportResult {
	const ext = filename.toLowerCase().split(".").pop();

	if (ext === "json") {
		return parseJsonImport(content);
	}
	if (ext === "yaml" || ext === "yml") {
		return parseYamlImport(content);
	}

	return { prompts: [], errors: [`Unsupported file format: .${ext}`] };
}

function parseJsonImport(content: string): ImportResult {
	const errors: string[] = [];
	const prompts: ImportedPrompt[] = [];

	try {
		const data = JSON.parse(content);

		// Handle PromptVault export format
		const items = data.prompts ?? (Array.isArray(data) ? data : [data]);

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (!item.name || typeof item.name !== "string") {
				errors.push(`Item ${i + 1}: missing or invalid "name" field`);
				continue;
			}

			const latestVersion =
				item.versions && item.versions.length > 0
					? item.versions[item.versions.length - 1]
					: null;

			const templateText =
				item.templateText ??
				latestVersion?.templateText ??
				item.template ??
				item.content ??
				"";

			if (!templateText) {
				errors.push(`Item ${i + 1} (${item.name}): no template text found`);
				continue;
			}

			prompts.push({
				name: item.name,
				slug: item.slug ?? slugify(item.name),
				purpose: item.purpose ?? undefined,
				description: item.description ?? undefined,
				tags: Array.isArray(item.tags) ? item.tags : undefined,
				templateText,
				llm: item.llm ?? latestVersion?.llm ?? undefined,
			});
		}
	} catch (e) {
		errors.push(
			`Invalid JSON: ${e instanceof Error ? e.message : "parse error"}`,
		);
	}

	return { prompts, errors };
}

function parseYamlImport(content: string): ImportResult {
	// Simple YAML parser for our export format
	const errors: string[] = [];
	const prompts: ImportedPrompt[] = [];

	try {
		const items = parseSimpleYaml(content);

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (!item.name) {
				errors.push(`Item ${i + 1}: missing "name" field`);
				continue;
			}

			const templateText =
				item.templateText ?? item.versions?.[0]?.templateText ?? "";
			if (!templateText) {
				errors.push(`Item ${i + 1} (${item.name}): no template text found`);
				continue;
			}

			prompts.push({
				name: item.name,
				slug: item.slug ?? slugify(item.name),
				purpose: item.purpose ?? undefined,
				description: item.description ?? undefined,
				tags: item.tags ?? undefined,
				templateText,
				llm: item.llm ?? undefined,
			});
		}
	} catch (e) {
		errors.push(
			`YAML parse error: ${e instanceof Error ? e.message : "unknown"}`,
		);
	}

	return { prompts, errors };
}

// biome-ignore lint/suspicious/noExplicitAny: flexible YAML parsing requires any
function parseSimpleYaml(content: string): any[] {
	// Very basic YAML list-of-objects parser
	// Handles our export format: list items starting with "- name:"
	const items: Record<string, unknown>[] = [];
	let current: Record<string, unknown> | null = null;
	let inBlock = false;
	let blockKey = "";
	let blockLines: string[] = [];

	for (const rawLine of content.split("\n")) {
		if (rawLine.startsWith("#") || rawLine === "---") continue;

		if (inBlock) {
			if (rawLine.startsWith("        ")) {
				blockLines.push(rawLine.slice(8));
				continue;
			}
			if (current) {
				current[blockKey] = blockLines.join("\n");
			}
			inBlock = false;
			blockLines = [];
		}

		if (rawLine.startsWith("- name:")) {
			if (current) items.push(current);
			current = {};
			const val = rawLine.slice(7).trim();
			current.name = unquote(val);
		} else if (
			rawLine.startsWith("  ") &&
			current &&
			!rawLine.startsWith("    -")
		) {
			const colonIdx = rawLine.indexOf(":");
			if (colonIdx > 0) {
				const key = rawLine.slice(2, colonIdx).trim();
				const val = rawLine.slice(colonIdx + 1).trim();
				if (val === "|") {
					inBlock = true;
					blockKey = key;
					blockLines = [];
				} else {
					current[key] = unquote(val);
				}
			}
		}
	}

	if (inBlock && current) {
		current[blockKey] = blockLines.join("\n");
	}
	if (current) items.push(current);

	return items;
}

function unquote(s: string): string {
	if (s.startsWith('"') && s.endsWith('"')) {
		return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
	}
	return s;
}

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
