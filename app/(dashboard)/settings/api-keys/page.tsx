import { ApiKeyList } from "@/components/api-keys/api-key-list";
import { requireAuth } from "@/lib/auth";
import { getApiKeysByWorkspace } from "@/lib/db/queries/api-keys";
import { getAppsByWorkspaceId } from "@/lib/db/queries/apps";

export default async function ApiKeysSettingsPage() {
	const { workspace } = await requireAuth();
	const [keys, apps] = await Promise.all([
		getApiKeysByWorkspace(workspace.id),
		getAppsByWorkspaceId(workspace.id),
	]);

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-2xl">API Keys</h1>
			<p className="text-muted-foreground">
				Manage API keys for programmatic access to your prompts and blueprints.
			</p>
			<ApiKeyList keys={keys} apps={apps} />
		</div>
	);
}
