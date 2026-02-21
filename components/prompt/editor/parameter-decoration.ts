import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";

const paramMark = Decoration.mark({
	class: "cm-parameter",
});

function buildDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const pattern = /\{\{([^}]+)\}\}/g;

	for (const { from, to } of view.visibleRanges) {
		const text = view.state.doc.sliceString(from, to);
		pattern.lastIndex = 0;
		let match = pattern.exec(text);
		while (match !== null) {
			builder.add(
				from + match.index,
				from + match.index + match[0].length,
				paramMark,
			);
			match = pattern.exec(text);
		}
	}

	return builder.finish();
}

export const parameterDecoration = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged) {
				this.decorations = buildDecorations(update.view);
			}
		}
	},
	{
		decorations: (v) => v.decorations,
	},
);

export const parameterHighlightThemeLight = EditorView.baseTheme({
	".cm-parameter": {
		backgroundColor: "oklch(0.623 0.214 259.815 / 15%)",
		borderRadius: "3px",
		padding: "1px 0",
	},
});

export const parameterHighlightThemeDark = EditorView.baseTheme({
	"&dark .cm-parameter": {
		backgroundColor: "oklch(0.488 0.243 264.376 / 25%)",
	},
});
