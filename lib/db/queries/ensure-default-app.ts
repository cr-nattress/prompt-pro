import { createApp, getAppsByWorkspaceId } from "./apps";

export async function ensureDefaultApp(workspaceId: string) {
	const apps = await getAppsByWorkspaceId(workspaceId);
	if (apps[0]) {
		return apps[0];
	}

	return createApp({
		slug: "default",
		name: "Default",
		workspaceId,
	});
}
