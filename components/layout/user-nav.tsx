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

export function UserNav() {
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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="relative size-8 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<Avatar className="size-8">
						<AvatarImage
							src={user.imageUrl}
							alt={user.fullName ?? "User avatar"}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col gap-1">
						<p className="font-medium text-sm leading-none">{user.fullName}</p>
						<p className="text-muted-foreground text-xs leading-none">
							{user.primaryEmailAddress?.emailAddress}
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
				<DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
					<LogOut className="mr-2 size-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
