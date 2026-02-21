"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { App } from "@/lib/db/schema";
import { slugify } from "@/lib/prompt-utils";
import {
	type PromptFormValues,
	promptFormSchema,
} from "@/lib/validations/prompt";
import { AppSelector } from "./app-selector";

const LLM_OPTIONS = [
	"gpt-4o",
	"gpt-4o-mini",
	"gpt-4-turbo",
	"gpt-3.5-turbo",
	"claude-3-5-sonnet",
	"claude-3-opus",
	"claude-3-haiku",
];

const PURPOSE_OPTIONS = ["system", "user", "assistant", "function", "tool"];

interface PromptMetadataFormProps {
	apps: App[];
	workspaceId: string;
	defaultValues?: Partial<PromptFormValues>;
	isCreateMode: boolean;
	onValuesChange: (values: Partial<PromptFormValues>) => void;
	formRef?: React.RefObject<ReturnType<
		typeof useForm<PromptFormValues>
	> | null>;
}

export function PromptMetadataForm({
	apps,
	workspaceId,
	defaultValues,
	isCreateMode,
	onValuesChange,
	formRef,
}: PromptMetadataFormProps) {
	const [tagInput, setTagInput] = useState("");

	const form = useForm<PromptFormValues>({
		resolver: zodResolver(promptFormSchema),
		defaultValues: {
			name: "",
			slug: "",
			appId: apps[0]?.id ?? "",
			purpose: undefined,
			description: undefined,
			tags: [],
			templateText: "",
			llm: undefined,
			changeNote: undefined,
			...defaultValues,
		},
	});

	// Expose form ref to parent
	useEffect(() => {
		if (formRef) {
			(formRef as React.MutableRefObject<typeof form | null>).current = form;
		}
	}, [form, formRef]);

	// Auto-generate slug from name in create mode
	const watchedName = form.watch("name");
	useEffect(() => {
		if (isCreateMode && watchedName) {
			form.setValue("slug", slugify(watchedName));
		}
	}, [isCreateMode, watchedName, form]);

	// Notify parent of value changes
	const watchedValues = form.watch();
	const handleValuesChange = useCallback(() => {
		onValuesChange(watchedValues);
	}, [watchedValues, onValuesChange]);

	useEffect(() => {
		handleValuesChange();
	}, [handleValuesChange]);

	function addTag(tag: string) {
		const trimmed = tag.trim().toLowerCase();
		if (!trimmed) return;
		const current = form.getValues("tags") ?? [];
		if (!current.includes(trimmed)) {
			form.setValue("tags", [...current, trimmed]);
		}
		setTagInput("");
	}

	function removeTag(tag: string) {
		const current = form.getValues("tags") ?? [];
		form.setValue(
			"tags",
			current.filter((t) => t !== tag),
		);
	}

	return (
		<Form {...form}>
			<form className="flex flex-col gap-4 p-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="My prompt" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input
									placeholder="my-prompt"
									{...field}
									disabled={!isCreateMode}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="appId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>App</FormLabel>
							<FormControl>
								<AppSelector
									apps={apps}
									workspaceId={workspaceId}
									value={field.value}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="llm"
					render={({ field }) => (
						<FormItem>
							<FormLabel>LLM</FormLabel>
							<Select
								value={field.value ?? ""}
								onValueChange={(v) => field.onChange(v || undefined)}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select model" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{LLM_OPTIONS.map((llm) => (
										<SelectItem key={llm} value={llm}>
											{llm}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="purpose"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Purpose</FormLabel>
							<Select
								value={field.value ?? ""}
								onValueChange={(v) => field.onChange(v || undefined)}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select purpose" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{PURPOSE_OPTIONS.map((purpose) => (
										<SelectItem key={purpose} value={purpose}>
											{purpose}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-col gap-1.5">
					<FormLabel>Tags</FormLabel>
					<div className="flex items-center gap-2">
						<Input
							placeholder="Add tag..."
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addTag(tagInput);
								}
							}}
						/>
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={() => addTag(tagInput)}
						>
							Add
						</Button>
					</div>
					<div className="flex flex-wrap gap-1">
						{(form.watch("tags") ?? []).map((tag) => (
							<Badge key={tag} variant="secondary" className="gap-1">
								{tag}
								<button
									type="button"
									onClick={() => removeTag(tag)}
									className="rounded-full hover:bg-accent"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="What does this prompt do?"
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="changeNote"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Change note</FormLabel>
							<FormControl>
								<Input
									placeholder="What changed?"
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
