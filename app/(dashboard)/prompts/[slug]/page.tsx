import { notFound } from "next/navigation";
import { PromptEditorLayout } from "@/components/prompt/prompt-editor-layout";
import { requireAuth } from "@/lib/auth";
import { getAppsByWorkspaceId } from "@/lib/db/queries/apps";
import { getPromptBySlugInWorkspace } from "@/lib/db/queries/prompts";

interface EditPromptPageProps {
	params: Promise<{ slug: string }>;
}

export default async function EditPromptPage({ params }: EditPromptPageProps) {
	const { workspace } = await requireAuth();
	const { slug } = await params;

	const prompt = await getPromptBySlugInWorkspace(workspace.id, slug);
	if (!prompt) notFound();

	const apps = await getAppsByWorkspaceId(workspace.id);

	return (
		<PromptEditorLayout
			mode="edit"
			prompt={prompt}
			apps={apps}
			workspaceId={workspace.id}
		/>
	);
}
