"use client";

import { Loader2, Save } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import {
	updateLeaderboardOptInAction,
	updateProfileAction,
} from "@/app/(dashboard)/settings/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ProfileSettingsProps {
	name: string;
	email: string;
	imageUrl: string;
	leaderboardOptIn?: boolean | undefined;
}

export function ProfileSettings({
	name: initialName,
	email,
	imageUrl,
	leaderboardOptIn: initialLeaderboardOptIn = false,
}: ProfileSettingsProps) {
	const [name, setName] = useState(initialName);
	const [isSaving, setIsSaving] = useState(false);
	const [leaderboardOptIn, setLeaderboardOptIn] = useState(
		initialLeaderboardOptIn,
	);
	const { theme, setTheme } = useTheme();

	const initials = initialName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	async function handleSave() {
		if (!name.trim() || name === initialName) return;
		setIsSaving(true);
		try {
			const result = await updateProfileAction(name.trim());
			if (result.success) {
				toast.success("Profile updated");
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to update profile");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarImage src={imageUrl} alt={initialName} />
							<AvatarFallback className="text-lg">{initials}</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-medium">{initialName}</p>
							<p className="text-muted-foreground text-sm">{email}</p>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="profile-name">Display name</Label>
						<div className="flex gap-2">
							<Input
								id="profile-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="max-w-sm"
							/>
							<Button
								onClick={handleSave}
								disabled={isSaving || !name.trim() || name === initialName}
								size="sm"
							>
								{isSaving ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Save className="mr-2 h-4 w-4" />
								)}
								Save
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="profile-email">Email</Label>
						<Input
							id="profile-email"
							value={email}
							disabled
							className="max-w-sm"
						/>
						<p className="text-muted-foreground text-xs">
							Email is managed through your authentication provider.
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Appearance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						<Label htmlFor="theme-select">Theme</Label>
						<Select value={theme ?? "system"} onValueChange={setTheme}>
							<SelectTrigger id="theme-select" className="max-w-[200px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="system">System</SelectItem>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Leaderboard</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="leaderboard-opt-in">
								Show my name on leaderboards
							</Label>
							<p className="text-muted-foreground text-xs">
								When disabled, your name appears as &quot;Anonymous&quot; on
								challenge leaderboards.
							</p>
						</div>
						<Switch
							id="leaderboard-opt-in"
							checked={leaderboardOptIn}
							onCheckedChange={async (checked) => {
								setLeaderboardOptIn(checked);
								const result = await updateLeaderboardOptInAction(checked);
								if (result.success) {
									toast.success("Leaderboard preference updated");
								} else {
									setLeaderboardOptIn(!checked);
									toast.error(result.error);
								}
							}}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
