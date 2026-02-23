"use client";

import {
	ChevronLeft,
	Copy,
	FlaskConical,
	History,
	Loader2,
	Minimize2,
	Save,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { useForm } from "react-hook-form";
import {
	createPromptAction,
	createVersionAction,
	duplicatePromptAction,
	updatePromptAction,
} from "@/app/(dashboard)/prompts/actions";
import {
	analyzePromptAction,
	type CompressResult,
	compressPromptAction,
	enhancePromptAction,
	getLatestAnalysisAction,
} from "@/app/(dashboard)/prompts/analysis-actions";
import {
	type ExpertRewriteResult,
	expertRewriteAction,
} from "@/app/(dashboard)/prompts/expert-actions";
import { getPromptVersionsAction } from "@/app/(dashboard)/prompts/version-actions";
import { AnalysisPanel } from "@/components/prompt/analysis/analysis-panel";
import { CompressDiffDialog } from "@/components/prompt/analysis/compress-diff-dialog";
import { EnhanceDiffDialog } from "@/components/prompt/analysis/enhance-diff-dialog";
import { ExpertViewDialog } from "@/components/prompt/analysis/expert-view-dialog";
import { CoachSidebar } from "@/components/prompt/editor/coach-sidebar";
import { FormatEnforcerPanel } from "@/components/prompt/editor/format-enforcer-panel";
import { LinterConfig } from "@/components/prompt/editor/linter-config";
import { LinterPanel } from "@/components/prompt/editor/linter-panel";
import { TokenCounter } from "@/components/prompt/editor/token-counter";
import { PromptParameters } from "@/components/prompt/prompt-parameters";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/version/status-badge";
import { VersionBadge } from "@/components/version/version-badge";
import { VersionPanel } from "@/components/version/version-panel";
import type { App } from "@/lib/db/schema";
import { type LintViolation, runLinter } from "@/lib/linter/rules";
import { extractParameters } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";
import type { PromptFormValues } from "@/lib/validations/prompt";
import { useAnalysisStore } from "@/stores/analysis-store";
import { useEditorStore } from "@/stores/editor-store";
import { useLinterStore } from "@/stores/linter-store";
import type { PromptWithVersion } from "@/types";
import { PromptEditor } from "./editor";
import { PromptMetadataForm } from "./prompt-metadata-form";

interface PromptEditorLayoutProps {
	mode: "create" | "edit";
	prompt?: PromptWithVersion;
	apps: App[];
	workspaceId: string;
}

export function PromptEditorLayout({
	mode,
	prompt,
	apps,
	workspaceId,
}: PromptEditorLayoutProps) {
	const router = useRouter();
	const formRef = useRef<ReturnType<typeof useForm<PromptFormValues>> | null>(
		null,
	);
	const {
		isDirty,
		isSaving,
		lastSavedAt,
		setDirty,
		setSaving,
		setLastSavedAt,
		setDetectedParameters,
		reset,
	} = useEditorStore();
	const {
		analysis,
		isAnalyzing,
		isEnhancing,
		enhancedText,
		changesSummary,
		error: analysisError,
		setAnalysis,
		setAnalyzing,
		setEnhancing,
		setEnhancedText,
		setError: setAnalysisError,
		reset: resetAnalysis,
	} = useAnalysisStore();
	const { enabledRules, maxTokens: linterMaxTokens } = useLinterStore();
	const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
	const [templateText, setTemplateText] = useState(
		prompt?.latestVersion?.templateText ?? "",
	);
	const [formValues, setFormValues] = useState<Partial<PromptFormValues>>({});
	const [enhanceDiffOpen, setEnhanceDiffOpen] = useState(false);
	const [compressDiffOpen, setCompressDiffOpen] = useState(false);
	const [compressResult, setCompressResult] = useState<CompressResult | null>(
		null,
	);
	const [isCompressing, setIsCompressing] = useState(false);
	const [isExpertRewriting, setIsExpertRewriting] = useState(false);
	const [expertResult, setExpertResult] = useState<ExpertRewriteResult | null>(
		null,
	);
	const [expertViewOpen, setExpertViewOpen] = useState(false);
	const [showAmbiguities, setShowAmbiguities] = useState(false);
	const [ghostTextEnabled, setGhostTextEnabled] = useState(false);
	const [lintViolations, setLintViolations] = useState<LintViolation[]>([]);
	const lintTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
	const initialTemplateRef = useRef(templateText);

	// Reset editor store on mount/unmount
	useEffect(() => {
		reset();
		resetAnalysis();
		return () => {
			reset();
			resetAnalysis();
		};
	}, [reset, resetAnalysis]);

	// Load cached analysis on mount
	useEffect(() => {
		if (mode !== "edit" || !prompt) return;
		getLatestAnalysisAction(prompt.id).then((result) => {
			if (result.success && result.data) {
				setAnalysis(result.data);
			}
		});
	}, [mode, prompt, setAnalysis]);

	// Update detected parameters when template text changes
	useEffect(() => {
		const params = extractParameters(templateText);
		setDetectedParameters(params);
	}, [templateText, setDetectedParameters]);

	// Debounced linter — runs 1s after text changes or config changes
	useEffect(() => {
		if (lintTimerRef.current) clearTimeout(lintTimerRef.current);
		lintTimerRef.current = setTimeout(() => {
			if (templateText.trim() && enabledRules.size > 0) {
				setLintViolations(
					runLinter(templateText, enabledRules, {
						maxTokens: linterMaxTokens,
					}),
				);
			} else {
				setLintViolations([]);
			}
		}, 1000);
		return () => {
			if (lintTimerRef.current) clearTimeout(lintTimerRef.current);
		};
	}, [templateText, enabledRules, linterMaxTokens]);

	const handleTemplateChange = useCallback(
		(value: string) => {
			setTemplateText(value);
			setDirty(true);
		},
		[setDirty],
	);

	const handleFormValuesChange = useCallback(
		(values: Partial<PromptFormValues>) => {
			setFormValues(values);
			if (mode === "edit") setDirty(true);
		},
		[mode, setDirty],
	);

	// Auto-save in edit mode (metadata only, debounced 3s)
	useEffect(() => {
		if (mode !== "edit" || !isDirty || !prompt) return;

		if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
		autoSaveTimerRef.current = setTimeout(async () => {
			const { name, slug, purpose, description, tags } = formValues;
			if (!name) return;

			setSaving(true);
			const result = await updatePromptAction(prompt.id, {
				name,
				slug,
				purpose,
				description,
				tags,
			});
			if (result.success) {
				setLastSavedAt(new Date());
			} else {
				showToast("error", result.error);
				setSaving(false);
			}
		}, 3000);

		return () => {
			if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
		};
	}, [mode, isDirty, prompt, formValues, setSaving, setLastSavedAt]);

	async function handleSave() {
		const form = formRef.current;
		if (!form) return;

		const isValid = await form.trigger();
		if (!isValid) {
			showToast("warning", "Please fix form errors before saving");
			return;
		}

		const values = form.getValues();
		setSaving(true);

		// Cancel pending auto-save
		if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

		if (mode === "create") {
			const result = await createPromptAction({
				...values,
				templateText,
			});
			if (result.success) {
				showToast("success", "Prompt created");
				router.push(`/prompts/${result.data.slug}`);
			} else {
				showToast("error", result.error);
				setSaving(false);
			}
		} else if (prompt) {
			// Save metadata
			const metaResult = await updatePromptAction(prompt.id, {
				name: values.name,
				slug: values.slug,
				purpose: values.purpose,
				description: values.description,
				tags: values.tags,
			});

			if (!metaResult.success) {
				showToast("error", metaResult.error);
				setSaving(false);
				return;
			}

			// Save new version if template text changed
			if (templateText !== initialTemplateRef.current) {
				const versionData: {
					templateText: string;
					llm?: string;
					changeNote?: string;
				} = {
					templateText,
				};
				if (values.llm) versionData.llm = values.llm;
				if (values.changeNote) versionData.changeNote = values.changeNote;

				const versionResult = await createVersionAction(prompt.id, versionData);
				if (versionResult.success) {
					showToast("success", `Version ${versionResult.data.version} saved`);
					initialTemplateRef.current = templateText;
				} else {
					showToast("error", versionResult.error);
					setSaving(false);
					return;
				}
			} else {
				showToast("success", "Prompt saved");
			}

			setLastSavedAt(new Date());
			router.refresh();
		}
	}

	async function handleDuplicate() {
		if (!prompt) return;
		setSaving(true);
		const result = await duplicatePromptAction(prompt.id);
		setSaving(false);
		if (result.success) {
			showToast("success", "Prompt duplicated");
			router.push(`/prompts/${result.data.slug}`);
		} else {
			showToast("error", result.error);
		}
	}

	async function handleAnalyze() {
		if (!prompt) return;
		setAnalyzing(true);
		setAnalysisError(null);
		const metadata: { name?: string; purpose?: string; description?: string } =
			{
				name: formValues.name ?? prompt.name,
			};
		const purpose = formValues.purpose ?? prompt.purpose;
		if (purpose) metadata.purpose = purpose;
		const description = formValues.description ?? prompt.description;
		if (description) metadata.description = description;
		const result = await analyzePromptAction(prompt.id, templateText, metadata);
		setAnalyzing(false);
		if (result.success) {
			setAnalysis(result.data);
		} else {
			setAnalysisError(result.error);
		}
	}

	async function handleEnhance() {
		if (!prompt) return;
		setEnhancing(true);
		setAnalysisError(null);
		const result = await enhancePromptAction(
			prompt.id,
			templateText,
			analysis?.weaknesses ?? undefined,
			analysis?.suggestions ?? undefined,
		);
		setEnhancing(false);
		if (result.success) {
			setEnhancedText(result.data.enhancedText, result.data.changesSummary);
			setEnhanceDiffOpen(true);
		} else {
			setAnalysisError(result.error);
		}
	}

	function handleApplyEnhancement() {
		if (enhancedText) {
			setTemplateText(enhancedText);
			setDirty(true);
			setEnhancedText(null, []);
			showToast("success", "Enhanced prompt applied");
		}
	}

	async function handleCompress() {
		if (!templateText.trim()) return;
		setIsCompressing(true);
		const result = await compressPromptAction(templateText);
		setIsCompressing(false);
		if (result.success) {
			setCompressResult(result.data);
			setCompressDiffOpen(true);
		} else {
			showToast("error", result.error);
		}
	}

	function handleApplyCompression() {
		if (compressResult) {
			setTemplateText(compressResult.compressedText);
			setDirty(true);
			showToast(
				"success",
				`Prompt compressed (saved ~${compressResult.savings} tokens)`,
			);
			setCompressResult(null);
		}
	}

	async function handleExpertRewrite() {
		if (!templateText.trim()) return;
		setIsExpertRewriting(true);
		setAnalysisError(null);
		const result = await expertRewriteAction(templateText);
		setIsExpertRewriting(false);
		if (result.success) {
			setExpertResult(result.data);
			setExpertViewOpen(true);
		} else {
			setAnalysisError(result.error);
		}
	}

	function handleApplyExpertRewrite() {
		if (expertResult) {
			setTemplateText(expertResult.expertText);
			setDirty(true);
			setExpertResult(null);
			showToast("success", "Expert rewrite applied");
		}
	}

	const detectedParams = extractParameters(templateText);
	const defaultValues: Partial<PromptFormValues> = prompt
		? {
				name: prompt.name,
				slug: prompt.slug,
				appId: prompt.appId,
				purpose: prompt.purpose ?? undefined,
				description: prompt.description ?? undefined,
				tags: prompt.tags ?? [],
				templateText: prompt.latestVersion?.templateText ?? "",
				llm: prompt.latestVersion?.llm ?? undefined,
			}
		: {
				appId: apps[0]?.id ?? "",
				tags: [],
			};

	const saveStatusLabel = isSaving
		? "Saving..."
		: lastSavedAt
			? "Saved"
			: isDirty
				? "Unsaved changes"
				: null;

	const topBar = (
		<div className="flex items-center justify-between border-b px-4 py-2">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href="/prompts">
						<ChevronLeft className="h-4 w-4" />
					</Link>
				</Button>
				<span className="font-medium text-sm">
					{mode === "create" ? "New Prompt" : prompt?.name}
				</span>
				{prompt?.latestVersion && (
					<>
						<VersionBadge
							version={prompt.latestVersion.version}
							className="text-xs"
						/>
						{prompt.latestVersion.status !== "draft" && (
							<StatusBadge status={prompt.latestVersion.status} />
						)}
					</>
				)}
			</div>
			<div className="flex items-center gap-3">
				{saveStatusLabel && (
					<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
						{isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
						{saveStatusLabel}
					</span>
				)}
				{mode === "edit" && (
					<>
						<Button size="sm" variant="ghost" asChild>
							<Link href={`/prompts/${prompt?.slug}/versions`}>
								<History className="mr-1.5 h-3.5 w-3.5" />
								History
							</Link>
						</Button>
						<Button size="sm" variant="outline" asChild>
							<Link
								href={`/playground?promptId=${prompt?.id}&versionId=${prompt?.latestVersion?.id}`}
							>
								<FlaskConical className="mr-1.5 h-3.5 w-3.5" />
								Test Run
							</Link>
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={handleCompress}
							disabled={isSaving || isCompressing}
						>
							{isCompressing ? (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							) : (
								<Minimize2 className="mr-1.5 h-3.5 w-3.5" />
							)}
							Compress
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={handleDuplicate}
							disabled={isSaving}
						>
							<Copy className="mr-1.5 h-3.5 w-3.5" />
							Duplicate
						</Button>
					</>
				)}
				<Button size="sm" onClick={handleSave} disabled={isSaving}>
					<Save className="mr-1.5 h-3.5 w-3.5" />
					{mode === "create" ? "Create" : "Save"}
				</Button>
			</div>
		</div>
	);

	const editorPanel = (
		<div className="flex h-full flex-col">
			<div className="flex-1 overflow-auto p-4">
				<PromptEditor
					value={templateText}
					onChange={handleTemplateChange}
					parameters={detectedParams}
					showAmbiguities={showAmbiguities}
					ghostTextEnabled={ghostTextEnabled}
				/>
			</div>
			<div className="flex items-center justify-between border-t px-4 py-2">
				<div className="flex items-center gap-4">
					<PromptParameters parameters={detectedParams} />
					<div className="flex items-center gap-1.5">
						<Switch
							id="ambiguity-toggle"
							checked={showAmbiguities}
							onCheckedChange={setShowAmbiguities}
							className="scale-75"
						/>
						<Label
							htmlFor="ambiguity-toggle"
							className="cursor-pointer text-muted-foreground text-xs"
						>
							Ambiguities
						</Label>
					</div>
					<div className="flex items-center gap-1.5">
						<Switch
							id="ghost-text-toggle"
							checked={ghostTextEnabled}
							onCheckedChange={setGhostTextEnabled}
							className="scale-75"
						/>
						<Label
							htmlFor="ghost-text-toggle"
							className="cursor-pointer text-muted-foreground text-xs"
						>
							<Sparkles className="mr-1 inline-block h-3 w-3" />
							AI Suggest
						</Label>
					</div>
				</div>
				<TokenCounter text={templateText} model={formValues.llm ?? "gpt-4o"} />
			</div>
		</div>
	);

	const metadataPanel = (
		<div className="overflow-auto">
			<PromptMetadataForm
				apps={apps}
				workspaceId={workspaceId}
				defaultValues={defaultValues}
				isCreateMode={mode === "create"}
				onValuesChange={handleFormValuesChange}
				formRef={formRef}
			/>
		</div>
	);

	const analysisPanel = (
		<AnalysisPanel
			analysis={analysis}
			isAnalyzing={isAnalyzing}
			isEnhancing={isEnhancing}
			isExpertRewriting={isExpertRewriting}
			error={analysisError}
			onAnalyze={handleAnalyze}
			onEnhance={handleEnhance}
			onExpertRewrite={handleExpertRewrite}
			onAppendSuggestion={(snippet) => {
				setTemplateText((prev) => prev + snippet);
				setDirty(true);
			}}
		/>
	);

	const versionsPanel = prompt ? (
		<VersionPanel
			entityId={prompt.id}
			allHref={`/prompts/${prompt.slug}/versions`}
			fetchVersions={getPromptVersionsAction}
		/>
	) : null;

	const handleInsertSnippet = useCallback(
		(snippet: string) => {
			setTemplateText((prev) => prev + snippet);
			setDirty(true);
		},
		[setDirty],
	);

	const linterPanel = (
		<div className="flex flex-col gap-4 p-4">
			<div>
				<div className="mb-3 flex items-center justify-between">
					<span className="font-medium text-sm">Prompt Linter</span>
					<LinterConfig />
				</div>
				<LinterPanel violations={lintViolations} />
			</div>
			<div className="border-t pt-4">
				<span className="mb-3 block font-medium text-sm">Output Format</span>
				<FormatEnforcerPanel
					promptText={templateText}
					onInsertSnippet={handleInsertSnippet}
				/>
			</div>
		</div>
	);

	const coachPanel = (
		<CoachSidebar
			promptText={templateText}
			targetModel={formValues.llm}
			onInsertSnippet={handleInsertSnippet}
		/>
	);

	const rightPanelTabbed = (
		<Tabs defaultValue="details" className="flex h-full flex-col">
			<TabsList className="mx-4 mt-2 shrink-0">
				<TabsTrigger value="details">Details</TabsTrigger>
				<TabsTrigger value="linter">
					Linter
					{lintViolations.length > 0 && (
						<span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 font-medium text-amber-600 text-xs dark:text-amber-400">
							{lintViolations.length}
						</span>
					)}
				</TabsTrigger>
				<TabsTrigger value="coach">Coach</TabsTrigger>
				{mode === "edit" && (
					<TabsTrigger value="analysis">Analysis</TabsTrigger>
				)}
			</TabsList>
			<TabsContent value="details" className="flex-1 overflow-auto">
				{metadataPanel}
			</TabsContent>
			<TabsContent value="linter" className="flex-1 overflow-auto">
				{linterPanel}
			</TabsContent>
			<TabsContent value="coach" className="flex-1 overflow-auto">
				{coachPanel}
			</TabsContent>
			{mode === "edit" && (
				<TabsContent value="analysis" className="flex-1 overflow-auto">
					{analysisPanel}
				</TabsContent>
			)}
		</Tabs>
	);

	return (
		<div className="flex h-[calc(100vh-4rem)] flex-col">
			{topBar}

			{/* Desktop: resizable panels */}
			<div className="hidden flex-1 overflow-hidden md:block">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize={60} minSize={30}>
						{editorPanel}
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={40} minSize={25}>
						{rightPanelTabbed}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>

			{/* Mobile: tabs */}
			<div className="flex flex-1 flex-col overflow-hidden md:hidden">
				<Tabs defaultValue="edit" className="flex flex-1 flex-col">
					<TabsList className="mx-4 mt-2">
						<TabsTrigger value="edit">Edit</TabsTrigger>
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="linter">Linter</TabsTrigger>
						<TabsTrigger value="coach">Coach</TabsTrigger>
						{mode === "edit" && (
							<TabsTrigger value="analysis">Analysis</TabsTrigger>
						)}
						<TabsTrigger value="versions">Versions</TabsTrigger>
					</TabsList>
					<TabsContent value="edit" className="flex-1 overflow-auto">
						{editorPanel}
					</TabsContent>
					<TabsContent value="details" className="flex-1 overflow-auto">
						{metadataPanel}
					</TabsContent>
					<TabsContent value="linter" className="flex-1 overflow-auto">
						{linterPanel}
					</TabsContent>
					<TabsContent value="coach" className="flex-1 overflow-auto">
						{coachPanel}
					</TabsContent>
					{mode === "edit" && (
						<TabsContent value="analysis" className="flex-1 overflow-auto">
							{analysisPanel}
						</TabsContent>
					)}
					<TabsContent value="versions" className="flex-1 overflow-auto">
						{versionsPanel}
					</TabsContent>
				</Tabs>
			</div>

			{/* Enhance diff dialog */}
			<EnhanceDiffDialog
				open={enhanceDiffOpen}
				onOpenChange={setEnhanceDiffOpen}
				originalText={templateText}
				enhancedText={enhancedText ?? ""}
				changesSummary={changesSummary}
				onApply={handleApplyEnhancement}
			/>

			{/* Compress diff dialog */}
			<CompressDiffDialog
				open={compressDiffOpen}
				onOpenChange={setCompressDiffOpen}
				originalText={templateText}
				compressedText={compressResult?.compressedText ?? ""}
				originalTokens={compressResult?.originalTokens ?? 0}
				compressedTokens={compressResult?.compressedTokens ?? 0}
				savings={compressResult?.savings ?? 0}
				onApply={handleApplyCompression}
			/>

			{/* Expert view dialog */}
			{expertResult && (
				<ExpertViewDialog
					open={expertViewOpen}
					onOpenChange={setExpertViewOpen}
					originalText={templateText}
					result={expertResult}
					onApply={handleApplyExpertRewrite}
				/>
			)}
		</div>
	);
}
