import { notFound } from "next/navigation";
import { ModelGuideDetail } from "@/components/learn/model-guide-detail";
import { getModelGuide, MODEL_GUIDES } from "@/lib/data/model-guides";

interface ModelDetailPageProps {
	params: Promise<{ modelSlug: string }>;
}

export function generateStaticParams() {
	return MODEL_GUIDES.map((m) => ({ modelSlug: m.slug }));
}

export async function generateMetadata({ params }: ModelDetailPageProps) {
	const { modelSlug } = await params;
	const model = getModelGuide(modelSlug);
	return { title: model ? `${model.name} — Model Guide` : "Model Guide" };
}

export default async function ModelDetailPage({
	params,
}: ModelDetailPageProps) {
	const { modelSlug } = await params;
	const model = getModelGuide(modelSlug);
	if (!model) notFound();

	return <ModelGuideDetail model={model} />;
}
