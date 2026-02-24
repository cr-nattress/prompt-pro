"use client";

import { AlertTriangle, Eye, EyeOff, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type AttentionSegment,
	computeAttentionHeatmap,
	findLowAttentionInstructions,
} from "@/lib/attention/attention-model";

interface AttentionHeatmapProps {
	text: string;
}

export function AttentionHeatmap({ text }: AttentionHeatmapProps) {
	const [enabled, setEnabled] = useState(false);

	const segments = useMemo(
		() => (enabled ? computeAttentionHeatmap(text) : []),
		[text, enabled],
	);

	const lowAttentionInstructions = useMemo(
		() => (enabled ? findLowAttentionInstructions(text, segments) : []),
		[text, segments, enabled],
	);

	if (!enabled) {
		return (
			<Button variant="outline" size="sm" onClick={() => setEnabled(true)}>
				<Eye className="mr-2 h-4 w-4" />
				Show Attention
			</Button>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={() => setEnabled(false)}>
					<EyeOff className="mr-2 h-4 w-4" />
					Hide Attention
				</Button>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Info className="h-4 w-4 text-muted-foreground" />
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							<p className="text-xs">
								Based on the &quot;lost in the middle&quot; phenomenon: LLMs pay
								more attention to the beginning and end of prompts. Content in
								the middle may receive less focus. Blue = high attention, Red =
								low attention.
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Heatmap overlay */}
			<div className="rounded-md border p-4 font-mono text-sm leading-relaxed">
				{renderHeatmap(text, segments)}
			</div>

			{/* Low attention instructions warning */}
			{lowAttentionInstructions.length > 0 && (
				<div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
					<div className="flex items-start gap-2">
						<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
						<div>
							<p className="font-medium text-amber-800 text-sm dark:text-amber-200">
								Instructions at risk
							</p>
							<p className="mt-1 text-amber-700 text-xs dark:text-amber-300">
								These sections contain instruction keywords but are in
								low-attention zones. Consider moving them to the beginning or
								end of your prompt.
							</p>
							<ul className="mt-2 space-y-1 text-amber-800 text-xs dark:text-amber-200">
								{lowAttentionInstructions.map((item) => (
									<li
										key={`${item.segment.startIndex}-${item.segment.endIndex}`}
									>
										Keywords found:{" "}
										<span className="font-medium">
											{item.keywords.join(", ")}
										</span>{" "}
										(attention: {item.segment.attentionScore})
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function renderHeatmap(text: string, segments: AttentionSegment[]) {
	if (segments.length === 0) return text;

	const parts: { text: string; offset: number; color?: string | undefined }[] =
		[];
	let lastEnd = 0;

	for (const seg of segments) {
		if (seg.startIndex > lastEnd) {
			parts.push({
				text: text.slice(lastEnd, seg.startIndex),
				offset: lastEnd,
			});
		}
		parts.push({
			text: text.slice(seg.startIndex, seg.endIndex),
			offset: seg.startIndex,
			color: seg.color,
		});
		lastEnd = seg.endIndex;
	}

	if (lastEnd < text.length) {
		parts.push({ text: text.slice(lastEnd), offset: lastEnd });
	}

	return parts.map((part) =>
		part.color ? (
			<span
				key={part.offset}
				style={{ backgroundColor: part.color, padding: "1px 0" }}
			>
				{part.text}
			</span>
		) : (
			<span key={part.offset}>{part.text}</span>
		),
	);
}
