import {
	BADGE_DEFINITIONS,
	type BadgeDefinition,
} from "@/lib/badges/badge-definitions";
import type { Badge } from "@/lib/db/schema";
import { BadgeCard } from "./badge-card";

interface BadgeGridProps {
	earnedBadges: Badge[];
}

export function BadgeGrid({ earnedBadges }: BadgeGridProps) {
	const earnedMap = new Map(earnedBadges.map((b) => [b.badgeSlug, b]));

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{BADGE_DEFINITIONS.map((def: BadgeDefinition) => {
				const earned = earnedMap.get(def.slug);

				return (
					<BadgeCard
						key={def.slug}
						title={def.title}
						description={def.description}
						icon={def.icon}
						earnedAt={earned?.earnedAt?.toISOString()}
						isLocked={!earned}
					/>
				);
			})}
		</div>
	);
}
