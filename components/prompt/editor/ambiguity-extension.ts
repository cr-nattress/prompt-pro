import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	hoverTooltip,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";
import {
	type AmbiguityMatch,
	detectAmbiguities,
} from "@/lib/ai/ambiguity-rules";

const ambiguityWarningMark = Decoration.mark({
	class: "cm-ambiguity-warning",
});

const ambiguityInfoMark = Decoration.mark({
	class: "cm-ambiguity-info",
});

function buildAmbiguityDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const matches: AmbiguityMatch[] = [];

	for (const { from, to } of view.visibleRanges) {
		const text = view.state.doc.sliceString(from, to);
		const rangeMatches = detectAmbiguities(text);
		for (const m of rangeMatches) {
			matches.push({
				...m,
				from: from + m.from,
				to: from + m.to,
			});
		}
	}

	// RangeSetBuilder requires sorted, non-overlapping ranges
	matches.sort((a, b) => a.from - b.from);

	for (const m of matches) {
		const mark =
			m.severity === "warning" ? ambiguityWarningMark : ambiguityInfoMark;
		builder.add(m.from, m.to, mark);
	}

	return builder.finish();
}

export const ambiguityDecoration = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildAmbiguityDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged) {
				this.decorations = buildAmbiguityDecorations(update.view);
			}
		}
	},
	{
		decorations: (v) => v.decorations,
	},
);

export const ambiguityTooltip = hoverTooltip((view, pos) => {
	const text = view.state.doc.toString();
	const matches = detectAmbiguities(text);
	const match = matches.find((m) => pos >= m.from && pos <= m.to);
	if (!match) return null;

	return {
		pos: match.from,
		end: match.to,
		above: true,
		create() {
			const dom = document.createElement("div");
			dom.className = "cm-ambiguity-tooltip";
			dom.textContent = match.message;
			return { dom };
		},
	};
});

export const ambiguityTheme = EditorView.baseTheme({
	".cm-ambiguity-warning": {
		backgroundImage:
			"linear-gradient(45deg, transparent 65%, oklch(0.795 0.184 86.047) 80%, transparent 90%)",
		backgroundSize: "6px 3px",
		backgroundRepeat: "repeat-x",
		backgroundPosition: "bottom",
		paddingBottom: "2px",
	},
	".cm-ambiguity-info": {
		backgroundImage:
			"linear-gradient(45deg, transparent 65%, oklch(0.623 0.214 259.815 / 60%) 80%, transparent 90%)",
		backgroundSize: "6px 3px",
		backgroundRepeat: "repeat-x",
		backgroundPosition: "bottom",
		paddingBottom: "2px",
	},
	".cm-ambiguity-tooltip": {
		backgroundColor: "var(--color-popover)",
		color: "var(--color-popover-foreground)",
		border: "1px solid var(--color-border)",
		borderRadius: "6px",
		padding: "4px 8px",
		fontSize: "12px",
		maxWidth: "300px",
		lineHeight: "1.4",
	},
});
