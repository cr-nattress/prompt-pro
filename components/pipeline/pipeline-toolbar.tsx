"use client";

import { Loader2, Play, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PipelineStep } from "@/lib/pipelines/pipeline-types";
import { usePipelineStore } from "@/stores/pipeline-store";

interface PipelineToolbarProps {
	onRun: () => void;
	onSave: () => void;
	isSaving?: boolean | undefined;
}

export function PipelineToolbar({
	onRun,
	onSave,
	isSaving = false,
}: PipelineToolbarProps) {
	const { steps, isRunning, addStep } = usePipelineStore();

	function handleAddStep() {
		const newStep: PipelineStep = {
			id: crypto.randomUUID(),
			promptTemplateId: "",
			promptVersionId: "",
			promptName: "",
			label: `Step ${steps.length + 1}`,
			inputMapping: "{{prev.output}}",
			position: steps.length,
		};
		addStep(newStep);
	}

	return (
		<div className="flex items-center gap-2">
			<Button variant="outline" size="sm" onClick={handleAddStep}>
				<Plus className="mr-2 h-4 w-4" />
				Add Step
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={onSave}
				disabled={isSaving || steps.length === 0}
			>
				{isSaving ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Save className="mr-2 h-4 w-4" />
				)}
				Save
			</Button>
			<Button
				size="sm"
				onClick={onRun}
				disabled={isRunning || steps.length === 0}
			>
				{isRunning ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Play className="mr-2 h-4 w-4" />
				)}
				Run
			</Button>
		</div>
	);
}
