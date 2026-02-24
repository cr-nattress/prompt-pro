import type { Metadata } from "next";
import { BadgeGrid } from "@/components/badges/badge-grid";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth";
import { getUserBadges } from "@/lib/db/queries/badges";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsProfilePage() {
	const { user } = await requireAuth();
	const earnedBadges = await getUserBadges(user.id);

	return (
		<div className="space-y-6">
			<ProfileSettings
				name={user.name}
				email={user.email}
				imageUrl={user.imageUrl}
				leaderboardOptIn={user.leaderboardOptIn}
			/>
			<Card>
				<CardHeader>
					<CardTitle>Badges</CardTitle>
				</CardHeader>
				<CardContent>
					<BadgeGrid earnedBadges={earnedBadges} />
				</CardContent>
			</Card>
		</div>
	);
}
