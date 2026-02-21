"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderBlocksAction } from "@/app/(dashboard)/blueprints/actions";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";
import { AddBlockCard } from "./add-block-card";
import { BlockStackItem } from "./block-stack-item";

interface BlockStackProps {
	blueprintId: string | null;
}

export function BlockStack({ blueprintId }: BlockStackProps) {
	const { blocks, reorderBlocksInStore } = useBlueprintDesignerStore();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = blocks.findIndex((b) => b.id === active.id);
		const newIndex = blocks.findIndex((b) => b.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		const reordered = arrayMove(blocks, oldIndex, newIndex);
		reorderBlocksInStore(reordered);

		// Persist in background
		if (blueprintId) {
			reorderBlocksAction(
				blueprintId,
				reordered.map((b) => b.id),
			);
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={blocks.map((b) => b.id)}
					strategy={verticalListSortingStrategy}
				>
					{blocks.map((block) => (
						<BlockStackItem key={block.id} block={block} />
					))}
				</SortableContext>
			</DndContext>

			<AddBlockCard blueprintId={blueprintId} />
		</div>
	);
}
