"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { promptSearchParams } from "@/lib/search-params/prompts";

interface PromptListPaginationProps {
	total: number;
	page: number;
	pageSize: number;
}

export function PromptListPagination({
	total,
	page,
	pageSize,
}: PromptListPaginationProps) {
	const [, setPage] = useQueryState("page", promptSearchParams.page);

	if (total <= pageSize) return null;

	const totalPages = Math.ceil(total / pageSize);
	const start = (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, total);

	return (
		<div className="flex items-center justify-between">
			<p className="text-muted-foreground text-sm">
				Showing {start}–{end} of {total}
			</p>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setPage(page - 1)}
					disabled={page <= 1}
				>
					<ChevronLeft className="mr-1 h-4 w-4" />
					Prev
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setPage(page + 1)}
					disabled={page >= totalPages}
				>
					Next
					<ChevronRight className="ml-1 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
