"use client";

import {
	Download,
	FileJson,
	FileSpreadsheet,
	FileText,
	Loader2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { exportPromptsAction } from "@/app/(dashboard)/prompts/export-actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ExportFormat } from "@/lib/export";
import { showToast } from "@/lib/toast";

interface ExportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	promptIds: string[];
}

const FORMAT_OPTIONS: {
	value: ExportFormat;
	label: string;
	desc: string;
	icon: React.ReactNode;
}[] = [
	{
		value: "json",
		label: "JSON",
		desc: "Full metadata, versions, parameters",
		icon: <FileJson className="h-4 w-4" />,
	},
	{
		value: "yaml",
		label: "YAML",
		desc: "Human-readable, Git-friendly",
		icon: <FileText className="h-4 w-4" />,
	},
	{
		value: "markdown",
		label: "Markdown",
		desc: "Documentation format",
		icon: <FileText className="h-4 w-4" />,
	},
	{
		value: "csv",
		label: "CSV",
		desc: "Spreadsheet-compatible, latest version only",
		icon: <FileSpreadsheet className="h-4 w-4" />,
	},
];

export function ExportDialog({
	open,
	onOpenChange,
	promptIds,
}: ExportDialogProps) {
	const [format, setFormat] = useState<ExportFormat>("json");
	const [isPending, startTransition] = useTransition();

	function handleExport() {
		startTransition(async () => {
			const result = await exportPromptsAction(promptIds, format);
			if (result.success) {
				// Trigger download
				const blob = new Blob([result.data.content], {
					type: result.data.mimeType,
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = result.data.filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				showToast("success", `Exported ${promptIds.length} prompt(s)`);
				onOpenChange(false);
			} else {
				showToast("error", result.error);
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						Export {promptIds.length} Prompt{promptIds.length !== 1 ? "s" : ""}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<p className="mb-2 font-medium text-sm">Export Format</p>
						<RadioGroup
							value={format}
							onValueChange={(v) => setFormat(v as ExportFormat)}
							className="space-y-2"
						>
							{FORMAT_OPTIONS.map((opt) => (
								// biome-ignore lint/a11y/noLabelWithoutControl: label wraps RadioGroupItem which renders an input
								<label
									key={opt.value}
									className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
								>
									<RadioGroupItem value={opt.value} />
									<span className="text-muted-foreground">{opt.icon}</span>
									<div>
										<p className="font-medium text-sm">{opt.label}</p>
										<p className="text-muted-foreground text-xs">{opt.desc}</p>
									</div>
								</label>
							))}
						</RadioGroup>
					</div>

					<Button
						className="w-full"
						onClick={handleExport}
						disabled={isPending}
					>
						{isPending ? (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						) : (
							<Download className="mr-1.5 h-3.5 w-3.5" />
						)}
						Export
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
