import { Boxes, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-bold text-2xl">Settings</h1>

			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between rounded-lg border p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
							<Boxes className="h-5 w-5" />
						</div>
						<div>
							<p className="font-medium">Apps</p>
							<p className="text-muted-foreground text-sm">
								Manage apps that group your prompts
							</p>
						</div>
					</div>
					<Button variant="outline" asChild>
						<Link href="/settings/apps">Manage</Link>
					</Button>
				</div>

				<div className="flex items-center justify-between rounded-lg border p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
							<KeyRound className="h-5 w-5" />
						</div>
						<div>
							<p className="font-medium">API Keys</p>
							<p className="text-muted-foreground text-sm">
								Manage keys for programmatic API access
							</p>
						</div>
					</div>
					<Button variant="outline" asChild>
						<Link href="/settings/api-keys">Manage</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
