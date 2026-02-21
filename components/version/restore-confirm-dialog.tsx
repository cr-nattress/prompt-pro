"use client";

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
import { formatVersionLabel } from "@/lib/version-utils";

interface RestoreConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	version: number;
	onConfirm: (changeNote: string) => Promise<boolean>;
}

export function RestoreConfirmDialog({
	open,
	onOpenChange,
	version,
	onConfirm,
}: RestoreConfirmDialogProps) {
	const defaultNote = `Restored from ${formatVersionLabel(version)}`;
	const [changeNote, setChangeNote] = useState(defaultNote);
	const [isPending, setIsPending] = useState(false);

	async function handleConfirm() {
		setIsPending(true);
		const success = await onConfirm(changeNote);
		setIsPending(false);
		if (success) onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Restore Version</DialogTitle>
					<DialogDescription>
						Creates a new draft version with content from{" "}
						{formatVersionLabel(version)}.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2 py-2">
					<Label htmlFor="restore-note">Change note</Label>
					<Input
						id="restore-note"
						value={changeNote}
						onChange={(e) => setChangeNote(e.target.value)}
						maxLength={500}
					/>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={isPending}>
						{isPending ? "Restoring..." : "Restore"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
