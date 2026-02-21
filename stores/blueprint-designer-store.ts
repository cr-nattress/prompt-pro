import { create } from "zustand";
import type { ContextBlock } from "@/lib/db/schema";

interface BlueprintDesignerState {
	blocks: ContextBlock[];
	selectedBlockId: string | null;
	isDirty: boolean;
	isSaving: boolean;
	lastSavedAt: Date | null;
	setBlocks: (blocks: ContextBlock[]) => void;
	addBlock: (block: ContextBlock) => void;
	updateBlockInStore: (id: string, data: Record<string, unknown>) => void;
	removeBlockFromStore: (id: string) => void;
	reorderBlocksInStore: (blocks: ContextBlock[]) => void;
	selectBlock: (id: string | null) => void;
	setDirty: (dirty: boolean) => void;
	setSaving: (saving: boolean) => void;
	setLastSavedAt: (date: Date) => void;
	reset: () => void;
}

export const useBlueprintDesignerStore = create<BlueprintDesignerState>(
	(set) => ({
		blocks: [],
		selectedBlockId: null,
		isDirty: false,
		isSaving: false,
		lastSavedAt: null,
		setBlocks: (blocks) => set({ blocks }),
		addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
		updateBlockInStore: (id, data) =>
			set((state) => ({
				blocks: state.blocks.map((b) =>
					b.id === id ? ({ ...b, ...data } as ContextBlock) : b,
				),
			})),
		removeBlockFromStore: (id) =>
			set((state) => ({
				blocks: state.blocks.filter((b) => b.id !== id),
				selectedBlockId:
					state.selectedBlockId === id ? null : state.selectedBlockId,
			})),
		reorderBlocksInStore: (blocks) => set({ blocks }),
		selectBlock: (id) => set({ selectedBlockId: id }),
		setDirty: (isDirty) => set({ isDirty }),
		setSaving: (isSaving) => set({ isSaving }),
		setLastSavedAt: (lastSavedAt) =>
			set({ lastSavedAt, isDirty: false, isSaving: false }),
		reset: () =>
			set({
				blocks: [],
				selectedBlockId: null,
				isDirty: false,
				isSaving: false,
				lastSavedAt: null,
			}),
	}),
);
