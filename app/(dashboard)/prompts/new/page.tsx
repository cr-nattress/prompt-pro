import { PromptEditorLayout } from "@/components/prompt/prompt-editor-layout";
import { requireAuth } from "@/lib/auth";
import { getAppsByWorkspaceId } from "@/lib/db/queries/apps";

export default async function NewPromptPage() {
	const { workspace } = await requireAuth();
	const apps = await getAppsByWorkspaceId(workspace.id);

	return (
		<PromptEditorLayout mode="create" apps={apps} workspaceId={workspace.id} />
	);
}
