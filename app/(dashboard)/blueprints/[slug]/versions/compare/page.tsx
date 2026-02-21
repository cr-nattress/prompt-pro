import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/version/status-badge";
import { VersionBadge } from "@/components/version/version-badge";
import { requireAuth } from "@/lib/auth";
import { getBlueprintVersionById } from "@/lib/db/queries/blueprint-versions";
import { getBlueprintBySlugInWorkspace } from "@/lib/db/queries/blueprints";

interface ComparePageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function BlueprintCompareVersionsPage({
	params,
	searchParams,
}: ComparePageProps) {
	const { workspace } = await requireAuth();
	const { slug } = await params;
	const { from, to } = await searchParams;

	if (!from || !to) notFound();

	const blueprint = await getBlueprintBySlugInWorkspace(workspace.id, slug);
	if (!blueprint) notFound();

	const [fromVersion, toVersion] = await Promise.all([
		getBlueprintVersionById(from),
		getBlueprintVersionById(to),
	]);

	if (!fromVersion || !toVersion) notFound();

	const fromSnapshot = (fromVersion.blockVersionSnapshot ?? {}) as Record<
		string,
		number
	>;
	const toSnapshot = (toVersion.blockVersionSnapshot ?? {}) as Record<
		string,
		number
	>;

	// Compute block-level changes
	const allBlockIds = new Set([
		...Object.keys(fromSnapshot),
		...Object.keys(toSnapshot),
	]);

	const changes: {
		blockId: string;
		type: "added" | "removed" | "changed" | "unchanged";
	}[] = [];
	for (const blockId of allBlockIds) {
		const fromVer = fromSnapshot[blockId];
		const toVer = toSnapshot[blockId];
		if (fromVer === undefined) {
			changes.push({ blockId, type: "added" });
		} else if (toVer === undefined) {
			changes.push({ blockId, type: "removed" });
		} else if (fromVer !== toVer) {
			changes.push({ blockId, type: "changed" });
		} else {
			changes.push({ blockId, type: "unchanged" });
		}
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-6">
			<div className="mb-6 flex items-center gap-2">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href={`/blueprints/${slug}/versions`}>
						<ChevronLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="font-semibold text-lg">{blueprint.name}</h1>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<VersionBadge version={fromVersion.version} className="text-xs" />
						<StatusBadge status={fromVersion.status} />
						<span>&rarr;</span>
						<VersionBadge version={toVersion.version} className="text-xs" />
						<StatusBadge status={toVersion.status} />
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2 rounded-lg border p-4">
				<h2 className="mb-2 font-medium text-sm">Block Changes</h2>
				{changes.length === 0 && (
					<p className="text-muted-foreground text-sm">No block changes.</p>
				)}
				{changes.map(({ blockId, type }) => {
					const block = blueprint.blocks.find((b) => b.id === blockId);
					const blockName = block?.name ?? blockId.slice(0, 8);
					return (
						<div
							key={blockId}
							className="flex items-center gap-2 rounded-md border px-3 py-2"
						>
							<span className="font-medium text-sm">{blockName}</span>
							<span
								className="rounded-md px-1.5 py-0.5 text-xs"
								style={{
									backgroundColor:
										type === "added"
											? "color-mix(in oklch, var(--diff-added) 15%, transparent)"
											: type === "removed"
												? "color-mix(in oklch, var(--diff-removed) 15%, transparent)"
												: type === "changed"
													? "color-mix(in oklch, var(--diff-modified) 15%, transparent)"
													: "transparent",
									color:
										type === "added"
											? "var(--diff-added)"
											: type === "removed"
												? "var(--diff-removed)"
												: type === "changed"
													? "var(--diff-modified)"
													: "var(--muted-foreground)",
								}}
							>
								{type}
							</span>
							{type === "changed" && (
								<span className="text-muted-foreground text-xs">
									v{fromSnapshot[blockId]} &rarr; v{toSnapshot[blockId]}
								</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
