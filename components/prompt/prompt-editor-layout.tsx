"use client";

import { ChevronLeft, Copy, Loader2, Save } from "lucide-react";
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
import { TokenCounter } from "@/components/prompt/editor/token-counter";
import { PromptParameters } from "@/components/prompt/prompt-parameters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { App } from "@/lib/db/schema";
import { extractParameters } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";
import type { PromptFormValues } from "@/lib/validations/prompt";
import { useEditorStore } from "@/stores/editor-store";
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
	const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
	const [templateText, setTemplateText] = useState(
		prompt?.latestVersion?.templateText ?? "",
	);
	const [formValues, setFormValues] = useState<Partial<PromptFormValues>>({});
	const initialTemplateRef = useRef(templateText);

	// Reset editor store on mount/unmount
	useEffect(() => {
		reset();
		return () => reset();
	}, [reset]);

	// Update detected parameters when template text changes
	useEffect(() => {
		const params = extractParameters(templateText);
		setDetectedParameters(params);
	}, [templateText, setDetectedParameters]);

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
					<Badge variant="outline" className="text-xs">
						v{prompt.latestVersion.version}
					</Badge>
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
					<Button
						size="sm"
						variant="outline"
						onClick={handleDuplicate}
						disabled={isSaving}
					>
						<Copy className="mr-1.5 h-3.5 w-3.5" />
						Duplicate
					</Button>
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
				/>
			</div>
			<div className="flex items-center justify-between border-t px-4 py-2">
				<PromptParameters parameters={detectedParams} />
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
						{metadataPanel}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>

			{/* Mobile: tabs */}
			<div className="flex flex-1 flex-col overflow-hidden md:hidden">
				<Tabs defaultValue="edit" className="flex flex-1 flex-col">
					<TabsList className="mx-4 mt-2">
						<TabsTrigger value="edit">Edit</TabsTrigger>
						<TabsTrigger value="details">Details</TabsTrigger>
					</TabsList>
					<TabsContent value="edit" className="flex-1 overflow-auto">
						{editorPanel}
					</TabsContent>
					<TabsContent value="details" className="flex-1 overflow-auto">
						{metadataPanel}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
