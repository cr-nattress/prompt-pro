import type { Metadata } from "next";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsProfilePage() {
	const { user } = await requireAuth();

	return (
		<ProfileSettings
			name={user.name}
			email={user.email}
			imageUrl={user.imageUrl}
		/>
	);
}
