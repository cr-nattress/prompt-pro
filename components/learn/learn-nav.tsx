"use client";

import { AlertTriangle, BookOpen, Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{ label: "Techniques", href: "/learn", icon: BookOpen },
	{ label: "Anti-Patterns", href: "/learn/anti-patterns", icon: AlertTriangle },
	{ label: "Glossary", href: "/learn/glossary", icon: Library },
];

export function LearnNav() {
	const pathname = usePathname();

	return (
		<nav className="flex shrink-0 gap-1 overflow-x-auto md:w-48 md:flex-col">
			{NAV_ITEMS.map((item) => {
				const isActive =
					item.href === "/learn"
						? pathname === "/learn"
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
