"use client";

import { Lightbulb, X } from "lucide-react";
import { useState } from "react";

interface EducationTipProps {
	tip: string;
}

export function EducationTip({ tip }: EducationTipProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	return (
		<div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
			<Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
			<p className="flex-1 text-muted-foreground text-sm">{tip}</p>
			<button
				type="button"
				onClick={() => setDismissed(true)}
				className="shrink-0 text-muted-foreground hover:text-foreground"
			>
				<X className="h-3.5 w-3.5" />
				<span className="sr-only">Dismiss tip</span>
			</button>
		</div>
	);
}
