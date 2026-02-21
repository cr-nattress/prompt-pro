"use client";

import { AlertTriangle, Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeaknessesListProps {
	weaknesses: string[];
	suggestions: string[];
	onAppendSuggestion?: ((text: string) => void) | undefined;
}

/** Generate a brief instruction snippet from a suggestion string */
function suggestionToSnippet(suggestion: string): string {
	// Extract a short actionable phrase from the suggestion
	const lower = suggestion.toLowerCase();
	if (lower.includes("add constraints") || lower.includes("add constraint"))
		return "\n\n## Constraints\n- ";
	if (lower.includes("output format") || lower.includes("output structure"))
		return "\n\n## Expected Output Format\n";
	if (lower.includes("add example") || lower.includes("few-shot"))
		return "\n\n## Example\nInput: \nOutput: ";
	if (lower.includes("add role") || lower.includes("define role"))
		return "\n\nYou are an expert ";
	if (lower.includes("error") || lower.includes("edge case"))
		return "\n\n## Error Handling\nIf the input is invalid, ";
	// Default: append the suggestion as a comment
	return `\n\n<!-- TODO: ${suggestion} -->`;
}

export function WeaknessesList({
	weaknesses,
	suggestions,
	onAppendSuggestion,
}: WeaknessesListProps) {
	if (weaknesses.length === 0 && suggestions.length === 0) return null;

	return (
		<div className="space-y-4">
			{weaknesses.length > 0 && (
				<div className="space-y-2">
					<h4 className="font-medium text-sm">Weaknesses</h4>
					<div className="space-y-1.5">
						{weaknesses.map((w) => (
							<div
								key={w}
								className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm dark:border-amber-900 dark:bg-amber-950"
							>
								<AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
								<span className="text-amber-900 dark:text-amber-200">{w}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{suggestions.length > 0 && (
				<div className="space-y-2">
					<h4 className="font-medium text-sm">Suggestions</h4>
					<div className="space-y-1.5">
						{suggestions.map((s) => (
							<div
								key={s}
								className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-2.5 text-sm dark:border-blue-900 dark:bg-blue-950"
							>
								<Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
								<span className="flex-1 text-blue-900 dark:text-blue-200">
									{s}
								</span>
								{onAppendSuggestion && (
									<Button
										variant="ghost"
										size="icon-sm"
										className="shrink-0"
										onClick={() => onAppendSuggestion(suggestionToSnippet(s))}
										title="Insert template text"
									>
										<Plus className="h-3.5 w-3.5" />
									</Button>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
