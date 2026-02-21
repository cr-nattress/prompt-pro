"use client";

import {
	ChevronLeft,
	Copy,
	Eye,
	History,
	Loader2,
	Save,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { useForm } from "react-hook-form";
import {
	createBlueprintAction,
	duplicateBlueprintAction,
	updateBlueprintAction,
} from "@/app/(dashboard)/blueprints/actions";
import {
	createBlueprintVersionAction,
	getBlueprintVersionsAction,
} from "@/app/(dashboard)/blueprints/version-actions";
import { Button } from "@/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VersionPanel } from "@/components/version/version-panel";
import type { App } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";
import type { BlueprintFormValues } from "@/lib/validations/blueprint";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";
import type { BlueprintWithBlocks } from "@/types";
import { BlueprintMetadataForm } from "./blueprint-metadata-form";
import { BlockInspectorPanel } from "./designer/block-inspector-panel";
import { BlockStack } from "./designer/block-stack";
import { ContextPreviewDialog } from "./designer/context-preview-dialog";
import { TokenBudgetBar } from "./designer/token-budget-bar";

interface BlueprintDesignerLayoutProps {
	mode: "create" | "edit";
	blueprint?: BlueprintWithBlocks;
	apps: App[];
	workspaceId: string;
}

export function BlueprintDesignerLayout({
	mode,
	blueprint,
	apps,
	workspaceId,
}: BlueprintDesignerLayoutProps) {
	const router = useRouter();
	const formRef = useRef<ReturnType<
		typeof useForm<BlueprintFormValues>
	> | null>(null);
	const {
		selectedBlockId,
		selectBlock,
		isDirty,
		isSaving,
		lastSavedAt,
		setBlocks,
		setDirty,
		setSaving,
		setLastSavedAt,
		reset,
	} = useBlueprintDesignerStore();
	const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
	const [formValues, setFormValues] = useState<Partial<BlueprintFormValues>>(
		{},
	);
	const [previewOpen, setPreviewOpen] = useState(false);

	// Init store with blocks on mount, reset on unmount
	useEffect(() => {
		if (blueprint?.blocks) {
			setBlocks(blueprint.blocks);
		}
		return () => reset();
	}, [blueprint?.blocks, setBlocks, reset]);

	const handleFormValuesChange = useCallback(
		(values: Partial<BlueprintFormValues>) => {
			setFormValues(values);
			if (mode === "edit") setDirty(true);
		},
		[mode, setDirty],
	);

	// Auto-save in edit mode (metadata only, debounced 3s)
	useEffect(() => {
		if (mode !== "edit" || !isDirty || !blueprint) return;

		if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
		autoSaveTimerRef.current = setTimeout(async () => {
			const { name, slug, targetLlm, totalTokenBudget, description } =
				formValues;
			if (!name) return;

			setSaving(true);
			const result = await updateBlueprintAction(blueprint.id, {
				name,
				slug,
				targetLlm,
				totalTokenBudget,
				description,
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
	}, [mode, isDirty, blueprint, formValues, setSaving, setLastSavedAt]);

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
			const result = await createBlueprintAction(values);
			if (result.success) {
				showToast("success", "Blueprint created");
				router.push(`/blueprints/${result.data.slug}`);
			} else {
				showToast("error", result.error);
				setSaving(false);
			}
		} else if (blueprint) {
			const result = await updateBlueprintAction(blueprint.id, {
				name: values.name,
				slug: values.slug,
				targetLlm: values.targetLlm,
				totalTokenBudget: values.totalTokenBudget,
				description: values.description,
			});

			if (result.success) {
				// Create a blueprint version on explicit save
				await createBlueprintVersionAction(blueprint.id, {
					changeNote: "Saved blueprint",
				});
				showToast("success", "Blueprint saved");
				setLastSavedAt(new Date());
				router.refresh();
			} else {
				showToast("error", result.error);
				setSaving(false);
			}
		}
	}

	async function handleDuplicate() {
		if (!blueprint) return;
		setSaving(true);
		const result = await duplicateBlueprintAction(blueprint.id);
		setSaving(false);
		if (result.success) {
			showToast("success", "Blueprint duplicated");
			router.push(`/blueprints/${result.data.slug}`);
		} else {
			showToast("error", result.error);
		}
	}

	const defaultValues: Partial<BlueprintFormValues> = blueprint
		? {
				name: blueprint.name,
				slug: blueprint.slug,
				appId: blueprint.appId,
				targetLlm: blueprint.targetLlm ?? undefined,
				totalTokenBudget: blueprint.totalTokenBudget ?? undefined,
				description: blueprint.description ?? undefined,
			}
		: {
				appId: apps[0]?.id ?? "",
			};

	const saveStatusLabel = isSaving
		? "Saving..."
		: lastSavedAt
			? "Saved"
			: isDirty
				? "Unsaved changes"
				: null;

	const blueprintId = blueprint?.id ?? null;

	const topBar = (
		<div className="flex items-center justify-between border-b px-4 py-2">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href="/blueprints">
						<ChevronLeft className="h-4 w-4" />
					</Link>
				</Button>
				<span className="font-medium text-sm">
					{mode === "create" ? "New Blueprint" : blueprint?.name}
				</span>
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
							<Link href={`/blueprints/${blueprint?.slug}/versions`}>
								<History className="mr-1.5 h-3.5 w-3.5" />
								History
							</Link>
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => setPreviewOpen(true)}
						>
							<Eye className="mr-1.5 h-3.5 w-3.5" />
							Preview
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

	const rightPanel = selectedBlockId ? (
		<BlockInspectorPanel
			// biome-ignore lint/style/noNonNullAssertion: selectedBlockId implies edit mode where blueprintId exists
			blueprintId={blueprintId!}
			targetLlm={formValues.targetLlm}
		/>
	) : (
		<div className="overflow-auto">
			<BlueprintMetadataForm
				apps={apps}
				workspaceId={workspaceId}
				defaultValues={defaultValues}
				isCreateMode={mode === "create"}
				onValuesChange={handleFormValuesChange}
				formRef={formRef}
			/>
		</div>
	);

	const leftPanel = (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b px-4 py-2">
				<span className="font-medium text-sm">Block Stack</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => selectBlock(null)}
					className="text-xs"
				>
					<Settings className="mr-1.5 h-3.5 w-3.5" />
					Settings
				</Button>
			</div>
			<TokenBudgetBar totalBudget={formValues.totalTokenBudget} />
			<ScrollArea className="flex-1 px-4 pb-4">
				<BlockStack blueprintId={blueprintId} />
			</ScrollArea>
		</div>
	);

	const versionsPanel = blueprint ? (
		<VersionPanel
			entityId={blueprint.id}
			allHref={`/blueprints/${blueprint.slug}/versions`}
			fetchVersions={getBlueprintVersionsAction}
		/>
	) : null;

	return (
		<div className="flex h-[calc(100vh-4rem)] flex-col">
			{topBar}

			{/* Desktop: resizable panels */}
			<div className="hidden flex-1 overflow-hidden md:block">
				<ResizablePanelGroup orientation="horizontal">
					<ResizablePanel defaultSize={40} minSize={25}>
						{leftPanel}
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={60} minSize={30}>
						{rightPanel}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>

			{/* Mobile: tabs */}
			<div className="flex flex-1 flex-col overflow-hidden md:hidden">
				<Tabs defaultValue="stack" className="flex flex-1 flex-col">
					<TabsList className="mx-4 mt-2">
						<TabsTrigger value="stack">Stack</TabsTrigger>
						<TabsTrigger value="inspector">Inspector</TabsTrigger>
						<TabsTrigger value="versions">Versions</TabsTrigger>
					</TabsList>
					<TabsContent value="stack" className="flex-1 overflow-auto">
						{leftPanel}
					</TabsContent>
					<TabsContent value="inspector" className="flex-1 overflow-auto">
						{rightPanel}
					</TabsContent>
					<TabsContent value="versions" className="flex-1 overflow-auto">
						{versionsPanel}
					</TabsContent>
				</Tabs>
			</div>

			{mode === "edit" && (
				<ContextPreviewDialog
					open={previewOpen}
					onOpenChange={setPreviewOpen}
				/>
			)}
		</div>
	);
}
