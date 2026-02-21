"use client";

import { useTheme } from "next-themes";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

interface DiffViewerLoaderProps {
	oldValue: string;
	newValue: string;
	oldTitle: string;
	newTitle: string;
	splitView: boolean;
}

export function DiffViewerLoader({
	oldValue,
	newValue,
	oldTitle,
	newTitle,
	splitView,
}: DiffViewerLoaderProps) {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<ReactDiffViewer
			oldValue={oldValue}
			newValue={newValue}
			leftTitle={oldTitle}
			rightTitle={newTitle}
			splitView={splitView}
			compareMethod={DiffMethod.WORDS}
			useDarkTheme={isDark}
			styles={{
				variables: {
					dark: {
						addedBackground:
							"color-mix(in oklch, var(--diff-added) 15%, transparent)",
						addedColor: "var(--diff-added)",
						removedBackground:
							"color-mix(in oklch, var(--diff-removed) 15%, transparent)",
						removedColor: "var(--diff-removed)",
						wordAddedBackground:
							"color-mix(in oklch, var(--diff-added) 30%, transparent)",
						wordRemovedBackground:
							"color-mix(in oklch, var(--diff-removed) 30%, transparent)",
					},
					light: {
						addedBackground:
							"color-mix(in oklch, var(--diff-added) 10%, transparent)",
						addedColor: "var(--diff-added)",
						removedBackground:
							"color-mix(in oklch, var(--diff-removed) 10%, transparent)",
						removedColor: "var(--diff-removed)",
						wordAddedBackground:
							"color-mix(in oklch, var(--diff-added) 25%, transparent)",
						wordRemovedBackground:
							"color-mix(in oklch, var(--diff-removed) 25%, transparent)",
					},
				},
			}}
		/>
	);
}
