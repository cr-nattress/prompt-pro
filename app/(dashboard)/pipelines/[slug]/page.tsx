"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
	executePipelineAction,
	getPipelineBySlugAction,
	updatePipelineAction,
} from "@/app/(dashboard)/pipelines/actions";
import { PipelineEditor } from "@/components/pipeline/pipeline-editor";
import { PipelineRunResults } from "@/components/pipeline/pipeline-run-results";
import { PipelineToolbar } from "@/components/pipeline/pipeline-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PipelineStep } from "@/lib/pipelines/pipeline-types";
import { showToast } from "@/lib/toast";
import { usePipelineStore } from "@/stores/pipeline-store";

export default function PipelineDetailPage() {
	const params = useParams<{ slug: string }>();
	const [pipelineId, setPipelineId] = useState<string | null>(null);
	const [initialInput, setInitialInput] = useState("");
	const [isSaving, startSaveTransition] = useTransition();

	const {
		steps,
		setSteps,
		isRunning,
		setRunning,
		runResults,
		setRunResults,
		totalTokens,
		totalLatencyMs,
	} = usePipelineStore();

	const loadPipeline = useCallback(async () => {
		const result = await getPipelineBySlugAction(params.slug);
		if (result.success) {
			setPipelineId(result.data.id);
			setSteps((result.data.steps ?? []) as PipelineStep[]);
		} else {
			showToast("error", result.error);
		}
	}, [params.slug, setSteps]);

	useEffect(() => {
		loadPipeline();
	}, [loadPipeline]);

	async function handleRun() {
		if (steps.length === 0) return;
		setRunning(true);
		const result = await executePipelineAction(steps, initialInput);
		setRunning(false);
		if (result.success) {
			setRunResults(
				result.data.results,
				result.data.totalTokens,
				result.data.totalLatencyMs,
			);
		} else {
			showToast("error", result.error);
		}
	}

	function handleSave() {
		if (!pipelineId) return;
		startSaveTransition(async () => {
			const result = await updatePipelineAction(pipelineId, { steps });
			if (result.success) {
				showToast("success", "Pipeline saved");
			} else {
				showToast("error", result.error);
			}
		});
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/pipelines">
						<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
						Pipelines
					</Link>
				</Button>
				<PipelineToolbar
					onRun={handleRun}
					onSave={handleSave}
					isSaving={isSaving}
				/>
			</div>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="pipeline-initial-input"
						className="mb-1 block text-sm font-medium"
					>
						Initial Input
					</label>
					<Input
						id="pipeline-initial-input"
						value={initialInput}
						onChange={(e) => setInitialInput(e.target.value)}
						placeholder="Enter initial input for the pipeline..."
					/>
				</div>

				<PipelineEditor />

				{runResults.length > 0 && (
					<div>
						<h3 className="mb-2 font-medium text-sm">Results</h3>
						<PipelineRunResults
							results={runResults}
							totalTokens={totalTokens}
							totalLatencyMs={totalLatencyMs}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
