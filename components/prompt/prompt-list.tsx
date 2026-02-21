import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PromptWithVersion } from "@/types";
import { PromptListItem } from "./prompt-list-item";

interface PromptListProps {
	items: PromptWithVersion[];
}

export function PromptList({ items }: PromptListProps) {
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
				<FileText className="h-10 w-10 text-muted-foreground" />
				<div className="text-center">
					<p className="font-medium">No prompts yet</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Create your first prompt to get started.
					</p>
				</div>
				<Button asChild>
					<Link href="/prompts/new">
						<Plus className="mr-2 h-4 w-4" />
						New Prompt
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{items.map((prompt) => (
				<PromptListItem key={prompt.id} prompt={prompt} />
			))}
		</div>
	);
}
