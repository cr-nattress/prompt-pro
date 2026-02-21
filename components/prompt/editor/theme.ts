import { EditorView } from "@codemirror/view";

export const promptEditorLight = EditorView.theme(
	{
		"&": {
			backgroundColor: "oklch(1 0 0)",
			color: "oklch(0.145 0 0)",
			fontSize: "14px",
			fontFamily: "var(--font-mono)",
		},
		".cm-content": {
			caretColor: "oklch(0.145 0 0)",
			padding: "8px 0",
		},
		".cm-cursor": {
			borderLeftColor: "oklch(0.145 0 0)",
		},
		"&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
			backgroundColor: "oklch(0.97 0 0)",
		},
		".cm-gutters": {
			backgroundColor: "oklch(0.97 0 0)",
			color: "oklch(0.556 0 0)",
			border: "none",
			borderRight: "1px solid oklch(0.922 0 0)",
		},
		".cm-activeLineGutter": {
			backgroundColor: "oklch(0.97 0 0)",
		},
		".cm-activeLine": {
			backgroundColor: "oklch(0.97 0 0 / 50%)",
		},
		".cm-searchMatch": {
			backgroundColor: "oklch(0.852 0.199 91.936 / 30%)",
		},
		".cm-searchMatch.cm-searchMatch-selected": {
			backgroundColor: "oklch(0.852 0.199 91.936 / 50%)",
		},
	},
	{ dark: false },
);

export const promptEditorDark = EditorView.theme(
	{
		"&": {
			backgroundColor: "oklch(0.205 0 0)",
			color: "oklch(0.985 0 0)",
			fontSize: "14px",
			fontFamily: "var(--font-mono)",
		},
		".cm-content": {
			caretColor: "oklch(0.985 0 0)",
			padding: "8px 0",
		},
		".cm-cursor": {
			borderLeftColor: "oklch(0.985 0 0)",
		},
		"&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
			backgroundColor: "oklch(0.269 0 0)",
		},
		".cm-gutters": {
			backgroundColor: "oklch(0.269 0 0)",
			color: "oklch(0.708 0 0)",
			border: "none",
			borderRight: "1px solid oklch(1 0 0 / 10%)",
		},
		".cm-activeLineGutter": {
			backgroundColor: "oklch(0.269 0 0)",
		},
		".cm-activeLine": {
			backgroundColor: "oklch(0.269 0 0 / 50%)",
		},
		".cm-searchMatch": {
			backgroundColor: "oklch(0.852 0.199 91.936 / 30%)",
		},
		".cm-searchMatch.cm-searchMatch-selected": {
			backgroundColor: "oklch(0.852 0.199 91.936 / 50%)",
		},
	},
	{ dark: true },
);
