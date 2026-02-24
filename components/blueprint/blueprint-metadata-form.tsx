"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AppSelector } from "@/components/prompt/app-selector";
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
	type BlueprintFormValues,
	blueprintFormSchema,
} from "@/lib/validations/blueprint";

const LLM_OPTIONS = [
	"claude-sonnet-4.6",
	"claude-opus-4.6",
	"claude-haiku-4.5",
	"gpt-4o",
	"gpt-4o-mini",
	"gpt-4-turbo",
];

interface BlueprintMetadataFormProps {
	apps: App[];
	workspaceId: string;
	defaultValues?: Partial<BlueprintFormValues>;
	isCreateMode: boolean;
	onValuesChange: (values: Partial<BlueprintFormValues>) => void;
	formRef?: React.RefObject<ReturnType<
		typeof useForm<BlueprintFormValues>
	> | null>;
}

export function BlueprintMetadataForm({
	apps,
	workspaceId,
	defaultValues,
	isCreateMode,
	onValuesChange,
	formRef,
}: BlueprintMetadataFormProps) {
	const form = useForm<BlueprintFormValues>({
		// biome-ignore lint/suspicious/noExplicitAny: zodResolver incompatible with exactOptionalPropertyTypes
		resolver: zodResolver(blueprintFormSchema) as any,
		defaultValues: {
			name: "",
			slug: "",
			appId: apps[0]?.id ?? "",
			targetLlm: undefined,
			totalTokenBudget: undefined,
			description: undefined,
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

	// Notify parent of value changes via subscription (avoids re-render loop)
	useEffect(() => {
		const subscription = form.watch((values) => {
			onValuesChange(values as Partial<BlueprintFormValues>);
		});
		return () => subscription.unsubscribe();
	}, [form, onValuesChange]);

	return (
		<Form {...form}>
			<form className="flex flex-col gap-4 p-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="My blueprint" {...field} />
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
									placeholder="my-blueprint"
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
					name="targetLlm"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Target LLM</FormLabel>
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
					name="totalTokenBudget"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total Token Budget</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="e.g. 8000"
									{...field}
									value={field.value ?? ""}
									onChange={(e) => {
										const val = e.target.value;
										field.onChange(val ? Number(val) : undefined);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="What is this blueprint for?"
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
