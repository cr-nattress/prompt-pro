import { notFound } from "next/navigation";
import { TemplateDetail } from "@/components/gallery/template-detail";
import { getTemplate } from "@/lib/data/prompt-templates";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params;
	const template = getTemplate(slug);
	return {
		title: template ? `${template.name} — Template` : "Template",
	};
}

export default async function TemplateDetailPage({ params }: Props) {
	const { slug } = await params;
	const template = getTemplate(slug);
	if (!template) notFound();

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
			<TemplateDetail template={template} />
		</div>
	);
}
