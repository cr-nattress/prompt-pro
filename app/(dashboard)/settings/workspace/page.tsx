import { WorkspaceSettings } from "@/components/settings/workspace-settings";
import { requireAuth } from "@/lib/auth";

export default async function SettingsWorkspacePage() {
	const { workspace } = await requireAuth();

	return (
		<WorkspaceSettings
			name={workspace.name}
			slug={workspace.slug}
			plan={workspace.plan}
		/>
	);
}
