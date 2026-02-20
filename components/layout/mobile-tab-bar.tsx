"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileTabItems } from "@/components/layout/nav-config";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
	const pathname = usePathname();

	return (
		<nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur md:hidden">
			<div className="flex h-16 items-center justify-around">
				{mobileTabItems.map((item) => {
					const isActive = pathname.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 text-xs transition-colors",
								isActive
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<item.icon className="size-5" />
							<span>{item.title}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
