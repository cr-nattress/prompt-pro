"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBlueprintAction } from "@/app/(dashboard)/blueprints/actions";
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

interface DeleteBlueprintDialogProps {
	blueprintId: string;
	blueprintName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteBlueprintDialog({
	blueprintId,
	blueprintName,
	open,
	onOpenChange,
}: DeleteBlueprintDialogProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);
		const result = await deleteBlueprintAction(blueprintId);
		setIsDeleting(false);

		if (!result.success) {
			showToast("error", result.error);
			return;
		}

		onOpenChange(false);
		router.refresh();
		showToast("success", `"${blueprintName}" deleted`);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete blueprint</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete &ldquo;{blueprintName}&rdquo;? This
						will also delete all blocks. This action cannot be undone.
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
