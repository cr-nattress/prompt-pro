"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { updateBlockAction } from "@/app/(dashboard)/blueprints/actions";
import { createBlockVersionAction } from "@/app/(dashboard)/blueprints/version-actions";
import { PromptEditor } from "@/components/prompt/editor";
import { TokenCounter } from "@/components/prompt/editor/token-counter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	BLOCK_TYPE_CONFIG,
	BLOCK_TYPES,
	type BlockType,
} from "@/lib/blueprint-utils";
import { extractParameters } from "@/lib/prompt-utils";
import { showToast } from "@/lib/toast";
import { useBlueprintDesignerStore } from "@/stores/blueprint-designer-store";

interface BlockInspectorPanelProps {
	blueprintId: string;
	targetLlm?: string | undefined;
}

export function BlockInspectorPanel({
	blueprintId: _blueprintId,
	targetLlm,
}: BlockInspectorPanelProps) {
	const { blocks, selectedBlockId, updateBlockInStore } =
		useBlueprintDesignerStore();
	const block = blocks.find((b) => b.id === selectedBlockId);
	const autoSaveRef = useRef<ReturnType<typeof setTimeout>>(null);
	const initialContentRef = useRef(block?.content ?? "");

	const [content, setContent] = useState(block?.content ?? "");
	const [name, setName] = useState(block?.name ?? "");
	const [description, setDescription] = useState(block?.description ?? "");
	const [type, setType] = useState(block?.type ?? "system");
	const [isRequired, setIsRequired] = useState(block?.isRequired ?? true);
	const [isConditional, setIsConditional] = useState(
		block?.isConditional ?? false,
	);
	const [condition, setCondition] = useState(block?.condition ?? "");

	// Reset form when selected block changes
	const blockId = block?.id;
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset only when block selection changes
	useEffect(() => {
		if (block) {
			setContent(block.content ?? "");
			setName(block.name);
			setDescription(block.description ?? "");
			setType(block.type);
			setIsRequired(block.isRequired);
			setIsConditional(block.isConditional);
			setCondition(block.condition ?? "");
			initialContentRef.current = block.content ?? "";
		}
	}, [blockId]);

	type BlockUpdate = {
		name?: string | undefined;
		slug?: string | undefined;
		type?:
			| "system"
			| "knowledge"
			| "examples"
			| "tools"
			| "history"
			| "task"
			| undefined;
		description?: string | undefined;
		content?: string | undefined;
		isRequired?: boolean | undefined;
		isConditional?: boolean | undefined;
		condition?: string | undefined;
	};

	const saveBlock = useCallback(
		(data: BlockUpdate) => {
			if (!selectedBlockId) return;

			// Update store immediately
			updateBlockInStore(selectedBlockId, data);

			// Debounced save to server
			if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
			autoSaveRef.current = setTimeout(async () => {
				const result = await updateBlockAction(selectedBlockId, data);
				if (!result.success) {
					showToast("error", result.error);
					return;
				}

				// Create a block version if content changed
				if (
					data.content !== undefined &&
					data.content !== initialContentRef.current
				) {
					await createBlockVersionAction(selectedBlockId, {
						content: data.content,
						changeNote: "Content updated",
					});
					initialContentRef.current = data.content ?? "";
				}
			}, 3000);
		},
		[selectedBlockId, updateBlockInStore],
	);

	const handleContentChange = useCallback(
		(value: string) => {
			setContent(value);
			saveBlock({ content: value });
		},
		[saveBlock],
	);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
		};
	}, []);

	if (!block) {
		return (
			<div className="flex h-full items-center justify-center text-muted-foreground">
				Select a block to edit
			</div>
		);
	}

	const config = BLOCK_TYPE_CONFIG[block.type as BlockType];
	const detectedParams = extractParameters(content);

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="flex items-center gap-2 border-b px-4 py-2">
				{config && (
					<span
						className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-xs"
						style={{
							backgroundColor: `color-mix(in oklch, var(${config.cssVar}) 15%, transparent)`,
							color: `var(${config.cssVar})`,
						}}
					>
						<config.icon className="h-3 w-3" />
						{config.label}
					</span>
				)}
				<span className="font-medium text-sm">{block.name}</span>
			</div>

			{/* Content editor */}
			<div className="flex-1 overflow-auto p-4">
				<PromptEditor
					value={content}
					onChange={handleContentChange}
					parameters={detectedParams}
				/>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between border-t px-4 py-2">
				{detectedParams.length > 0 && (
					<span className="text-muted-foreground text-xs">
						{detectedParams.length} parameter
						{detectedParams.length !== 1 ? "s" : ""}
					</span>
				)}
				<TokenCounter text={content} model={targetLlm ?? "gpt-4o"} />
			</div>

			{/* Settings */}
			<div className="flex flex-col gap-3 border-t p-4">
				<h4 className="font-medium text-sm">Settings</h4>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="block-name">Name</Label>
					<Input
						id="block-name"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							saveBlock({ name: e.target.value });
						}}
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="block-type">Type</Label>
					<Select
						value={type}
						onValueChange={(v) => {
							setType(v as BlockType);
							saveBlock({
								type: v as BlockType,
							});
						}}
					>
						<SelectTrigger id="block-type">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{BLOCK_TYPES.map((t) => {
								const c = BLOCK_TYPE_CONFIG[t];
								return (
									<SelectItem key={t} value={t}>
										<div className="flex items-center gap-2">
											<c.icon className="h-3.5 w-3.5" />
											{c.label}
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="block-description">Description</Label>
					<Textarea
						id="block-description"
						value={description}
						onChange={(e) => {
							setDescription(e.target.value);
							saveBlock({ description: e.target.value });
						}}
						placeholder="What does this block contain?"
					/>
				</div>

				<div className="flex items-center justify-between">
					<Label htmlFor="block-required">Required</Label>
					<Switch
						id="block-required"
						checked={isRequired}
						onCheckedChange={(checked) => {
							setIsRequired(checked);
							saveBlock({ isRequired: checked });
						}}
					/>
				</div>

				<div className="flex items-center justify-between">
					<Label htmlFor="block-conditional">Conditional</Label>
					<Switch
						id="block-conditional"
						checked={isConditional}
						onCheckedChange={(checked) => {
							setIsConditional(checked);
							saveBlock({ isConditional: checked });
						}}
					/>
				</div>

				{isConditional && (
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="block-condition">Condition</Label>
						<Input
							id="block-condition"
							value={condition}
							onChange={(e) => {
								setCondition(e.target.value);
								saveBlock({ condition: e.target.value });
							}}
							placeholder="e.g. hasHistory === true"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
