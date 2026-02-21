"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	BLOCK_TYPE_CONFIG,
	type BlockType,
	blockTypeStyle,
} from "@/lib/blueprint-utils";
import { countTokens } from "@/lib/token-utils";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";

interface ContextPreviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ContextPreviewDialog({
	open,
	onOpenChange,
}: ContextPreviewDialogProps) {
	const { blocks } = useBlueprintDesignerStore();

	const totalTokens = blocks.reduce((acc, block) => {
		return acc + (block.content ? countTokens(block.content) : 0);
	}, 0);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-xl">
				<SheetHeader>
					<SheetTitle>Context Preview</SheetTitle>
					<p className="text-muted-foreground text-sm">
						{totalTokens.toLocaleString()} total tokens across {blocks.length}{" "}
						block{blocks.length !== 1 ? "s" : ""}
					</p>
				</SheetHeader>
				<ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
					<div className="flex flex-col gap-4 pr-4">
						{blocks.map((block) => {
							const config = BLOCK_TYPE_CONFIG[block.type as BlockType];
							const tokens = block.content ? countTokens(block.content) : 0;

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
										{block.isConditional && (
											<span className="text-muted-foreground text-xs italic">
												(conditional)
											</span>
										)}
										<span className="ml-auto text-muted-foreground text-xs">
											{tokens.toLocaleString()} tokens
										</span>
									</div>
									{block.content ? (
										<pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-sm">
											{block.content}
										</pre>
									) : (
										<p className="text-muted-foreground text-sm italic">
											No content
										</p>
									)}
								</div>
							);
						})}
						{blocks.length === 0 && (
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
