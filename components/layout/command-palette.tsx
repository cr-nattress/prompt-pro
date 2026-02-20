"use client";

import { Plus, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNavItems } from "@/components/layout/nav-config";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		}

		function handleCustomEvent() {
			setOpen(true);
		}

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("open-command-palette", handleCustomEvent);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("open-command-palette", handleCustomEvent);
		};
	}, []);

	function runCommand(command: () => void) {
		setOpen(false);
		command();
	}

	const enabledNavItems = mainNavItems.filter((item) => !item.disabled);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search…" />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Navigation">
					{enabledNavItems.map((item) => (
						<CommandItem
							key={item.href}
							onSelect={() => runCommand(() => router.push(item.href))}
						>
							<item.icon />
							<span>{item.title}</span>
							{item.shortcutKeys && (
								<CommandShortcut>{item.shortcutKeys.join(" ")}</CommandShortcut>
							)}
						</CommandItem>
					))}
				</CommandGroup>

				<CommandGroup heading="Actions">
					<CommandItem
						onSelect={() => runCommand(() => router.push("/prompts/new"))}
					>
						<Plus />
						<span>New Prompt</span>
						<CommandShortcut>⌘N</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.push("/blueprints/new"))}
					>
						<Plus />
						<span>New Blueprint</span>
						<CommandShortcut>⌘⇧N</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.push("/settings"))}
					>
						<Settings />
						<span>Open Settings</span>
						<CommandShortcut>⌘,</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
