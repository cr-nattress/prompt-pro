import { BlueprintDesignerLayout } from "@/components/blueprint/blueprint-designer-layout";
import { requireAuth } from "@/lib/auth";
import { getAppsByWorkspaceId } from "@/lib/db/queries/apps";

export default async function NewBlueprintPage() {
	const { workspace } = await requireAuth();
	const apps = await getAppsByWorkspaceId(workspace.id);

	return (
		<BlueprintDesignerLayout
			mode="create"
			apps={apps}
			workspaceId={workspace.id}
		/>
	);
}
