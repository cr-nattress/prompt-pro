import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CompareView } from "@/components/version/compare-view";
import { StatusBadge } from "@/components/version/status-badge";
import { VersionBadge } from "@/components/version/version-badge";
import { VersionInsightPanel } from "@/components/version/version-insight";
import { requireAuth } from "@/lib/auth";
import {
	getPromptBySlugInWorkspace,
	getPromptVersionById,
} from "@/lib/db/queries/prompts";
import { formatVersionLabel } from "@/lib/version-utils";

interface ComparePageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function PromptCompareVersionsPage({
	params,
	searchParams,
}: ComparePageProps) {
	const { workspace } = await requireAuth();
	const { slug } = await params;
	const { from, to } = await searchParams;

	if (!from || !to) notFound();

	const prompt = await getPromptBySlugInWorkspace(workspace.id, slug);
	if (!prompt) notFound();

	const [fromVersion, toVersion] = await Promise.all([
		getPromptVersionById(from),
		getPromptVersionById(to),
	]);

	if (!fromVersion || !toVersion) notFound();

	return (
		<div className="mx-auto max-w-5xl px-4 py-6">
			<div className="mb-6 flex items-center gap-2">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href={`/prompts/${slug}/versions`}>
						<ChevronLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="font-semibold text-lg">{prompt.name}</h1>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<VersionBadge version={fromVersion.version} className="text-xs" />
						<StatusBadge status={fromVersion.status} />
						<span>&rarr;</span>
						<VersionBadge version={toVersion.version} className="text-xs" />
						<StatusBadge status={toVersion.status} />
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-lg border">
				<CompareView
					oldValue={fromVersion.templateText}
					newValue={toVersion.templateText}
					oldTitle={formatVersionLabel(fromVersion.version)}
					newTitle={formatVersionLabel(toVersion.version)}
				/>
				<VersionInsightPanel
					oldText={fromVersion.templateText}
					newText={toVersion.templateText}
				/>
			</div>
		</div>
	);
}
