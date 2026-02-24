import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PatternDetail } from "@/components/learn/pattern-detail";
import { getPromptPattern } from "@/lib/data/prompt-patterns";

interface PatternPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: PatternPageProps): Promise<Metadata> {
	const { slug } = await params;
	const pattern = getPromptPattern(slug);
	return { title: pattern?.title ?? "Pattern" };
}

export default async function PatternDetailPage({ params }: PatternPageProps) {
	const { slug } = await params;
	const pattern = getPromptPattern(slug);
	if (!pattern) notFound();

	return <PatternDetail pattern={pattern} />;
}
