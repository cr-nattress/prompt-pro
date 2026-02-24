"use client";

import { ListChecks, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	type FewShotExample,
	generateFewShotExamplesAction,
} from "@/app/(dashboard)/prompts/fewshot-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";

interface FewShotDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	templateText: string;
	onInsert: (formattedExamples: string) => void;
}

function formatExamples(examples: FewShotExample[]): string {
	return examples
		.map(
			(ex, i) => `Example ${i + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}`,
		)
		.join("\n\n");
}

export function FewShotDialog({
	open,
	onOpenChange,
	templateText,
	onInsert,
}: FewShotDialogProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [examples, setExamples] = useState<FewShotExample[]>([]);

	async function handleGenerate() {
		setIsGenerating(true);
		const result = await generateFewShotExamplesAction(templateText);
		setIsGenerating(false);
		if (result.success) {
			setExamples(result.data);
		} else {
			showToast("error", result.error);
		}
	}

	function handleRemove(index: number) {
		setExamples((prev) => prev.filter((_, i) => i !== index));
	}

	function handleUpdateInput(index: number, value: string) {
		setExamples((prev) =>
			prev.map((ex, i) => (i === index ? { ...ex, input: value } : ex)),
		);
	}

	function handleUpdateOutput(index: number, value: string) {
		setExamples((prev) =>
			prev.map((ex, i) => (i === index ? { ...ex, output: value } : ex)),
		);
	}

	function handleInsert() {
		const formatted = formatExamples(examples);
		onInsert(formatted);
		setExamples([]);
		onOpenChange(false);
		showToast("success", "Examples added to prompt");
	}

	function handleClose(nextOpen: boolean) {
		if (!nextOpen) setExamples([]);
		onOpenChange(nextOpen);
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ListChecks className="h-5 w-5" />
						Generate Few-Shot Examples
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{examples.length === 0 ? (
						<div className="flex flex-col items-center gap-3 py-6 text-center">
							<p className="text-muted-foreground text-sm">
								AI will generate 3 diverse input/output examples based on your
								prompt. You can edit them before inserting.
							</p>
							<Button onClick={handleGenerate} disabled={isGenerating}>
								{isGenerating ? (
									<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
								) : (
									<ListChecks className="mr-1.5 h-3.5 w-3.5" />
								)}
								{isGenerating ? "Generating..." : "Generate Examples"}
							</Button>
						</div>
					) : (
						<>
							{examples.map((example, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: examples are reordered/edited, no stable id
								<div key={`example-${index}`} className="rounded-lg border p-4">
									<div className="mb-3 flex items-center justify-between">
										<p className="font-medium text-sm">Example {index + 1}</p>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemove(index)}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
									<div className="space-y-3">
										<div>
											{/* biome-ignore lint/a11y/noLabelWithoutControl: textarea is adjacent sibling */}
											<label className="mb-1 block text-muted-foreground text-xs">
												Input
											</label>
											<Textarea
												value={example.input}
												onChange={(e) =>
													handleUpdateInput(index, e.target.value)
												}
												rows={3}
												className="font-mono text-sm"
											/>
										</div>
										<div>
											{/* biome-ignore lint/a11y/noLabelWithoutControl: textarea is adjacent sibling */}
											<label className="mb-1 block text-muted-foreground text-xs">
												Expected Output
											</label>
											<Textarea
												value={example.output}
												onChange={(e) =>
													handleUpdateOutput(index, e.target.value)
												}
												rows={3}
												className="font-mono text-sm"
											/>
										</div>
									</div>
								</div>
							))}

							<div className="flex items-center justify-between border-t pt-4">
								<Button
									variant="outline"
									size="sm"
									onClick={handleGenerate}
									disabled={isGenerating}
								>
									{isGenerating ? (
										<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
									) : (
										<ListChecks className="mr-1.5 h-3.5 w-3.5" />
									)}
									Regenerate
								</Button>
								<Button onClick={handleInsert} disabled={examples.length === 0}>
									Add to Prompt ({examples.length} example
									{examples.length !== 1 ? "s" : ""})
								</Button>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
