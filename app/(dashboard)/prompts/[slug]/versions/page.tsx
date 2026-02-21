import { notFound } from "next/navigation";
import { VersionTimeline } from "@/components/version/version-timeline";
import { requireAuth } from "@/lib/auth";
import {
	getPromptBySlugInWorkspace,
	getPromptVersions,
} from "@/lib/db/queries/prompts";
import {
	promotePromptVersionAction,
	restorePromptVersionAction,
} from "../../version-actions";

interface PromptVersionsPageProps {
	params: Promise<{ slug: string }>;
}

export default async function PromptVersionsPage({
	params,
}: PromptVersionsPageProps) {
	const { workspace } = await requireAuth();
	const { slug } = await params;

	const prompt = await getPromptBySlugInWorkspace(workspace.id, slug);
	if (!prompt) notFound();

	const versions = await getPromptVersions(prompt.id);

	async function handlePromote(
		versionId: string,
		entityId: string,
		newStatus: "active" | "stable" | "deprecated",
	) {
		"use server";
		return promotePromptVersionAction(versionId, entityId, newStatus);
	}

	async function handleRestore(entityId: string, sourceVersionId: string) {
		"use server";
		return restorePromptVersionAction(entityId, sourceVersionId);
	}

	return (
		<VersionTimeline
			entityType="prompt"
			entityId={prompt.id}
			entityName={prompt.name}
			entitySlug={prompt.slug}
			versions={versions}
			backHref={`/prompts/${prompt.slug}`}
			onPromote={handlePromote}
			onRestore={handleRestore}
		/>
	);
}
