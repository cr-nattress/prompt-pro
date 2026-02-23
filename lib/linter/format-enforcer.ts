export type OutputFormat =
	| "json"
	| "markdown"
	| "csv"
	| "xml"
	| "yaml"
	| "html";

export interface FormatSuggestion {
	id: string;
	title: string;
	description: string;
	snippet: string;
}

interface FormatPattern {
	format: OutputFormat;
	pattern: RegExp;
	label: string;
}

const FORMAT_PATTERNS: FormatPattern[] = [
	{
		format: "json",
		pattern: /\b(json|JSON)\b/,
		label: "JSON",
	},
	{
		format: "markdown",
		pattern: /\b(markdown|Markdown|MD)\b/,
		label: "Markdown",
	},
	{
		format: "csv",
		pattern: /\b(csv|CSV|comma.?separated)\b/,
		label: "CSV",
	},
	{
		format: "xml",
		pattern: /\b(xml|XML)\b/,
		label: "XML",
	},
	{
		format: "yaml",
		pattern: /\b(yaml|YAML|yml)\b/,
		label: "YAML",
	},
	{
		format: "html",
		pattern: /\b(html|HTML)\b/,
		label: "HTML",
	},
];

const FORMAT_SUGGESTIONS: Record<OutputFormat, FormatSuggestion[]> = {
	json: [
		{
			id: "json-only",
			title: "Enforce JSON-only output",
			description: "Add strict instruction to respond only with valid JSON",
			snippet:
				"\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON object.",
		},
		{
			id: "json-schema",
			title: "Add JSON schema definition",
			description: "Define the expected JSON structure",
			snippet:
				'\n\nExpected JSON schema:\n```json\n{\n  "field1": "string",\n  "field2": "number",\n  "field3": ["array of strings"]\n}\n```',
		},
		{
			id: "json-example",
			title: "Add example JSON output",
			description: "Provide an example to improve format compliance",
			snippet:
				'\n\nExample output:\n```json\n{\n  "result": "example value",\n  "confidence": 0.95\n}\n```',
		},
	],
	markdown: [
		{
			id: "md-structure",
			title: "Define Markdown structure",
			description: "Specify which heading levels and formatting to use",
			snippet:
				"\n\nFormat the response using Markdown with:\n- H2 (##) for main sections\n- H3 (###) for subsections\n- Bullet points for lists\n- Code blocks for any code snippets",
		},
		{
			id: "md-toc",
			title: "Request table of contents",
			description: "Add instruction for a table of contents",
			snippet:
				"\n\nInclude a table of contents at the beginning with links to each section.",
		},
	],
	csv: [
		{
			id: "csv-headers",
			title: "Define CSV headers",
			description: "Specify the expected column headers",
			snippet:
				"\n\nFormat as CSV with the following columns:\ncolumn1,column2,column3\n\nInclude the header row as the first line.",
		},
		{
			id: "csv-strict",
			title: "Enforce strict CSV format",
			description: "Add rules for CSV compliance",
			snippet:
				"\n\nCSV formatting rules:\n- Use commas as delimiters\n- Wrap fields containing commas in double quotes\n- No trailing commas\n- One record per line",
		},
	],
	xml: [
		{
			id: "xml-strict",
			title: "Enforce valid XML",
			description: "Add strict XML formatting instructions",
			snippet:
				"\n\nRespond with valid, well-formed XML. Include an XML declaration and ensure all tags are properly closed.",
		},
		{
			id: "xml-schema",
			title: "Define XML structure",
			description: "Specify the expected XML element structure",
			snippet:
				"\n\nUse the following XML structure:\n```xml\n<root>\n  <item>\n    <name>string</name>\n    <value>string</value>\n  </item>\n</root>\n```",
		},
	],
	yaml: [
		{
			id: "yaml-strict",
			title: "Enforce valid YAML",
			description: "Add strict YAML formatting instructions",
			snippet:
				"\n\nRespond ONLY with valid YAML. Use consistent 2-space indentation. Do not include any text outside the YAML block.",
		},
	],
	html: [
		{
			id: "html-semantic",
			title: "Use semantic HTML",
			description: "Request semantic HTML elements",
			snippet:
				"\n\nUse semantic HTML5 elements (header, main, section, article, nav, footer) for structure. Include proper heading hierarchy.",
		},
	],
};

export function detectOutputFormats(text: string): OutputFormat[] {
	const detected: OutputFormat[] = [];
	for (const { format, pattern } of FORMAT_PATTERNS) {
		if (pattern.test(text)) {
			detected.push(format);
		}
	}
	return detected;
}

export function getFormatLabel(format: OutputFormat): string {
	const match = FORMAT_PATTERNS.find((p) => p.format === format);
	return match?.label ?? format.toUpperCase();
}

export function getFormatSuggestions(
	formats: OutputFormat[],
): FormatSuggestion[] {
	const suggestions: FormatSuggestion[] = [];
	for (const format of formats) {
		const formatSuggestions = FORMAT_SUGGESTIONS[format];
		if (formatSuggestions) {
			suggestions.push(...formatSuggestions);
		}
	}
	return suggestions;
}

export function hasFormatEnforcement(text: string): boolean {
	return /\b(ONLY|only|strictly|IMPORTANT:.*format|respond.*with.*valid)\b/.test(
		text,
	);
}
