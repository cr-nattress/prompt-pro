import { ModelGuideGrid } from "@/components/learn/model-guide-grid";
import { MODEL_GUIDES } from "@/lib/data/model-guides";

export const metadata = {
	title: "Model Guides — Learn",
};

export default function ModelGuidesPage() {
	return <ModelGuideGrid models={MODEL_GUIDES} />;
}
