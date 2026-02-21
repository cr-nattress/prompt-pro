"use client";

import { Check, X } from "lucide-react";
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

interface EnhanceDiffDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	originalText: string;
	enhancedText: string;
	changesSummary: string[];
	onApply: () => void;
}

export function EnhanceDiffDialog({
	open,
	onOpenChange,
	originalText,
	enhancedText,
	changesSummary,
	onApply,
}: EnhanceDiffDialogProps) {
	function handleApply() {
		onApply();
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden">
				<DialogHeader>
					<DialogTitle>Enhanced Prompt</DialogTitle>
					<DialogDescription>
						Review the AI-suggested improvements before applying
					</DialogDescription>
				</DialogHeader>

				{changesSummary.length > 0 && (
					<div className="space-y-1">
						<p className="font-medium text-sm">Changes made:</p>
						<ul className="list-inside list-disc space-y-0.5 text-muted-foreground text-sm">
							{changesSummary.map((change) => (
								<li key={change}>{change}</li>
							))}
						</ul>
					</div>
				)}

				<div className="max-h-[50vh] overflow-auto rounded-md border">
					<DiffViewer
						oldValue={originalText}
						newValue={enhancedText}
						oldTitle="Original"
						newTitle="Enhanced"
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
