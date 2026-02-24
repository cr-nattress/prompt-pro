"use client";

import { Download, Plus, Upload, Wand2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ExportDialog } from "@/components/prompt/export-dialog";
import { ImportDialog } from "@/components/prompt/import-dialog";
import { Button } from "@/components/ui/button";

interface PromptListHeaderProps {
	count: number;
	promptIds: string[];
	plan: string;
}

export function PromptListHeader({
	count,
	promptIds,
	plan,
}: PromptListHeaderProps) {
	const [exportOpen, setExportOpen] = useState(false);
	const [importOpen, setImportOpen] = useState(false);

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl">
					Prompts{" "}
					<span className="font-normal text-muted-foreground">({count})</span>
				</h1>
				<div className="hidden items-center gap-2 md:flex">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setImportOpen(true)}
					>
						<Upload className="mr-1.5 h-3.5 w-3.5" />
						Import
					</Button>
					{promptIds.length > 0 && plan !== "free" && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setExportOpen(true)}
						>
							<Download className="mr-1.5 h-3.5 w-3.5" />
							Export All
						</Button>
					)}
					<Button asChild variant="outline">
						<Link href="/prompts/new?mode=guided">
							<Wand2 className="mr-2 h-4 w-4" />
							Guided Builder
						</Link>
					</Button>
					<Button asChild>
						<Link href="/prompts/new">
							<Plus className="mr-2 h-4 w-4" />
							New Prompt
						</Link>
					</Button>
				</div>
			</div>

			{/* Mobile FAB */}
			<Button
				asChild
				size="icon-lg"
				className="fixed bottom-20 right-4 z-40 shadow-lg md:hidden"
			>
				<Link href="/prompts/new">
					<Plus className="h-5 w-5" />
					<span className="sr-only">New Prompt</span>
				</Link>
			</Button>

			<ExportDialog
				open={exportOpen}
				onOpenChange={setExportOpen}
				promptIds={promptIds}
			/>
			<ImportDialog open={importOpen} onOpenChange={setImportOpen} />
		</>
	);
}
