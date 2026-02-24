"use client";

import { Loader2, Settings2 } from "lucide-react";
import { useState } from "react";
import {
	type ModelOptimization,
	optimizeForModelAction,
} from "@/app/(dashboard)/prompts/optimize-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DiffViewer } from "@/components/version/diff-viewer";
import { OPTIMIZATION_TARGETS } from "@/lib/data/optimization-targets";
import { showToast } from "@/lib/toast";

interface OptimizeModelDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	templateText: string;
	onApply: (optimizedText: string) => void;
}

export function OptimizeModelDialog({
	open,
	onOpenChange,
	templateText,
	onApply,
}: OptimizeModelDialogProps) {
	const [targetModel, setTargetModel] = useState("claude");
	const [isOptimizing, setIsOptimizing] = useState(false);
	const [result, setResult] = useState<ModelOptimization | null>(null);

	async function handleOptimize() {
		setIsOptimizing(true);
		setResult(null);
		const res = await optimizeForModelAction(templateText, targetModel);
		setIsOptimizing(false);
		if (res.success) {
			setResult(res.data);
		} else {
			showToast("error", res.error);
		}
	}

	function handleApply() {
		if (result) {
			onApply(result.optimizedText);
			setResult(null);
			onOpenChange(false);
		}
	}

	function handleClose(open: boolean) {
		if (!open) setResult(null);
		onOpenChange(open);
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Settings2 className="h-5 w-5" />
						Optimize for Model
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Model selector + optimize button */}
					<div className="flex items-end gap-3">
						<div className="flex-1">
							{/* biome-ignore lint/a11y/noLabelWithoutControl: radix Select is adjacent sibling */}
							<label className="mb-1.5 block font-medium text-sm">
								Target Model Family
							</label>
							<Select value={targetModel} onValueChange={setTargetModel}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{OPTIMIZATION_TARGETS.map((t) => (
										<SelectItem key={t.value} value={t.value}>
											{t.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Button onClick={handleOptimize} disabled={isOptimizing}>
							{isOptimizing ? (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							) : (
								<Settings2 className="mr-1.5 h-3.5 w-3.5" />
							)}
							Optimize
						</Button>
					</div>

					{/* Results */}
					{result && (
						<>
							{/* Changes summary */}
							{result.changesSummary.length > 0 && (
								<div className="rounded-md border bg-muted/30 p-3">
									<p className="mb-2 font-medium text-sm">Changes applied:</p>
									<ul className="space-y-1">
										{result.changesSummary.map((change) => (
											<li
												key={change}
												className="flex items-start gap-1.5 text-muted-foreground text-xs"
											>
												<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
												{change}
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Diff view */}
							<div className="rounded-md border">
								<DiffViewer
									oldValue={templateText}
									newValue={result.optimizedText}
									oldTitle="Current"
									newTitle={`Optimized for ${OPTIMIZATION_TARGETS.find((t) => t.value === result.targetModel)?.label ?? result.targetModel}`}
									splitView={false}
								/>
							</div>

							{/* Action buttons */}
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => {
										setResult(null);
										onOpenChange(false);
									}}
								>
									Discard
								</Button>
								<Button onClick={handleApply}>Apply Optimization</Button>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
