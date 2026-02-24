import type { Metadata } from "next";
import { BeforeAfterShowcase } from "@/components/dashboard/before-after-showcase";

export const metadata: Metadata = { title: "Before/After Showcases" };

export default function ShowcasesPage() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-semibold text-lg">Before/After Showcases</h2>
				<p className="text-muted-foreground text-sm">
					Real-world examples showing how prompt engineering techniques
					transform vague prompts into effective ones.
				</p>
			</div>
			<BeforeAfterShowcase />
		</div>
	);
}
