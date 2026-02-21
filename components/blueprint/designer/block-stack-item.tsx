"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteBlockAction } from "@/app/(dashboard)/blueprints/actions";
import { Button } from "@/components/ui/button";
import {
	BLOCK_TYPE_CONFIG,
	type BlockType,
	blockTypeStyle,
} from "@/lib/blueprint-utils";
import type { ContextBlock } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";
import { countTokens } from "@/lib/token-utils";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";

interface BlockStackItemProps {
	block: ContextBlock;
}

export function BlockStackItem({ block }: BlockStackItemProps) {
	const { selectedBlockId, selectBlock, removeBlockFromStore } =
		useBlueprintDesignerStore();
	const [isDeleting, setIsDeleting] = useState(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: block.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const config = BLOCK_TYPE_CONFIG[block.type as BlockType];
	const isSelected = selectedBlockId === block.id;
	const tokens = block.content ? countTokens(block.content) : 0;

	async function handleDelete(e: React.MouseEvent) {
		e.stopPropagation();
		setIsDeleting(true);
		const result = await deleteBlockAction(block.id);
		setIsDeleting(false);

		if (result.success) {
			removeBlockFromStore(block.id);
			showToast("success", "Block deleted");
		} else {
			showToast("error", result.error);
		}
	}

	return (
		// biome-ignore lint/a11y/useSemanticElements: div needed for sortable drag container
		<div
			ref={setNodeRef}
			style={{ ...style, ...blockTypeStyle(block.type) }}
			className={`group flex cursor-pointer items-center gap-2 rounded-lg border-l-4 border border-border p-3 transition-colors hover:bg-accent/50 ${
				isSelected ? "ring-2 ring-primary bg-accent/50" : ""
			}`}
			onClick={() => selectBlock(block.id)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectBlock(block.id);
				}
			}}
			role="button"
			tabIndex={0}
			data-block-type={block.type}
		>
			<button
				type="button"
				className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
				{...attributes}
				{...listeners}
			>
				<GripVertical className="h-4 w-4" />
			</button>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<div className="flex items-center gap-2">
					{config && (
						<span
							className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-xs"
							style={{
								backgroundColor: `color-mix(in oklch, var(${config.cssVar}) 15%, transparent)`,
								color: `var(${config.cssVar})`,
							}}
						>
							<config.icon className="h-3 w-3" />
							{config.label}
						</span>
					)}
					<span className="truncate font-medium text-sm">{block.name}</span>
				</div>
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<span>{tokens.toLocaleString()} tokens</span>
					{block.isRequired && (
						<span
							className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
							title="Required"
						/>
					)}
					{block.isConditional && (
						<span className="italic" title={block.condition ?? undefined}>
							if
						</span>
					)}
				</div>
			</div>

			<Button
				variant="ghost"
				size="icon-sm"
				className="shrink-0 opacity-0 group-hover:opacity-100"
				onClick={handleDelete}
				disabled={isDeleting}
			>
				<Trash2 className="h-3.5 w-3.5" />
				<span className="sr-only">Delete block</span>
			</Button>
		</div>
	);
}
