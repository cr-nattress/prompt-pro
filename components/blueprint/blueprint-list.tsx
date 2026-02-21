import { Boxes, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BlueprintWithBlockCount } from "@/types";
import { BlueprintListItem } from "./blueprint-list-item";

interface BlueprintListProps {
	items: BlueprintWithBlockCount[];
}

export function BlueprintList({ items }: BlueprintListProps) {
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
				<Boxes className="h-10 w-10 text-muted-foreground" />
				<div className="text-center">
					<p className="font-medium">No blueprints yet</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Create your first context blueprint to get started.
					</p>
				</div>
				<Button asChild>
					<Link href="/blueprints/new">
						<Plus className="mr-2 h-4 w-4" />
						New Blueprint
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{items.map((blueprint) => (
				<BlueprintListItem key={blueprint.id} blueprint={blueprint} />
			))}
		</div>
	);
}
