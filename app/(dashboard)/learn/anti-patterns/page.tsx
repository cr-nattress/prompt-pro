import { AntiPatternGrid } from "@/components/learn/anti-pattern-grid";

export default function AntiPatternsPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">Anti-Patterns</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Common prompt engineering mistakes to recognize and avoid.
				</p>
			</div>
			<AntiPatternGrid />
		</div>
	);
}
