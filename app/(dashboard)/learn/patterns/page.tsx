import type { Metadata } from "next";
import { PatternGrid } from "@/components/learn/pattern-grid";

export const metadata: Metadata = { title: "Prompt Patterns" };

export default function PatternsPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">Prompt Patterns</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Reusable prompt templates for common tasks. Copy, customize, and use.
				</p>
			</div>
			<PatternGrid />
		</div>
	);
}
