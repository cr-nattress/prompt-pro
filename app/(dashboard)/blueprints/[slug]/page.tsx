import { notFound } from "next/navigation";
import { BlueprintDesignerLayout } from "@/components/blueprint/blueprint-designer-layout";
import { requireAuth } from "@/lib/auth";
import { getAppsByWorkspaceId } from "@/lib/db/queries/apps";
import { getBlueprintBySlugInWorkspace } from "@/lib/db/queries/blueprints";

interface EditBlueprintPageProps {
	params: Promise<{ slug: string }>;
}

export default async function EditBlueprintPage({
	params,
}: EditBlueprintPageProps) {
	const { workspace } = await requireAuth();
	const { slug } = await params;

	const blueprint = await getBlueprintBySlugInWorkspace(workspace.id, slug);
	if (!blueprint) notFound();

	const apps = await getAppsByWorkspaceId(workspace.id);

	return (
		<BlueprintDesignerLayout
			mode="edit"
			blueprint={blueprint}
			apps={apps}
			workspaceId={workspace.id}
		/>
	);
}
