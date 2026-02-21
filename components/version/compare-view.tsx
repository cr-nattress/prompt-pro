"use client";

import { useEffect, useState } from "react";
import { DiffViewer } from "./diff-viewer";

interface CompareViewProps {
	oldValue: string;
	newValue: string;
	oldTitle: string;
	newTitle: string;
}

export function CompareView({
	oldValue,
	newValue,
	oldTitle,
	newTitle,
}: CompareViewProps) {
	const [splitView, setSplitView] = useState(true);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		setSplitView(mq.matches);
		const handler = (e: MediaQueryListEvent) => setSplitView(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	return (
		<DiffViewer
			oldValue={oldValue}
			newValue={newValue}
			oldTitle={oldTitle}
			newTitle={newTitle}
			splitView={splitView}
		/>
	);
}
