import { notFound } from "next/navigation";
import { DriftAlertList } from "@/components/drift/drift-alert-list";
import { PromptEditorLayout } from "@/components/prompt/prompt-editor-layout";
import { requireAuth } from "@/lib/auth";
import { getAppsByWorkspaceId } from "@/lib/db/queries/apps";
import { getDriftAlertsForPrompt } from "@/lib/db/queries/drift-alerts";
import { getPromptBySlugInWorkspace } from "@/lib/db/queries/prompts";
import { dismissDriftAlertAction } from "../actions";

interface EditPromptPageProps {
	params: Promise<{ slug: string }>;
}

export default async function EditPromptPage({ params }: EditPromptPageProps) {
	const { workspace } = await requireAuth();
	const { slug } = await params;

	const prompt = await getPromptBySlugInWorkspace(workspace.id, slug);
	if (!prompt) notFound();

	const [apps, driftAlerts] = await Promise.all([
		getAppsByWorkspaceId(workspace.id),
		getDriftAlertsForPrompt(prompt.id),
	]);

	return (
		<>
			{driftAlerts.length > 0 && (
				<div className="mb-4 space-y-2">
					{driftAlerts.map((alert) => (
						<DriftAlertList
							key={alert.id}
							alerts={[
								{
									alert: {
										id: alert.id,
										similarityScore: String(alert.similarityScore),
									},
									promptName: prompt.name,
									promptSlug: prompt.slug,
								},
							]}
							onDismiss={dismissDriftAlertAction}
						/>
					))}
				</div>
			)}
			<PromptEditorLayout
				mode="edit"
				prompt={prompt}
				apps={apps}
				workspaceId={workspace.id}
			/>
		</>
	);
}
