"use client";

import { ChevronRight, FileCode, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	detectOutputFormats,
	getFormatLabel,
	getFormatSuggestions,
	hasFormatEnforcement,
} from "@/lib/linter/format-enforcer";

interface FormatEnforcerPanelProps {
	promptText: string;
	onInsertSnippet: (snippet: string) => void;
}

export function FormatEnforcerPanel({
	promptText,
	onInsertSnippet,
}: FormatEnforcerPanelProps) {
	const formats = useMemo(() => detectOutputFormats(promptText), [promptText]);
	const suggestions = useMemo(() => getFormatSuggestions(formats), [formats]);
	const hasEnforcement = useMemo(
		() => hasFormatEnforcement(promptText),
		[promptText],
	);

	if (formats.length === 0) {
		return (
			<div className="px-4 py-6 text-center text-muted-foreground text-sm">
				No output format detected in the prompt. Mention a format like JSON,
				Markdown, or CSV to get compliance suggestions.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 p-4">
			<div className="flex items-center gap-2">
				<FileCode className="h-4 w-4 text-primary" />
				<span className="font-medium text-sm">Detected formats:</span>
				{formats.map((format) => (
					<Badge key={format} variant="secondary" className="text-xs">
						{getFormatLabel(format)}
					</Badge>
				))}
			</div>

			{hasEnforcement && (
				<div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-sm">
					<ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
					<span className="text-green-700 text-xs dark:text-green-300">
						Format enforcement detected in prompt
					</span>
				</div>
			)}

			<div className="flex flex-col gap-2">
				{suggestions.map((suggestion) => (
					<div key={suggestion.id} className="rounded-lg border bg-card p-3">
						<div className="flex flex-col gap-1">
							<span className="font-medium text-sm">{suggestion.title}</span>
							<p className="text-muted-foreground text-xs">
								{suggestion.description}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="mt-2 w-full text-xs"
							onClick={() => onInsertSnippet(suggestion.snippet)}
						>
							<ChevronRight className="mr-1 h-3 w-3" />
							Insert
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
