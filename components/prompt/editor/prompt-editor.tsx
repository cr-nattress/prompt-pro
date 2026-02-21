"use client";

import { autocompletion } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { bracketMatching } from "@codemirror/language";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { Compartment, EditorState } from "@codemirror/state";
import {
	drawSelection,
	EditorView,
	highlightActiveLine,
	highlightActiveLineGutter,
	keymap,
	lineNumbers,
} from "@codemirror/view";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import {
	ambiguityDecoration,
	ambiguityTheme,
	ambiguityTooltip,
} from "./ambiguity-extension";
import { createParameterCompletion } from "./parameter-autocomplete";
import {
	parameterDecoration,
	parameterHighlightThemeDark,
	parameterHighlightThemeLight,
} from "./parameter-decoration";
import { promptEditorDark, promptEditorLight } from "./theme";

interface PromptEditorProps {
	value: string;
	onChange?: (value: string) => void;
	parameters?: string[];
	readOnly?: boolean;
	showAmbiguities?: boolean;
}

const themeCompartment = new Compartment();
const readOnlyCompartment = new Compartment();
const ambiguityCompartment = new Compartment();

export default function PromptEditor({
	value,
	onChange,
	parameters = [],
	readOnly = false,
	showAmbiguities = false,
}: PromptEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<EditorView | null>(null);
	const onChangeRef = useRef(onChange);
	const { resolvedTheme } = useTheme();

	// Keep onChange ref up to date without triggering effects
	onChangeRef.current = onChange;

	// Create editor on mount — theme/readOnly/value changes handled by separate effects
	// biome-ignore lint/correctness/useExhaustiveDependencies: imperative CM setup, deps synced via compartments
	useEffect(() => {
		if (!containerRef.current) return;

		const isDark = resolvedTheme === "dark";

		const state = EditorState.create({
			doc: value,
			extensions: [
				lineNumbers(),
				highlightActiveLineGutter(),
				highlightActiveLine(),
				drawSelection(),
				bracketMatching(),
				history(),
				highlightSelectionMatches(),
				markdown(),
				EditorView.lineWrapping,
				keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
				parameterDecoration,
				parameterHighlightThemeLight,
				parameterHighlightThemeDark,
				autocompletion({
					override: [createParameterCompletion(parameters)],
				}),
				ambiguityTheme,
				ambiguityCompartment.of(
					showAmbiguities ? [ambiguityDecoration, ambiguityTooltip] : [],
				),
				themeCompartment.of(isDark ? promptEditorDark : promptEditorLight),
				readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						onChangeRef.current?.(update.state.doc.toString());
					}
				}),
			],
		});

		const view = new EditorView({
			state,
			parent: containerRef.current,
		});

		viewRef.current = view;

		return () => {
			view.destroy();
			viewRef.current = null;
		};
		// Only run on mount — theme/readOnly changes handled by separate effects
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync theme
	useEffect(() => {
		const view = viewRef.current;
		if (!view) return;

		const isDark = resolvedTheme === "dark";
		view.dispatch({
			effects: themeCompartment.reconfigure(
				isDark ? promptEditorDark : promptEditorLight,
			),
		});
	}, [resolvedTheme]);

	// Sync readOnly
	useEffect(() => {
		const view = viewRef.current;
		if (!view) return;

		view.dispatch({
			effects: readOnlyCompartment.reconfigure(
				EditorState.readOnly.of(readOnly),
			),
		});
	}, [readOnly]);

	// Sync ambiguity detection
	useEffect(() => {
		const view = viewRef.current;
		if (!view) return;

		view.dispatch({
			effects: ambiguityCompartment.reconfigure(
				showAmbiguities ? [ambiguityDecoration, ambiguityTooltip] : [],
			),
		});
	}, [showAmbiguities]);

	// Sync value from outside (only when it differs from editor state)
	useEffect(() => {
		const view = viewRef.current;
		if (!view) return;

		const currentDoc = view.state.doc.toString();
		if (currentDoc !== value) {
			view.dispatch({
				changes: { from: 0, to: currentDoc.length, insert: value },
			});
		}
	}, [value]);

	return (
		<div
			ref={containerRef}
			className="h-full min-h-[200px] overflow-auto rounded-md border [&_.cm-editor]:h-full [&_.cm-editor]:outline-none [&_.cm-scroller]:min-h-full"
		/>
	);
}
