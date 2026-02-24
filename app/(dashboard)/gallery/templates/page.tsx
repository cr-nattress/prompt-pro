import { TemplateGrid } from "@/components/gallery/template-grid";

export const metadata = {
	title: "Prompt Templates",
};

export default function TemplatesPage() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
			<div>
				<h1 className="font-semibold text-2xl tracking-tight">
					Prompt Templates
				</h1>
				<p className="text-muted-foreground text-sm">
					Curated starter prompts — fork one and make it your own
				</p>
			</div>
			<TemplateGrid />
		</div>
	);
}
