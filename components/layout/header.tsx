"use client";

import { Search } from "lucide-react";
import { UserNav } from "@/components/layout/user-nav";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header({ workspaceName }: { workspaceName: string }) {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 !h-4" />
			<span className="font-semibold text-sm">PromptVault</span>
			<span className="text-muted-foreground text-sm">/ {workspaceName}</span>

			<div className="ml-auto flex items-center gap-2">
				<button
					type="button"
					onClick={() =>
						window.dispatchEvent(new CustomEvent("open-command-palette"))
					}
					className="text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-2 rounded-md border bg-transparent px-3 text-sm transition-colors"
				>
					<Search className="size-4" />
					<span className="hidden sm:inline">Search…</span>
					<kbd className="bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
						<span className="text-xs">⌘</span>K
					</kbd>
				</button>
				<UserNav />
			</div>
		</header>
	);
}
