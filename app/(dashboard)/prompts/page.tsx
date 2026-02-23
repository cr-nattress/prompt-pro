import type { Metadata } from "next";
import { Suspense } from "react";
import { PromptList } from "@/components/prompt/prompt-list";
import { PromptListHeader } from "@/components/prompt/prompt-list-header";
import { PromptListPagination } from "@/components/prompt/prompt-list-pagination";
import { PromptListSkeleton } from "@/components/prompt/prompt-list-skeleton";
import { PromptListToolbar } from "@/components/prompt/prompt-list-toolbar";
import { requireAuth } from "@/lib/auth";
import { getPromptsWithLatestVersion } from "@/lib/db/queries/prompts";
import { promptSearchParamsCache } from "@/lib/search-params/prompts";

export const metadata: Metadata = { title: "Prompts" };

interface PromptsPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
	const { workspace } = await requireAuth();
	const params = await promptSearchParamsCache.parse(searchParams);

	return (
		<div className="flex flex-col gap-4">
			<Suspense fallback={<PromptListSkeleton />}>
				<PromptListContent workspaceId={workspace.id} params={params} />
			</Suspense>
		</div>
	);
}

interface PromptListContentProps {
	workspaceId: string;
	params: {
		search: string;
		purpose: string | null;
		tag: string | null;
		sort: "updatedAt" | "createdAt" | "name";
		order: "asc" | "desc";
		page: number;
	};
}

async function PromptListContent({
	workspaceId,
	params,
}: PromptListContentProps) {
	const { items, total, page, pageSize } = await getPromptsWithLatestVersion(
		workspaceId,
		{
			search: params.search || undefined,
			purpose: params.purpose ?? undefined,
			tag: params.tag ?? undefined,
			sort: params.sort,
			order: params.order,
			page: params.page,
		},
	);

	return (
		<>
			<PromptListHeader count={total} />
			<PromptListToolbar />
			<PromptList items={items} />
			<PromptListPagination total={total} page={page} pageSize={pageSize} />
		</>
	);
}
