import { requireAuth } from "@/lib/auth";
import { getAppsWithPromptCount } from "@/lib/db/queries/apps";
import { AppList } from "./app-list";

export default async function AppsSettingsPage() {
	const { workspace } = await requireAuth();
	const apps = await getAppsWithPromptCount(workspace.id);

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-2xl">Apps</h1>
			<p className="text-muted-foreground">
				Apps group related prompts together. Each prompt belongs to one app.
			</p>
			<AppList apps={apps} />
		</div>
	);
}
