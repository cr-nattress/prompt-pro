"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import {
	createAppAction,
	fetchAppsAction,
} from "@/app/(dashboard)/prompts/app-actions";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { App } from "@/lib/db/schema";
import { slugify } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface AppSelectorProps {
	apps: App[];
	workspaceId: string;
	value: string;
	onChange: (value: string) => void;
}

export function AppSelector({
	apps: initialApps,
	workspaceId,
	value,
	onChange,
}: AppSelectorProps) {
	const [open, setOpen] = useState(false);
	const [apps, setApps] = useState(initialApps);
	const [creating, setCreating] = useState(false);
	const [newAppName, setNewAppName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const selectedApp = apps.find((a) => a.id === value);

	async function handleCreate() {
		if (!newAppName.trim()) return;
		setIsSubmitting(true);

		const result = await createAppAction({
			name: newAppName.trim(),
			slug: slugify(newAppName),
		});

		if (result.success) {
			setApps((prev) => [...prev, result.data]);
			onChange(result.data.id);
			setCreating(false);
			setNewAppName("");
			showToast("success", `App "${result.data.name}" created`);
		} else {
			showToast("error", result.error);
		}

		setIsSubmitting(false);
	}

	async function refreshApps() {
		const result = await fetchAppsAction(workspaceId);
		if (result.success) {
			setApps(result.data);
		}
	}

	return (
		<Popover
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
				if (o) refreshApps();
				if (!o) setCreating(false);
			}}
		>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-between font-normal"
				>
					{selectedApp?.name ?? "Select app..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0" align="start">
				{creating ? (
					<div className="flex flex-col gap-2 p-3">
						<p className="font-medium text-sm">New app</p>
						<Input
							placeholder="App name"
							value={newAppName}
							onChange={(e) => setNewAppName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleCreate();
							}}
							autoFocus
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handleCreate}
								disabled={isSubmitting || !newAppName.trim()}
							>
								{isSubmitting ? "Creating..." : "Create"}
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => {
									setCreating(false);
									setNewAppName("");
								}}
							>
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<Command>
						<CommandInput placeholder="Search apps..." />
						<CommandList>
							<CommandEmpty>No apps found.</CommandEmpty>
							<CommandGroup>
								{apps.map((app) => (
									<CommandItem
										key={app.id}
										value={app.name}
										onSelect={() => {
											onChange(app.id);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === app.id ? "opacity-100" : "opacity-0",
											)}
										/>
										{app.name}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem onSelect={() => setCreating(true)}>
									<Plus className="mr-2 h-4 w-4" />
									Create new app
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				)}
			</PopoverContent>
		</Popover>
	);
}
