"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PipelineStep } from "@/lib/pipelines/pipeline-types";

interface PipelineStepCardProps {
	step: PipelineStep;
	index: number;
	onUpdate: (stepId: string, data: Partial<PipelineStep>) => void;
	onRemove: (stepId: string) => void;
}

export function PipelineStepCard({
	step,
	index,
	onUpdate,
	onRemove,
}: PipelineStepCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-3">
				<GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
				<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
					{index + 1}
				</span>
				<Input
					value={step.label}
					onChange={(e) => onUpdate(step.id, { label: e.target.value })}
					placeholder="Step label"
					className="h-8 flex-1 text-sm"
				/>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 shrink-0"
					onClick={() => onRemove(step.id)}
				>
					<Trash2 className="h-4 w-4 text-muted-foreground" />
				</Button>
			</CardHeader>
			<CardContent className="space-y-3">
				<div>
					<Label className="text-xs">Prompt Template ID</Label>
					<Input
						value={step.promptTemplateId}
						onChange={(e) =>
							onUpdate(step.id, {
								promptTemplateId: e.target.value,
							})
						}
						placeholder="Prompt template ID"
						className="mt-1 h-8 text-xs"
					/>
				</div>
				<div>
					<Label className="text-xs">
						Input Mapping{" "}
						<span className="text-muted-foreground">
							(use {"{{prev.output}}"} for previous step)
						</span>
					</Label>
					<Textarea
						value={step.inputMapping}
						onChange={(e) =>
							onUpdate(step.id, {
								inputMapping: e.target.value,
							})
						}
						placeholder="{{prev.output}}"
						rows={2}
						className="mt-1 text-xs"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
