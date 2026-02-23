import {
	type EditorState,
	type Extension,
	StateEffect,
	StateField,
} from "@codemirror/state";
import { Decoration, EditorView, keymap, WidgetType } from "@codemirror/view";

// --- State effects ---
const setSuggestion = StateEffect.define<string>();
const clearSuggestion = StateEffect.define<null>();

// --- Ghost text widget ---
class GhostTextWidget extends WidgetType {
	constructor(readonly text: string) {
		super();
	}

	toDOM(): HTMLElement {
		const span = document.createElement("span");
		span.textContent = this.text;
		span.className = "cm-ghost-text";
		span.style.opacity = "0.4";
		span.style.fontStyle = "italic";
		span.style.pointerEvents = "none";
		return span;
	}

	ignoreEvent(): boolean {
		return true;
	}
}

// --- State field to store the suggestion ---
const ghostTextField = StateField.define<{
	text: string;
	pos: number;
} | null>({
	create: () => null,
	update(value, tr) {
		for (const effect of tr.effects) {
			if (effect.is(setSuggestion)) {
				return {
					text: effect.value,
					pos: tr.state.selection.main.head,
				};
			}
			if (effect.is(clearSuggestion)) {
				return null;
			}
		}
		// Clear on any document change
		if (tr.docChanged) return null;
		// Clear on selection change (user moved cursor)
		if (tr.selection && value) return null;
		return value;
	},
});

// --- Decoration layer ---
const ghostTextDecoration = EditorView.decorations.compute(
	[ghostTextField],
	(state: EditorState) => {
		const suggestion = state.field(ghostTextField);
		if (!suggestion || !suggestion.text) return Decoration.none;

		const widget = Decoration.widget({
			widget: new GhostTextWidget(suggestion.text),
			side: 1,
		});

		return Decoration.set([widget.range(suggestion.pos)]);
	},
);

// --- Debounced fetch logic ---
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;

function scheduleGhostText(view: EditorView) {
	if (debounceTimer) clearTimeout(debounceTimer);
	if (abortController) abortController.abort();

	debounceTimer = setTimeout(async () => {
		const cursor = view.state.selection.main.head;
		const doc = view.state.doc.toString();
		const textBefore = doc.slice(0, cursor);
		const textAfter = doc.slice(cursor);

		if (!textBefore.trim()) return;

		abortController = new AbortController();

		try {
			const response = await fetch("/api/playground/suggest", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ textBefore, textAfter }),
				signal: abortController.signal,
			});

			if (!response.ok) return;

			const { suggestion } = await response.json();
			if (suggestion && typeof suggestion === "string" && suggestion.trim()) {
				// Only apply if cursor hasn't moved
				if (view.state.selection.main.head === cursor) {
					view.dispatch({
						effects: setSuggestion.of(suggestion),
					});
				}
			}
		} catch {
			// Aborted or failed — silently ignore
		}
	}, 2000);
}

// --- Tab to accept keybinding ---
const ghostTextKeymap = keymap.of([
	{
		key: "Tab",
		run: (view) => {
			const suggestion = view.state.field(ghostTextField);
			if (!suggestion || !suggestion.text) return false;

			view.dispatch({
				changes: { from: suggestion.pos, insert: suggestion.text },
				effects: clearSuggestion.of(null),
				selection: {
					anchor: suggestion.pos + suggestion.text.length,
				},
			});
			return true;
		},
	},
	{
		key: "Escape",
		run: (view) => {
			const suggestion = view.state.field(ghostTextField);
			if (!suggestion) return false;

			view.dispatch({
				effects: clearSuggestion.of(null),
			});
			return true;
		},
	},
]);

// --- Update listener to trigger fetch ---
const ghostTextTrigger = EditorView.updateListener.of((update) => {
	if (update.docChanged) {
		// Clear existing suggestion first
		update.view.dispatch({
			effects: clearSuggestion.of(null),
		});
		scheduleGhostText(update.view);
	}
});

// --- Public API ---
export function ghostTextExtension(): Extension {
	return [
		ghostTextField,
		ghostTextDecoration,
		ghostTextKeymap,
		ghostTextTrigger,
	];
}

export function clearGhostText(view: EditorView) {
	view.dispatch({ effects: clearSuggestion.of(null) });
	if (debounceTimer) clearTimeout(debounceTimer);
	if (abortController) abortController.abort();
}
