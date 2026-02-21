"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DiffViewerLoader = dynamic(
	() =>
		import("./diff-viewer-loader").then((mod) => ({
			default: mod.DiffViewerLoader,
		})),
	{
		ssr: false,
		loading: () => <Skeleton className="h-64 w-full" />,
	},
);

interface DiffViewerProps {
	oldValue: string;
	newValue: string;
	oldTitle: string;
	newTitle: string;
	splitView: boolean;
}

export function DiffViewer(props: DiffViewerProps) {
	return <DiffViewerLoader {...props} />;
}
