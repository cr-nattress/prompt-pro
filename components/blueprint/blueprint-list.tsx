"use client";

import { Boxes, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { BlueprintWithBlockCount } from "@/types";
import { BlueprintListItem } from "./blueprint-list-item";

interface BlueprintListProps {
	items: BlueprintWithBlockCount[];
}

export function BlueprintList({ items }: BlueprintListProps) {
	const [infoOpen, setInfoOpen] = useState(false);

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
				<Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							className="flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
						>
							What&apos;s a blueprint?
							<ChevronDown
								className={`h-3 w-3 transition-transform ${infoOpen ? "rotate-180" : ""}`}
							/>
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="mt-2 max-w-md text-center">
						<p className="text-muted-foreground text-xs">
							Blueprints are structured context compositions that combine
							multiple pieces of information — like system prompts, reference
							documents, and constraints — into reusable building blocks for
							your AI workflows.
						</p>
					</CollapsibleContent>
				</Collapsible>
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
