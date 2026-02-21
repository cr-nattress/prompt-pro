import { notFound } from "next/navigation";
import { VersionTimeline } from "@/components/version/version-timeline";
import { requireAuth } from "@/lib/auth";
import { getBlueprintVersions } from "@/lib/db/queries/blueprint-versions";
import { getBlueprintBySlugInWorkspace } from "@/lib/db/queries/blueprints";
import { promoteBlueprintVersionAction } from "../../version-actions";

interface BlueprintVersionsPageProps {
	params: Promise<{ slug: string }>;
}

export default async function BlueprintVersionsPage({
	params,
}: BlueprintVersionsPageProps) {
	const { workspace } = await requireAuth();
	const { slug } = await params;

	const blueprint = await getBlueprintBySlugInWorkspace(workspace.id, slug);
	if (!blueprint) notFound();

	const versions = await getBlueprintVersions(blueprint.id);

	async function handlePromote(
		versionId: string,
		entityId: string,
		newStatus: "active" | "stable" | "deprecated",
	) {
		"use server";
		return promoteBlueprintVersionAction(versionId, entityId, newStatus);
	}

	async function handleRestore(_entityId: string, _sourceVersionId: string) {
		"use server";
		// Blueprint restore not implemented (would need to restore block snapshots)
		return {
			success: false as const,
			error: "Blueprint restore not yet supported",
		};
	}

	return (
		<VersionTimeline
			entityType="blueprint"
			entityId={blueprint.id}
			entityName={blueprint.name}
			entitySlug={blueprint.slug}
			versions={versions}
			backHref={`/blueprints/${blueprint.slug}`}
			onPromote={handlePromote}
			onRestore={handleRestore}
		/>
	);
}
