"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggleDropdown() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Sun className="size-4" />
				Theme
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuRadioGroup
					value={theme ?? "system"}
					onValueChange={setTheme}
				>
					<DropdownMenuRadioItem value="light">
						<Sun className="mr-2 size-4" />
						Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark">
						<Moon className="mr-2 size-4" />
						Dark
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system">
						<Monitor className="mr-2 size-4" />
						System
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
