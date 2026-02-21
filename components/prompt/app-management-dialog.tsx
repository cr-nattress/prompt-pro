"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { App } from "@/lib/db/schema";
import { slugify } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";

const LLM_OPTIONS = [
	"gpt-4o",
	"gpt-4o-mini",
	"gpt-4-turbo",
	"gpt-3.5-turbo",
	"claude-3-5-sonnet",
	"claude-3-opus",
	"claude-3-haiku",
];

// --- Create / Edit Dialog ---

interface AppFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	app?: App;
	onSave: (data: {
		name: string;
		slug: string;
		description?: string;
		defaultLlm?: string;
	}) => Promise<{ success: boolean; error?: string }>;
}

export function AppFormDialog({
	open,
	onOpenChange,
	app,
	onSave,
}: AppFormDialogProps) {
	const router = useRouter();
	const [name, setName] = useState(app?.name ?? "");
	const [slug, setSlug] = useState(app?.slug ?? "");
	const [description, setDescription] = useState(app?.description ?? "");
	const [defaultLlm, setDefaultLlm] = useState(app?.defaultLlm ?? "");
	const [isSaving, setIsSaving] = useState(false);
	const isCreate = !app;

	async function handleSubmit() {
		if (!name.trim() || !slug.trim()) {
			showToast("warning", "Name and slug are required");
			return;
		}

		setIsSaving(true);
		const data: {
			name: string;
			slug: string;
			description?: string;
			defaultLlm?: string;
		} = {
			name: name.trim(),
			slug: slug.trim(),
		};
		if (description.trim()) data.description = description.trim();
		if (defaultLlm) data.defaultLlm = defaultLlm;

		const result = await onSave(data);
		setIsSaving(false);

		if (result.success) {
			showToast("success", isCreate ? "App created" : "App updated");
			onOpenChange(false);
			router.refresh();
		} else {
			showToast("error", result.error ?? "Failed to save app");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isCreate ? "Create App" : "Edit App"}</DialogTitle>
					<DialogDescription>
						{isCreate
							? "Apps group related prompts together."
							: `Editing "${app.name}"`}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="app-name">Name</Label>
						<Input
							id="app-name"
							placeholder="My App"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (isCreate) setSlug(slugify(e.target.value));
							}}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="app-slug">Slug</Label>
						<Input
							id="app-slug"
							placeholder="my-app"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="app-description">Description</Label>
						<Textarea
							id="app-description"
							placeholder="What is this app for?"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="app-llm">Default LLM</Label>
						<Select value={defaultLlm} onValueChange={setDefaultLlm}>
							<SelectTrigger id="app-llm">
								<SelectValue placeholder="Select model" />
							</SelectTrigger>
							<SelectContent>
								{LLM_OPTIONS.map((llm) => (
									<SelectItem key={llm} value={llm}>
										{llm}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isSaving}>
						{isSaving ? "Saving..." : isCreate ? "Create" : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// --- Delete Dialog ---

interface AppDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	app: App;
	promptCount: number;
	onDelete: () => Promise<{ success: boolean; error?: string }>;
}

export function AppDeleteDialog({
	open,
	onOpenChange,
	app,
	promptCount,
	onDelete,
}: AppDeleteDialogProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);
		const result = await onDelete();
		setIsDeleting(false);

		if (result.success) {
			showToast("success", `App "${app.name}" deleted`);
			onOpenChange(false);
			router.refresh();
		} else {
			showToast("error", result.error ?? "Failed to delete app");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete app</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete &ldquo;{app.name}&rdquo;?
						{promptCount > 0 && (
							<>
								{" "}
								This will also delete{" "}
								<strong>
									{promptCount} prompt{promptCount !== 1 ? "s" : ""}
								</strong>{" "}
								and all their versions.
							</>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
