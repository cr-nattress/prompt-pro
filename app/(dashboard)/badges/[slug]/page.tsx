import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCard } from "@/components/badges/badge-card";
import { getBadgeDefinition } from "@/lib/badges/badge-definitions";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const def = getBadgeDefinition(slug);
	return {
		title: def ? `${def.title} Badge` : "Badge",
		openGraph: def
			? {
					title: `${def.title} — PromptVault Badge`,
					description: def.description,
				}
			: undefined,
	};
}

export default async function BadgePage({ params }: Props) {
	const { slug } = await params;
	const def = getBadgeDefinition(slug);
	if (!def) notFound();

	return (
		<div className="mx-auto max-w-sm py-12">
			<BadgeCard
				title={def.title}
				description={def.description}
				icon={def.icon}
			/>
		</div>
	);
}
