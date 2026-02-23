import { notFound } from "next/navigation";
import { AntiPatternDetail } from "@/components/learn/anti-pattern-detail";
import { getAntiPattern } from "@/lib/data/anti-patterns";

export default async function AntiPatternDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const antiPattern = getAntiPattern(slug);

	if (!antiPattern) {
		notFound();
	}

	return <AntiPatternDetail antiPattern={antiPattern} />;
}
