"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggleDropdown } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

function UserNavContent({
	fullName,
	email,
	imageUrl,
	initials,
	onSignOut,
}: {
	fullName: string;
	email: string;
	imageUrl: string;
	initials: string;
	onSignOut: () => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="relative size-8 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<Avatar className="size-8">
						<AvatarImage src={imageUrl} alt={fullName} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col gap-1">
						<p className="font-medium text-sm leading-none">{fullName}</p>
						<p className="text-muted-foreground text-xs leading-none">
							{email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/settings">
						<Settings className="mr-2 size-4" />
						Settings
					</Link>
				</DropdownMenuItem>
				<ThemeToggleDropdown />
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={onSignOut}>
					<LogOut className="mr-2 size-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ClerkUserNav() {
	const { user } = useUser();
	const { signOut } = useClerk();

	if (!user) return null;

	const initials =
		[user.firstName, user.lastName]
			.filter(Boolean)
			.map((n) => n?.[0])
			.join("")
			.toUpperCase() ||
		user.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ||
		"?";

	return (
		<UserNavContent
			fullName={user.fullName ?? "User"}
			email={user.primaryEmailAddress?.emailAddress ?? ""}
			imageUrl={user.imageUrl}
			initials={initials}
			onSignOut={() => signOut({ redirectUrl: "/" })}
		/>
	);
}

function MockUserNav() {
	return (
		<UserNavContent
			fullName="Dev User"
			email="dev@localhost"
			imageUrl=""
			initials="DU"
			onSignOut={() => {
				window.location.href = "/";
			}}
		/>
	);
}

export function UserNav() {
	return bypassAuth ? <MockUserNav /> : <ClerkUserNav />;
}
