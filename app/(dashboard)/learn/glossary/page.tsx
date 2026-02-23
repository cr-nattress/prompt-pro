import { GlossaryList } from "@/components/learn/glossary-list";

export default function GlossaryPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">Glossary</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Key terms and concepts in prompt and context engineering.
				</p>
			</div>
			<GlossaryList />
		</div>
	);
}
