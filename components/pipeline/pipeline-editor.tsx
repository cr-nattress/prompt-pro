"use client";

import { ArrowDown } from "lucide-react";
import { usePipelineStore } from "@/stores/pipeline-store";
import { PipelineStepCard } from "./pipeline-step-card";

export function PipelineEditor() {
	const { steps, updateStep, removeStep } = usePipelineStore();

	return (
		<div className="space-y-2">
			{steps.map((step, index) => (
				<div key={step.id}>
					<PipelineStepCard
						step={step}
						index={index}
						onUpdate={updateStep}
						onRemove={removeStep}
					/>
					{index < steps.length - 1 && (
						<div className="flex justify-center py-1">
							<ArrowDown className="h-4 w-4 text-muted-foreground" />
						</div>
					)}
				</div>
			))}

			{steps.length === 0 && (
				<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
					Add steps to build your pipeline.
				</div>
			)}
		</div>
	);
}
