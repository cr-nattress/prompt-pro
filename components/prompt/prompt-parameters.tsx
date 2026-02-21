"use client";

import { Badge } from "@/components/ui/badge";

interface PromptParametersProps {
	parameters: string[];
}

export function PromptParameters({ parameters }: PromptParametersProps) {
	if (parameters.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">
				No parameters detected. Use {"{{paramName}}"} syntax in your prompt.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="text-muted-foreground text-sm">
				{parameters.length} parameter{parameters.length !== 1 ? "s" : ""}{" "}
				detected
			</p>
			<div className="flex flex-wrap gap-1.5">
				{parameters.map((param) => (
					<Badge key={param} variant="outline" className="font-mono text-xs">
						{`{{${param}}}`}
					</Badge>
				))}
			</div>
		</div>
	);
}
