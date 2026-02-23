import { notFound } from "next/navigation";
import { TechniqueDetail } from "@/components/learn/technique-detail";
import { getAntiPattern } from "@/lib/data/anti-patterns";
import { getTechnique } from "@/lib/data/techniques";

export default async function LearnDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const technique = getTechnique(slug);
	if (technique) {
		return <TechniqueDetail technique={technique} />;
	}

	// Maybe it's an anti-pattern accessed by direct link
	const antiPattern = getAntiPattern(slug);
	if (antiPattern) {
		// Redirect to anti-patterns section would be ideal, but for now show not found
		notFound();
	}

	notFound();
}
