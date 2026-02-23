"use client";

import { Columns2, Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPromptVersionTextAction } from "@/app/(dashboard)/playground/actions";
import { ModelSelector } from "@/components/playground/model-selector";
import { ParameterForm } from "@/components/playground/parameter-form";
import { PromptSelector } from "@/components/playground/prompt-selector";
import { ResponsePanel } from "@/components/playground/response-panel";
import { RunHistory } from "@/components/playground/run-history";
import { RunSettings } from "@/components/playground/run-settings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { interpolateTemplate } from "@/lib/resolve/template-interpolator";
import {
	type PlaygroundRunResult,
	usePlaygroundStore,
} from "@/stores/playground-store";

const PARAM_REGEX = /\{\{([^}]+)\}\}/g;

function detectParameters(text: string): string[] {
	const params = new Set<string>();
	const regex = new RegExp(PARAM_REGEX.source, "g");
	let match = regex.exec(text);
	while (match !== null) {
		params.add(match[1]?.trim() ?? "");
		match = regex.exec(text);
	}
	return [...params].filter(Boolean);
}

async function streamRun(
	body: Record<string, unknown>,
	onChunk: (text: string) => void,
	onDone: (runId: string) => void,
	onError: (error: string) => void,
	signal: AbortSignal,
) {
	try {
		const response = await fetch("/api/playground/run", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
			signal,
		});

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			onError(typeof data.error === "string" ? data.error : "Request failed");
			return;
		}

		const runId = response.headers.get("X-Run-Id") ?? "";
		const reader = response.body?.getReader();
		if (!reader) {
			onError("No response stream");
			return;
		}

		const decoder = new TextDecoder();
		let done = false;
		while (!done) {
			const result = await reader.read();
			done = result.done;
			if (result.value) {
				onChunk(decoder.decode(result.value, { stream: !done }));
			}
		}

		onDone(runId);
	} catch (err) {
		if (signal.aborted) return;
		onError(err instanceof Error ? err.message : "Unknown error");
	}
}

interface PlaygroundViewProps {
	initialPromptId?: string | undefined;
	initialVersionId?: string | undefined;
}

export function PlaygroundView({
	initialPromptId,
	initialVersionId,
}: PlaygroundViewProps) {
	const store = usePlaygroundStore();
	const [selectedRun, setSelectedRun] = useState<PlaygroundRunResult | null>(
		null,
	);
	const [responseA, setResponseA] = useState("");
	const [responseB, setResponseB] = useState("");
	const [isRunningA, setIsRunningA] = useState(false);
	const [isRunningB, setIsRunningB] = useState(false);
	const [errorA, setErrorA] = useState<string | null>(null);
	const abortControllerA = useRef<AbortController | null>(null);
	const abortControllerB = useRef<AbortController | null>(null);
	const runStartTime = useRef(0);

	// Load initial prompt if provided
	useEffect(() => {
		if (initialPromptId && initialVersionId) {
			store.setPromptId(initialPromptId);
			store.setPromptVersionId(initialVersionId);
			store.setSourceType("prompt");
			getPromptVersionTextAction(initialVersionId).then((result) => {
				if (result.success) {
					store.setRawText(result.data.templateText);
				}
			});
		}
		// Only run on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		initialPromptId,
		initialVersionId,
		store.setPromptId,
		store.setPromptVersionId,
		store.setRawText,
		store.setSourceType,
	]);

	const getResolvedText = useCallback(() => {
		const { resolved } = interpolateTemplate(store.rawText, store.parameters);
		return resolved;
	}, [store.rawText, store.parameters]);

	const detectedParams = detectParameters(store.rawText);

	function handleRun() {
		const resolved = getResolvedText();
		if (!resolved.trim()) return;

		runStartTime.current = Date.now();
		setSelectedRun(null);
		setErrorA(null);

		const bodyBase = {
			resolvedText: resolved,
			temperature: store.temperature,
			maxTokens: store.maxTokens,
			promptId: store.promptId,
			promptVersionId: store.promptVersionId,
			blueprintId: store.blueprintId,
			parameters: store.parameters,
		};

		// Run A
		setResponseA("");
		setIsRunningA(true);
		abortControllerA.current = new AbortController();
		streamRun(
			{ ...bodyBase, modelId: store.modelId },
			(chunk) => setResponseA((prev) => prev + chunk),
			(_runId) => {
				setIsRunningA(false);
				// Add to local history (we don't refetch from DB for now)
				setResponseA((final) => {
					store.addRun({
						id: crypto.randomUUID(),
						resolvedText: resolved,
						parameters: { ...store.parameters },
						modelId: store.modelId,
						responseText: final,
						inputTokens: 0,
						outputTokens: 0,
						latencyMs: Date.now() - runStartTime.current,
						status: "completed",
						createdAt: new Date(),
					});
					return final;
				});
			},
			(error) => {
				setIsRunningA(false);
				setErrorA(error);
			},
			abortControllerA.current.signal,
		);

		// Run B if A/B mode
		if (store.abMode) {
			setResponseB("");
			setIsRunningB(true);
			abortControllerB.current = new AbortController();
			streamRun(
				{ ...bodyBase, modelId: store.abModelId },
				(chunk) => setResponseB((prev) => prev + chunk),
				() => setIsRunningB(false),
				() => setIsRunningB(false),
				abortControllerB.current.signal,
			);
		}
	}

	function handleStop() {
		abortControllerA.current?.abort();
		abortControllerB.current?.abort();
		setIsRunningA(false);
		setIsRunningB(false);
	}

	function handleSelectPrompt(prompt: {
		id: string;
		latestVersionId: string | null;
		latestTemplateText: string | null;
	}) {
		store.setSourceType("prompt");
		store.setPromptId(prompt.id);
		store.setPromptVersionId(prompt.latestVersionId);
		store.setBlueprintId(null);
		if (prompt.latestTemplateText) {
			store.setRawText(prompt.latestTemplateText);
		}
	}

	function handleSelectBlueprint(blueprint: { id: string }) {
		store.setSourceType("blueprint");
		store.setBlueprintId(blueprint.id);
		store.setPromptId(null);
		store.setPromptVersionId(null);
	}

	function handleSelectRaw() {
		store.setSourceType("raw");
		store.setPromptId(null);
		store.setPromptVersionId(null);
		store.setBlueprintId(null);
	}

	function handleSelectHistoryRun(run: PlaygroundRunResult) {
		setSelectedRun(run);
	}

	const isRunning = isRunningA || isRunningB;
	const displayText = selectedRun ? selectedRun.responseText : responseA;
	const displayMeta = selectedRun
		? {
				inputTokens: selectedRun.inputTokens,
				outputTokens: selectedRun.outputTokens,
				latencyMs: selectedRun.latencyMs,
				modelId: selectedRun.modelId,
			}
		: undefined;

	return (
		<div className="flex h-[calc(100vh-7rem)] flex-col gap-4 md:flex-row">
			{/* Left: Config panel */}
			<div className="flex w-full flex-col gap-4 overflow-y-auto md:w-80 md:shrink-0">
				<div className="flex flex-col gap-3">
					<Label className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
						Source
					</Label>
					<PromptSelector
						onSelectPrompt={handleSelectPrompt}
						onSelectBlueprint={handleSelectBlueprint}
						onSelectRaw={handleSelectRaw}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label
						htmlFor="prompt-input"
						className="font-medium text-xs text-muted-foreground uppercase tracking-wider"
					>
						Prompt
					</Label>
					<Textarea
						id="prompt-input"
						placeholder="Enter your prompt text here... Use {{param}} for parameters."
						className="min-h-[120px] font-mono text-sm"
						value={store.rawText}
						onChange={(e) => store.setRawText(e.target.value)}
					/>
				</div>

				<ParameterForm
					parameters={detectedParams}
					values={store.parameters}
					onValueChange={store.setParameter}
				/>

				<Separator />

				<div className="flex flex-col gap-3">
					<Label className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
						Model
					</Label>
					<ModelSelector value={store.modelId} onChange={store.setModelId} />
				</div>

				<RunSettings
					temperature={store.temperature}
					maxTokens={store.maxTokens}
					onTemperatureChange={store.setTemperature}
					onMaxTokensChange={store.setMaxTokens}
				/>

				<Separator />

				<div className="flex items-center gap-2">
					<Toggle
						pressed={store.abMode}
						onPressedChange={store.setAbMode}
						size="sm"
						aria-label="Toggle A/B comparison"
					>
						<Columns2 className="mr-1.5 h-3.5 w-3.5" />
						A/B Compare
					</Toggle>
				</div>

				{store.abMode && (
					<div className="flex flex-col gap-2">
						<Label className="text-sm">Model B</Label>
						<ModelSelector
							value={store.abModelId}
							onChange={store.setAbModelId}
						/>
					</div>
				)}

				<div className="flex gap-2">
					{isRunning ? (
						<Button
							onClick={handleStop}
							variant="destructive"
							className="flex-1"
						>
							<Square className="mr-1.5 h-3.5 w-3.5" />
							Stop
						</Button>
					) : (
						<Button
							onClick={handleRun}
							className="flex-1"
							disabled={!store.rawText.trim()}
						>
							<Play className="mr-1.5 h-3.5 w-3.5" />
							Run
						</Button>
					)}
				</div>

				{errorA && <p className="text-destructive text-sm">{errorA}</p>}

				<Separator />

				<div className="flex flex-col gap-2">
					<Label className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
						History
					</Label>
					<RunHistory runs={store.runs} onSelect={handleSelectHistoryRun} />
				</div>
			</div>

			{/* Right: Response area */}
			<div className="flex min-h-0 flex-1 gap-4">
				<div className="flex-1">
					<ResponsePanel
						text={displayText}
						isStreaming={isRunningA && !selectedRun}
						inputTokens={displayMeta?.inputTokens}
						outputTokens={displayMeta?.outputTokens}
						latencyMs={displayMeta?.latencyMs}
						modelId={displayMeta?.modelId ?? store.modelId}
						label={store.abMode ? "Model A" : undefined}
					/>
				</div>
				{store.abMode && (
					<div className="flex-1">
						<ResponsePanel
							text={responseB}
							isStreaming={isRunningB}
							modelId={store.abModelId}
							label="Model B"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
