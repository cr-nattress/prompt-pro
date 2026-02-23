import type { Metadata } from "next";
import { PlaygroundView } from "@/components/playground/playground-view";

export const metadata: Metadata = { title: "Playground" };

interface PlaygroundPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PlaygroundPage({
	searchParams,
}: PlaygroundPageProps) {
	const params = await searchParams;
	const promptId =
		typeof params.promptId === "string" ? params.promptId : undefined;
	const versionId =
		typeof params.versionId === "string" ? params.versionId : undefined;

	return (
		<PlaygroundView initialPromptId={promptId} initialVersionId={versionId} />
	);
}
