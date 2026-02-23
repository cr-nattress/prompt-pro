import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-bold text-2xl">Settings</h1>
			<div className="flex flex-col gap-8 md:flex-row">
				<SettingsNav />
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		</div>
	);
}
