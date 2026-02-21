"use client";

import { Check, Copy } from "lucide-react";
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

interface TokenRevealDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	label: string;
	token: string;
}

export function TokenRevealDialog({
	open,
	onOpenChange,
	label,
	token,
}: TokenRevealDialogProps) {
	const [copied, setCopied] = useState(false);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(token);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>API Key Created</DialogTitle>
					<DialogDescription>
						Your API key <strong>&ldquo;{label}&rdquo;</strong> has been
						created. Copy it now &mdash; this key will not be shown again.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2 py-2">
					<div className="flex items-center gap-2 rounded-md border bg-muted p-3">
						<code className="flex-1 break-all text-sm">{token}</code>
						<Button variant="ghost" size="icon-sm" onClick={copyToClipboard}>
							{copied ? (
								<Check className="h-4 w-4 text-green-600" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
					<p className="text-muted-foreground text-xs">
						Store this key in a secure location. You will not be able to view it
						again after closing this dialog.
					</p>
				</div>
				<DialogFooter>
					<Button onClick={() => onOpenChange(false)}>Done</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
