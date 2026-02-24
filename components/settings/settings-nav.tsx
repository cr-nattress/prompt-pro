"use client";

import {
	Bell,
	Boxes,
	ClipboardList,
	CreditCard,
	FolderOpen,
	KeyRound,
	User,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{ label: "Profile", href: "/settings", icon: User },
	{ label: "Workspace", href: "/settings/workspace", icon: Wrench },
	{ label: "Apps", href: "/settings/apps", icon: Boxes },
	{ label: "Collections", href: "/settings/collections", icon: FolderOpen },
	{ label: "Team", href: "/settings/team", icon: Users },
	{ label: "API Keys", href: "/settings/api-keys", icon: KeyRound },
	{ label: "Webhooks", href: "/settings/webhooks", icon: Bell },
	{ label: "Audit Log", href: "/settings/audit-log", icon: ClipboardList },
	{ label: "Billing", href: "/settings/billing", icon: CreditCard },
];

export function SettingsNav() {
	const pathname = usePathname();

	return (
		<nav className="flex shrink-0 gap-1 overflow-x-auto md:w-48 md:flex-col">
			{NAV_ITEMS.map((item) => {
				const isActive =
					item.href === "/settings"
						? pathname === "/settings"
						: pathname.startsWith(item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
							isActive
								? "bg-secondary font-medium text-foreground"
								: "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
						)}
					>
						<item.icon className="h-4 w-4 shrink-0" />
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}
