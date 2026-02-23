"use client";

import { Check, TrendingDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DiffViewer } from "@/components/version/diff-viewer";

interface CompressDiffDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	originalText: string;
	compressedText: string;
	originalTokens: number;
	compressedTokens: number;
	savings: number;
	onApply: () => void;
}

export function CompressDiffDialog({
	open,
	onOpenChange,
	originalText,
	compressedText,
	originalTokens,
	compressedTokens,
	savings,
	onApply,
}: CompressDiffDialogProps) {
	function handleApply() {
		onApply();
		onOpenChange(false);
	}

	const savingsPercent =
		originalTokens > 0 ? Math.round((savings / originalTokens) * 100) : 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden">
				<DialogHeader>
					<DialogTitle>Compressed Prompt</DialogTitle>
					<DialogDescription>
						Review the compressed version before applying
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center gap-3">
					<TrendingDown className="h-4 w-4 text-green-500" />
					<div className="flex items-center gap-2 text-sm">
						<span className="text-muted-foreground">
							{originalTokens} tokens
						</span>
						<span className="text-muted-foreground">&rarr;</span>
						<span className="font-medium">{compressedTokens} tokens</span>
						<Badge
							variant="outline"
							className="bg-green-500/10 text-green-600 dark:text-green-400"
						>
							-{savings} tokens ({savingsPercent}%)
						</Badge>
					</div>
				</div>

				<div className="max-h-[50vh] overflow-auto rounded-md border">
					<DiffViewer
						oldValue={originalText}
						newValue={compressedText}
						oldTitle="Original"
						newTitle="Compressed"
						splitView
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						<X className="mr-1.5 h-3.5 w-3.5" />
						Discard
					</Button>
					<Button onClick={handleApply}>
						<Check className="mr-1.5 h-3.5 w-3.5" />
						Apply
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
