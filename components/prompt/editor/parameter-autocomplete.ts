import type {
	Completion,
	CompletionContext,
	CompletionResult,
} from "@codemirror/autocomplete";

export function createParameterCompletion(knownParams: string[]) {
	return function parameterCompletion(
		context: CompletionContext,
	): CompletionResult | null {
		// Match `{{` followed by any partial param name
		const match = context.matchBefore(/\{\{[\w]*/);
		if (!match) return null;

		// Only trigger if we have the opening `{{`
		if (!match.text.startsWith("{{")) return null;

		const options: Completion[] = knownParams.map((name) => ({
			label: name,
			type: "variable",
			apply: `${name}}}`,
		}));

		return {
			from: match.from + 2, // after `{{`
			options,
			validFor: /^\w*$/,
		};
	};
}
