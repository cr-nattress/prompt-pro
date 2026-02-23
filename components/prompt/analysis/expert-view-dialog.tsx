"use client";

import { Check, GraduationCap, X } from "lucide-react";
import type { ExpertRewriteResult } from "@/app/(dashboard)/prompts/expert-actions";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { DiffViewer } from "@/components/version/diff-viewer";

interface ExpertViewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	originalText: string;
	result: ExpertRewriteResult;
	onApply: () => void;
}

const TECHNIQUE_COLORS: Record<string, string> = {
	"Few-shot examples": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	"Chain-of-thought": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
	"Role definition": "bg-green-500/10 text-green-600 dark:text-green-400",
	"Output formatting": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	"Constraint setting": "bg-red-500/10 text-red-600 dark:text-red-400",
	"Context grounding": "bg-teal-500/10 text-teal-600 dark:text-teal-400",
};

function getTechniqueColor(technique: string): string {
	// Check for partial matches
	for (const [key, color] of Object.entries(TECHNIQUE_COLORS)) {
		if (technique.toLowerCase().includes(key.toLowerCase())) {
			return color;
		}
	}
	return "bg-muted text-muted-foreground";
}

export function ExpertViewDialog({
	open,
	onOpenChange,
	originalText,
	result,
	onApply,
}: ExpertViewDialogProps) {
	function handleApply() {
		onApply();
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<GraduationCap className="h-5 w-5 text-primary" />
						<DialogTitle>Expert Rewrite</DialogTitle>
					</div>
					<DialogDescription>{result.overallApproach}</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[60vh]">
					<div className="space-y-4">
						{/* Side-by-side diff */}
						<div className="rounded-md border">
							<DiffViewer
								oldValue={originalText}
								newValue={result.expertText}
								oldTitle="Your Version"
								newTitle="Expert Version"
								splitView
							/>
						</div>

						{/* Annotations */}
						{result.annotations.length > 0 && (
							<div className="space-y-3">
								<h3 className="font-medium text-sm">
									Changes Explained ({result.annotations.length})
								</h3>
								<div className="space-y-2">
									{result.annotations.map((annotation, i) => (
										<div
											key={`${annotation.technique}-${i}`}
											className="rounded-lg border bg-muted/20 p-3"
										>
											<div className="flex items-start gap-2">
												<Badge
													variant="outline"
													className={getTechniqueColor(annotation.technique)}
												>
													{annotation.technique}
												</Badge>
											</div>
											<p className="mt-2 text-sm">{annotation.explanation}</p>
											{annotation.original && (
												<div className="mt-2 grid gap-2 md:grid-cols-2">
													<div className="rounded bg-red-500/5 p-2">
														<p className="mb-1 text-muted-foreground text-xs">
															Before
														</p>
														<p className="line-through text-muted-foreground text-xs">
															{annotation.original.length > 200
																? `${annotation.original.slice(0, 200)}...`
																: annotation.original}
														</p>
													</div>
													<div className="rounded bg-green-500/5 p-2">
														<p className="mb-1 text-muted-foreground text-xs">
															After
														</p>
														<p className="text-xs">
															{annotation.replacement.length > 200
																? `${annotation.replacement.slice(0, 200)}...`
																: annotation.replacement}
														</p>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</ScrollArea>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						<X className="mr-1.5 h-3.5 w-3.5" />
						Close
					</Button>
					<Button onClick={handleApply}>
						<Check className="mr-1.5 h-3.5 w-3.5" />
						Apply Expert Version
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
