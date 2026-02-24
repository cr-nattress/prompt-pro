import type {
	Completion,
	CompletionContext,
	CompletionResult,
} from "@codemirror/autocomplete";
import { PROMPT_PATTERNS } from "@/lib/data/prompt-patterns";

interface PatternTrigger {
	phrase: string;
	patternSlug: string;
}

const PATTERN_TRIGGERS: PatternTrigger[] = [
	// chain-of-thought
	{ phrase: "Step 1:", patternSlug: "chain-of-thought" },
	{ phrase: "Think through", patternSlug: "chain-of-thought" },
	{ phrase: "step by step", patternSlug: "chain-of-thought" },
	// few-shot
	{ phrase: "Example:", patternSlug: "few-shot" },
	{ phrase: "Example 1:", patternSlug: "few-shot" },
	{ phrase: "Input:", patternSlug: "few-shot" },
	{ phrase: "Output:", patternSlug: "few-shot" },
	// role-assignment
	{ phrase: "You are a", patternSlug: "role-assignment" },
	{ phrase: "You are an", patternSlug: "role-assignment" },
	{ phrase: "Act as", patternSlug: "role-assignment" },
	// output-format-json
	{ phrase: "```json", patternSlug: "output-format-json" },
	{ phrase: "JSON schema", patternSlug: "output-format-json" },
	{ phrase: "Respond with JSON", patternSlug: "output-format-json" },
	// self-critique
	{ phrase: "Phase 1:", patternSlug: "self-critique" },
	{ phrase: "Review your", patternSlug: "self-critique" },
	{ phrase: "critique", patternSlug: "self-critique" },
	// xml-structured
	{ phrase: "<context>", patternSlug: "xml-structured" },
	{ phrase: "<instructions>", patternSlug: "xml-structured" },
	{ phrase: "<input>", patternSlug: "xml-structured" },
];

const patternMap = new Map(PROMPT_PATTERNS.map((p) => [p.slug, p]));

export function patternAutocomplete(
	context: CompletionContext,
): CompletionResult | null {
	const line = context.state.doc.lineAt(context.pos);
	const textBefore = line.text.slice(0, context.pos - line.from);

	if (textBefore.length < 3) return null;

	const matchedSlugs = new Set<string>();
	let earliestFrom = context.pos;

	for (const trigger of PATTERN_TRIGGERS) {
		const lowerText = textBefore.toLowerCase();
		const lowerPhrase = trigger.phrase.toLowerCase();
		const idx = lowerText.lastIndexOf(lowerPhrase);
		if (idx !== -1) {
			matchedSlugs.add(trigger.patternSlug);
			const fromPos = line.from + idx;
			if (fromPos < earliestFrom) {
				earliestFrom = fromPos;
			}
		}
	}

	if (matchedSlugs.size === 0) return null;

	const completions: Completion[] = [];
	for (const slug of matchedSlugs) {
		const pattern = patternMap.get(slug);
		if (!pattern) continue;
		completions.push({
			label: pattern.title,
			detail: pattern.description.slice(0, 80) + "...",
			apply: pattern.template,
			type: "text",
			boost: 1,
		});
	}

	return {
		from: earliestFrom,
		options: completions,
		filter: false,
	};
}
