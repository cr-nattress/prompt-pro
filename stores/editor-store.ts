import { create } from "zustand";

interface EditorState {
	isDirty: boolean;
	isSaving: boolean;
	lastSavedAt: Date | null;
	detectedParameters: string[];
	setDirty: (dirty: boolean) => void;
	setSaving: (saving: boolean) => void;
	setLastSavedAt: (date: Date) => void;
	setDetectedParameters: (params: string[]) => void;
	reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
	isDirty: false,
	isSaving: false,
	lastSavedAt: null,
	detectedParameters: [],
	setDirty: (isDirty) => set({ isDirty }),
	setSaving: (isSaving) => set({ isSaving }),
	setLastSavedAt: (lastSavedAt) =>
		set({ lastSavedAt, isDirty: false, isSaving: false }),
	setDetectedParameters: (detectedParameters) => set({ detectedParameters }),
	reset: () =>
		set({
			isDirty: false,
			isSaving: false,
			lastSavedAt: null,
			detectedParameters: [],
		}),
}));
