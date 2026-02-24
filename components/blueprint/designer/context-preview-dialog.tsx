"use client";

import { ClipboardCopy, Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { AttentionHeatmap } from "@/components/blueprint/attention-heatmap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
	BLOCK_TYPE_CONFIG,
	type BlockType,
	blockTypeStyle,
} from "@/lib/blueprint-utils";
import { assembleBlueprint } from "@/lib/resolve/blueprint-assembler";
import { showToast } from "@/lib/toast";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";

interface ContextPreviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * Extract all {{param}} names from all blocks.
 */
function extractAllParams(blocks: { content: string | null }[]): string[] {
	const params = new Set<string>();
	const regex = /\{\{([^}]+)\}\}/g;
	for (const block of blocks) {
		if (!block.content) continue;
		let match = regex.exec(block.content);
		while (match) {
			if (match[1]) params.add(match[1].trim());
			match = regex.exec(block.content);
		}
	}
	return [...params].sort();
}

export function ContextPreviewDialog({
	open,
	onOpenChange,
}: ContextPreviewDialogProps) {
	const { blocks } = useBlueprintDesignerStore();
	const [paramValues, setParamValues] = useState<Record<string, string>>({});
	const [showResolved, setShowResolved] = useState(false);

	const allParamNames = useMemo(() => extractAllParams(blocks), [blocks]);

	const assembled = useMemo(
		() => assembleBlueprint(blocks, showResolved ? paramValues : {}),
		[blocks, paramValues, showResolved],
	);

	function handleCopyAll() {
		const fullContext = assembled.blocks
			.map((b) => `--- ${b.name} (${b.type}) ---\n${b.resolvedContent}`)
			.join("\n\n");
		navigator.clipboard.writeText(fullContext).then(() => {
			showToast("success", "Full context copied to clipboard");
		});
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-xl">
				<SheetHeader>
					<SheetTitle>Context Preview</SheetTitle>
					<p className="text-muted-foreground text-sm">
						What the model will see —{" "}
						{assembled.totalTokenCount.toLocaleString()} tokens across{" "}
						{assembled.blocks.length} block
						{assembled.blocks.length !== 1 ? "s" : ""}
					</p>
				</SheetHeader>

				<ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
					<div className="flex flex-col gap-4 pr-4">
						{/* Parameter inputs */}
						{allParamNames.length > 0 && (
							<div className="rounded-lg border bg-muted/30 p-4">
								<div className="mb-3 flex items-center justify-between">
									<p className="font-medium text-sm">
										Parameters ({allParamNames.length})
									</p>
									<div className="flex items-center gap-2">
										<Label
											htmlFor="resolve-toggle"
											className="text-muted-foreground text-xs"
										>
											{showResolved ? (
												<Eye className="mr-1 inline h-3 w-3" />
											) : (
												<EyeOff className="mr-1 inline h-3 w-3" />
											)}
											Resolve
										</Label>
										<Switch
											id="resolve-toggle"
											checked={showResolved}
											onCheckedChange={setShowResolved}
										/>
									</div>
								</div>
								<div className="grid gap-2 sm:grid-cols-2">
									{allParamNames.map((name) => (
										<div key={name}>
											<Label className="text-xs">{`{{${name}}}`}</Label>
											<Input
												value={paramValues[name] ?? ""}
												onChange={(e) =>
													setParamValues((prev) => ({
														...prev,
														[name]: e.target.value,
													}))
												}
												placeholder={`Sample ${name}...`}
												className="h-8 text-sm"
											/>
										</div>
									))}
								</div>
								{assembled.allUnresolvedParams.length > 0 && showResolved && (
									<p className="mt-2 text-amber-600 text-xs dark:text-amber-400">
										{assembled.allUnresolvedParams.length} unresolved:{" "}
										{assembled.allUnresolvedParams
											.map((p) => `{{${p}}}`)
											.join(", ")}
									</p>
								)}
							</div>
						)}

						{/* Token breakdown summary */}
						<div className="flex items-center justify-between">
							<div className="flex flex-wrap gap-1.5">
								{assembled.blocks.map((block) => {
									const config = BLOCK_TYPE_CONFIG[block.type as BlockType];
									return (
										<Badge key={block.id} variant="outline" className="text-xs">
											{config?.label ?? block.type}:{" "}
											{block.tokenCount.toLocaleString()}
										</Badge>
									);
								})}
							</div>
							<Button variant="outline" size="sm" onClick={handleCopyAll}>
								<ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
								Copy All
							</Button>
						</div>

						{/* Block previews */}
						{assembled.blocks.map((block) => {
							const config = BLOCK_TYPE_CONFIG[block.type as BlockType];

							return (
								<div
									key={block.id}
									className="rounded-lg border border-l-4 p-4"
									style={blockTypeStyle(block.type)}
								>
									<div className="mb-2 flex items-center gap-2">
										{config && (
											<span
												className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-xs"
												style={{
													backgroundColor: `color-mix(in oklch, var(${config.cssVar}) 15%, transparent)`,
													color: `var(${config.cssVar})`,
												}}
											>
												<config.icon className="h-3 w-3" />
												{config.label}
											</span>
										)}
										<span className="font-medium text-sm">{block.name}</span>
										{block.unresolvedParams.length > 0 && (
											<Badge
												variant="outline"
												className="text-amber-600 text-xs dark:text-amber-400"
											>
												{block.unresolvedParams.length} unresolved
											</Badge>
										)}
										<span className="ml-auto text-muted-foreground text-xs">
											{block.tokenCount.toLocaleString()} tokens
										</span>
									</div>
									{block.resolvedContent ? (
										<pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-sm">
											{block.resolvedContent}
										</pre>
									) : (
										<p className="text-muted-foreground text-sm italic">
											No content
										</p>
									)}
								</div>
							);
						})}
						{/* Attention heatmap */}
						{assembled.blocks.length > 0 && (
							<div className="rounded-lg border p-4">
								<p className="mb-3 font-medium text-sm">Attention Analysis</p>
								<AttentionHeatmap
									text={assembled.blocks
										.map((b) => b.resolvedContent)
										.filter(Boolean)
										.join("\n\n")}
								/>
							</div>
						)}

						{assembled.blocks.length === 0 && (
							<p className="py-8 text-center text-muted-foreground">
								No blocks to preview
							</p>
						)}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
