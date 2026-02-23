"use client";

import { Clock, Coins, Hash, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getModelDefinition } from "@/lib/ai/models";

interface ResponsePanelProps {
	text: string;
	isStreaming: boolean;
	inputTokens?: number | undefined;
	outputTokens?: number | undefined;
	latencyMs?: number | undefined;
	modelId?: string | undefined;
	label?: string | undefined;
}

export function ResponsePanel({
	text,
	isStreaming,
	inputTokens,
	outputTokens,
	latencyMs,
	modelId,
	label,
}: ResponsePanelProps) {
	const model = modelId ? getModelDefinition(modelId) : undefined;
	const estimatedCost =
		model && inputTokens !== undefined && outputTokens !== undefined
			? (inputTokens / 1_000_000) * model.inputCostPer1M +
				(outputTokens / 1_000_000) * model.outputCostPer1M
			: undefined;

	return (
		<Card className="flex h-full flex-col">
			<CardHeader className="py-3">
				<CardTitle className="flex items-center gap-2 text-sm">
					{isStreaming && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
					{label ?? "Response"}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-3 pt-0">
				<ScrollArea className="min-h-[200px] flex-1 rounded-md border bg-muted/30 p-4">
					{text ? (
						<pre className="whitespace-pre-wrap break-words font-mono text-sm">
							{text}
							{isStreaming && (
								<span className="animate-pulse text-muted-foreground">|</span>
							)}
						</pre>
					) : (
						<p className="text-muted-foreground text-sm">
							{isStreaming
								? "Waiting for response..."
								: "Run a prompt to see the response here."}
						</p>
					)}
				</ScrollArea>
				{(inputTokens !== undefined || latencyMs !== undefined) && (
					<div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
						{inputTokens !== undefined && (
							<span className="flex items-center gap-1">
								<Hash className="h-3 w-3" />
								{inputTokens} in / {outputTokens ?? 0} out tokens
							</span>
						)}
						{latencyMs !== undefined && (
							<span className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								{(latencyMs / 1000).toFixed(1)}s
							</span>
						)}
						{estimatedCost !== undefined && (
							<span className="flex items-center gap-1">
								<Coins className="h-3 w-3" />$
								{estimatedCost < 0.01
									? estimatedCost.toFixed(4)
									: estimatedCost.toFixed(2)}
							</span>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
