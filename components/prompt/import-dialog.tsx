"use client";

import { FileUp, Loader2, MessageSquare, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import {
	extractFromConversationAction,
	importPromptsAction,
	parseImportFileAction,
} from "@/app/(dashboard)/prompts/import-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ImportedPrompt } from "@/lib/import";
import { showToast } from "@/lib/toast";

interface ImportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
	const router = useRouter();
	const [tab, setTab] = useState("file");
	const [isPending, startTransition] = useTransition();

	// File import state
	const [parsedPrompts, setParsedPrompts] = useState<ImportedPrompt[]>([]);
	const [parseErrors, setParseErrors] = useState<string[]>([]);
	const [selectedFile, setSelectedFile] = useState<string>("");

	// Conversation import state
	const [conversationText, setConversationText] = useState("");
	const [extractedPrompts, setExtractedPrompts] = useState<ImportedPrompt[]>(
		[],
	);

	const resetState = useCallback(() => {
		setParsedPrompts([]);
		setParseErrors([]);
		setSelectedFile("");
		setConversationText("");
		setExtractedPrompts([]);
	}, []);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setSelectedFile(file.name);
		const reader = new FileReader();
		reader.onload = () => {
			const content = reader.result as string;
			startTransition(async () => {
				const result = await parseImportFileAction(content, file.name);
				if (result.success) {
					setParsedPrompts(result.data.prompts);
					setParseErrors(result.data.errors);
				} else {
					showToast("error", result.error);
				}
			});
		};
		reader.readAsText(file);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (!file) return;

		setSelectedFile(file.name);
		const reader = new FileReader();
		reader.onload = () => {
			const content = reader.result as string;
			startTransition(async () => {
				const result = await parseImportFileAction(content, file.name);
				if (result.success) {
					setParsedPrompts(result.data.prompts);
					setParseErrors(result.data.errors);
				} else {
					showToast("error", result.error);
				}
			});
		};
		reader.readAsText(file);
	}

	function handleExtractFromConversation() {
		startTransition(async () => {
			const result = await extractFromConversationAction(conversationText);
			if (result.success) {
				setExtractedPrompts(result.data);
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleImport(prompts: ImportedPrompt[]) {
		startTransition(async () => {
			const result = await importPromptsAction(prompts);
			if (result.success) {
				showToast(
					"success",
					`Imported ${result.data.imported} prompt(s)${result.data.skipped > 0 ? `, ${result.data.skipped} skipped` : ""}`,
				);
				onOpenChange(false);
				resetState();
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				onOpenChange(v);
				if (!v) resetState();
			}}
		>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Import Prompts</DialogTitle>
				</DialogHeader>

				<Tabs value={tab} onValueChange={setTab}>
					<TabsList className="w-full">
						<TabsTrigger value="file" className="flex-1">
							<FileUp className="mr-1.5 h-3.5 w-3.5" />
							From File
						</TabsTrigger>
						<TabsTrigger value="conversation" className="flex-1">
							<MessageSquare className="mr-1.5 h-3.5 w-3.5" />
							From Conversation
						</TabsTrigger>
					</TabsList>

					<TabsContent value="file" className="space-y-4">
						{parsedPrompts.length === 0 ? (
							// biome-ignore lint/a11y/useSemanticElements: drop zone requires div with drag handlers
							<div
								role="region"
								className="relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50"
								onDragOver={(e) => e.preventDefault()}
								onDrop={handleDrop}
							>
								<Upload className="h-8 w-8 text-muted-foreground" />
								<div>
									<p className="font-medium text-sm">
										{selectedFile || "Drop file here or click to browse"}
									</p>
									<p className="text-muted-foreground text-xs">
										Supports JSON, YAML files
									</p>
								</div>
								<input
									type="file"
									accept=".json,.yaml,.yml"
									onChange={handleFileChange}
									className="absolute inset-0 cursor-pointer opacity-0"
								/>
								{isPending && (
									<Loader2 className="h-5 w-5 animate-spin text-primary" />
								)}
							</div>
						) : (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<p className="font-medium text-sm">
										{parsedPrompts.length} prompt(s) found
									</p>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setParsedPrompts([]);
											setSelectedFile("");
										}}
									>
										<X className="h-3.5 w-3.5" />
									</Button>
								</div>

								{parseErrors.length > 0 && (
									<div className="rounded-md bg-destructive/10 p-2">
										{parseErrors.map((err) => (
											<p key={err} className="text-destructive text-xs">
												{err}
											</p>
										))}
									</div>
								)}

								<div className="max-h-60 space-y-2 overflow-y-auto">
									{parsedPrompts.map((p) => (
										<div key={p.slug} className="rounded-md border p-2">
											<p className="font-medium text-sm">{p.name}</p>
											{p.tags && p.tags.length > 0 && (
												<div className="mt-1 flex flex-wrap gap-1">
													{p.tags.map((tag) => (
														<Badge
															key={tag}
															variant="outline"
															className="text-xs"
														>
															{tag}
														</Badge>
													))}
												</div>
											)}
										</div>
									))}
								</div>

								<Button
									className="w-full"
									onClick={() => handleImport(parsedPrompts)}
									disabled={isPending}
								>
									{isPending && (
										<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
									)}
									Import {parsedPrompts.length} Prompt(s)
								</Button>
							</div>
						)}
					</TabsContent>

					<TabsContent value="conversation" className="space-y-4">
						{extractedPrompts.length === 0 ? (
							<>
								<Textarea
									placeholder="Paste your ChatGPT, Claude, or other AI conversation here..."
									value={conversationText}
									onChange={(e) => setConversationText(e.target.value)}
									rows={8}
								/>
								<Button
									className="w-full"
									onClick={handleExtractFromConversation}
									disabled={isPending || conversationText.length < 50}
								>
									{isPending ? (
										<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
									) : (
										<MessageSquare className="mr-1.5 h-3.5 w-3.5" />
									)}
									Extract Prompts
								</Button>
							</>
						) : (
							<div className="space-y-3">
								<p className="font-medium text-sm">
									{extractedPrompts.length} prompt(s) extracted
								</p>

								<div className="max-h-60 space-y-2 overflow-y-auto">
									{extractedPrompts.map((p) => (
										<div key={p.slug} className="rounded-md border p-2">
											<p className="font-medium text-sm">{p.name}</p>
											{p.description && (
												<p className="text-muted-foreground text-xs">
													{p.description}
												</p>
											)}
											<pre className="mt-1 max-h-20 overflow-hidden text-ellipsis whitespace-pre-wrap text-xs">
												{p.templateText.slice(0, 200)}
												{p.templateText.length > 200 ? "..." : ""}
											</pre>
										</div>
									))}
								</div>

								<div className="flex gap-2">
									<Button
										variant="outline"
										className="flex-1"
										onClick={() => setExtractedPrompts([])}
									>
										Back
									</Button>
									<Button
										className="flex-1"
										onClick={() => handleImport(extractedPrompts)}
										disabled={isPending}
									>
										{isPending && (
											<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
										)}
										Import {extractedPrompts.length} Prompt(s)
									</Button>
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
