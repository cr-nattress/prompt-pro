import { PromptEditorLayout } from "@/components/prompt/prompt-editor-layout";
import { GuidedBuilder } from "@/components/wizard/guided-builder";
import { requireAuth } from "@/lib/auth";
import { getAppsByWorkspaceId } from "@/lib/db/queries/apps";

export default async function NewPromptPage({
	searchParams,
}: {
	searchParams: Promise<{ mode?: string }>;
}) {
	const { workspace } = await requireAuth();
	const params = await searchParams;

	if (params.mode === "guided") {
		return <GuidedBuilder />;
	}

	const apps = await getAppsByWorkspaceId(workspace.id);

	return (
		<PromptEditorLayout mode="create" apps={apps} workspaceId={workspace.id} />
	);
}
