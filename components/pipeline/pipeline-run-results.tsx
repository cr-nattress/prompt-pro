"use client";

import { AlertCircle, CheckCircle2, Clock, Coins } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { PipelineStepResult } from "@/lib/pipelines/pipeline-types";
import { cn } from "@/lib/utils";

interface PipelineRunResultsProps {
	results: PipelineStepResult[];
	totalTokens: number;
	totalLatencyMs: number;
}

export function PipelineRunResults({
	results,
	totalTokens,
	totalLatencyMs,
}: PipelineRunResultsProps) {
	if (results.length === 0) return null;

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-4 text-sm">
				<span className="flex items-center gap-1 text-muted-foreground">
					<Coins className="h-3.5 w-3.5" />
					{totalTokens.toLocaleString()} tokens
				</span>
				<span className="flex items-center gap-1 text-muted-foreground">
					<Clock className="h-3.5 w-3.5" />
					{(totalLatencyMs / 1000).toFixed(1)}s
				</span>
			</div>

			<Accordion type="multiple" className="space-y-2">
				{results.map((result, i) => (
					<AccordionItem
						key={result.stepId}
						value={result.stepId}
						className="rounded-md border"
					>
						<AccordionTrigger className="px-4 py-2 text-sm hover:no-underline">
							<div className="flex items-center gap-2">
								{result.status === "success" ? (
									<CheckCircle2 className="h-4 w-4 text-green-500" />
								) : (
									<AlertCircle className="h-4 w-4 text-red-500" />
								)}
								<span>Step {i + 1}</span>
								<Badge
									variant="outline"
									className={cn(
										"text-xs",
										result.status === "error" &&
											"border-red-500/30 text-red-600",
									)}
								>
									{result.tokens} tokens
								</Badge>
								<span className="text-muted-foreground text-xs">
									{result.latencyMs}ms
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="px-4 pb-3">
							<div className="space-y-2">
								{result.error && (
									<div className="rounded bg-red-500/10 p-2 text-red-600 text-xs dark:text-red-400">
										{result.error}
									</div>
								)}
								<div>
									<p className="mb-1 font-medium text-muted-foreground text-xs">
										Output:
									</p>
									<pre className="max-h-40 overflow-auto rounded bg-muted p-2 text-xs whitespace-pre-wrap">
										{result.output || "(empty)"}
									</pre>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
