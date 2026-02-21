import { Suspense } from "react";
import { BlueprintList } from "@/components/blueprint/blueprint-list";
import { BlueprintListHeader } from "@/components/blueprint/blueprint-list-header";
import { BlueprintListPagination } from "@/components/blueprint/blueprint-list-pagination";
import { BlueprintListSkeleton } from "@/components/blueprint/blueprint-list-skeleton";
import { BlueprintListToolbar } from "@/components/blueprint/blueprint-list-toolbar";
import { requireAuth } from "@/lib/auth";
import { getBlueprintsWithBlockCount } from "@/lib/db/queries/blueprints";
import { blueprintSearchParamsCache } from "@/lib/search-params/blueprints";

interface BlueprintsPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlueprintsPage({
	searchParams,
}: BlueprintsPageProps) {
	const { workspace } = await requireAuth();
	const params = await blueprintSearchParamsCache.parse(searchParams);

	return (
		<div className="flex flex-col gap-4">
			<Suspense fallback={<BlueprintListSkeleton />}>
				<BlueprintListContent workspaceId={workspace.id} params={params} />
			</Suspense>
		</div>
	);
}

interface BlueprintListContentProps {
	workspaceId: string;
	params: {
		search: string;
		sort: "updatedAt" | "createdAt" | "name";
		order: "asc" | "desc";
		page: number;
	};
}

async function BlueprintListContent({
	workspaceId,
	params,
}: BlueprintListContentProps) {
	const { items, total, page, pageSize } = await getBlueprintsWithBlockCount(
		workspaceId,
		{
			search: params.search || undefined,
			sort: params.sort,
			order: params.order,
			page: params.page,
		},
	);

	return (
		<>
			<BlueprintListHeader count={total} />
			<BlueprintListToolbar />
			<BlueprintList items={items} />
			<BlueprintListPagination total={total} page={page} pageSize={pageSize} />
		</>
	);
}
