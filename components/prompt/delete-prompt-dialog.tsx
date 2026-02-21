"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	createPromptAction,
	deletePromptAction,
} from "@/app/(dashboard)/prompts/actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/lib/toast";

interface DeletePromptDialogProps {
	promptId: string;
	promptName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeletePromptDialog({
	promptId,
	promptName,
	open,
	onOpenChange,
}: DeletePromptDialogProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);
		const result = await deletePromptAction(promptId);
		setIsDeleting(false);

		if (!result.success) {
			showToast("error", result.error);
			return;
		}

		onOpenChange(false);
		router.refresh();

		const deleted = result.data;
		showToast("success", `"${promptName}" deleted`, {
			action: {
				label: "Undo",
				onClick: async () => {
					const undoResult = await createPromptAction({
						name: deleted.name,
						slug: deleted.slug,
						appId: deleted.appId,
						purpose: deleted.purpose ?? undefined,
						description: deleted.description ?? undefined,
						tags: deleted.tags ?? undefined,
						templateText: deleted.latestVersion?.templateText ?? "",
						llm: deleted.latestVersion?.llm ?? undefined,
					});
					if (undoResult.success) {
						showToast("success", "Prompt restored");
						router.refresh();
					} else {
						showToast("error", "Failed to restore prompt");
					}
				},
			},
			duration: 5000,
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete prompt</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete &ldquo;{promptName}&rdquo;? This
						will also delete all versions. This action cannot be undone.
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
