import type { Metadata } from "next";
import { BeforeAfterShowcase } from "@/components/dashboard/before-after-showcase";
import { TechniqueGrid } from "@/components/learn/technique-grid";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
	return (
		<div className="flex flex-col gap-8">
			<div>
				<h2 className="font-semibold text-xl">Techniques</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Proven prompt engineering patterns to improve your results.
				</p>
			</div>
			<TechniqueGrid />

			<BeforeAfterShowcase />
		</div>
	);
}
