"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { createBlockAction } from "@/app/(dashboard)/blueprints/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { BLOCK_TYPE_CONFIG, BLOCK_TYPES } from "@/lib/blueprint-utils";
import { slugify } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";

interface AddBlockCardProps {
	blueprintId: string | null;
}

export function AddBlockCard({ blueprintId }: AddBlockCardProps) {
	const { addBlock, selectBlock } = useBlueprintDesignerStore();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [type, setType] = useState<string>("system");
	const [isCreating, setIsCreating] = useState(false);

	async function handleCreate() {
		if (!name.trim() || !blueprintId) return;

		setIsCreating(true);
		const result = await createBlockAction(blueprintId, {
			name: name.trim(),
			slug: slugify(name.trim()),
			type,
		});
		setIsCreating(false);

		if (result.success) {
			addBlock(result.data);
			selectBlock(result.data.id);
			setOpen(false);
			setName("");
			setType("system");
		} else {
			showToast("error", result.error);
		}
	}

	const card = (
		<div
			className={`flex items-center justify-center rounded-lg border border-dashed p-4 transition-colors ${
				blueprintId
					? "cursor-pointer hover:border-primary hover:bg-accent/50"
					: "cursor-not-allowed opacity-50"
			}`}
		>
			<Plus className="mr-2 h-4 w-4 text-muted-foreground" />
			<span className="text-muted-foreground text-sm">Add block</span>
		</div>
	);

	if (!blueprintId) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>{card}</TooltipTrigger>
				<TooltipContent>Save the blueprint first to add blocks</TooltipContent>
			</Tooltip>
		);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{card}</PopoverTrigger>
			<PopoverContent className="w-72" align="start">
				<div className="flex flex-col gap-3">
					<h4 className="font-medium text-sm">New block</h4>
					<Select value={type} onValueChange={setType}>
						<SelectTrigger>
							<SelectValue placeholder="Block type" />
						</SelectTrigger>
						<SelectContent>
							{BLOCK_TYPES.map((t) => {
								const config = BLOCK_TYPE_CONFIG[t];
								return (
									<SelectItem key={t} value={t}>
										<div className="flex items-center gap-2">
											<config.icon className="h-3.5 w-3.5" />
											{config.label}
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
					<Input
						placeholder="Block name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleCreate();
							}
						}}
					/>
					<Button
						size="sm"
						onClick={handleCreate}
						disabled={!name.trim() || isCreating}
					>
						{isCreating ? "Creating..." : "Create"}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
