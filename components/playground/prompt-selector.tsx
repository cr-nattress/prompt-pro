"use client";

import { useEffect, useState } from "react";
import { getPlaygroundSourcesAction } from "@/app/(dashboard)/playground/actions";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PromptOption {
	id: string;
	name: string;
	slug: string;
	latestVersionId: string | null;
	latestTemplateText: string | null;
	parameterSchema: unknown;
}

interface BlueprintOption {
	id: string;
	name: string;
	slug: string;
}

interface PromptSelectorProps {
	onSelectPrompt: (prompt: PromptOption) => void;
	onSelectBlueprint: (blueprint: BlueprintOption) => void;
	onSelectRaw: () => void;
}

export function PromptSelector({
	onSelectPrompt,
	onSelectBlueprint,
	onSelectRaw,
}: PromptSelectorProps) {
	const [prompts, setPrompts] = useState<PromptOption[]>([]);
	const [blueprints, setBlueprints] = useState<BlueprintOption[]>([]);
	const [value, setValue] = useState("raw");

	useEffect(() => {
		getPlaygroundSourcesAction().then((result) => {
			if (result.success) {
				setPrompts(result.data.prompts);
				setBlueprints(result.data.blueprints);
			}
		});
	}, []);

	function handleChange(newValue: string) {
		setValue(newValue);
		if (newValue === "raw") {
			onSelectRaw();
			return;
		}
		if (newValue.startsWith("prompt:")) {
			const promptId = newValue.slice(7);
			const prompt = prompts.find((p) => p.id === promptId);
			if (prompt) onSelectPrompt(prompt);
			return;
		}
		if (newValue.startsWith("blueprint:")) {
			const blueprintId = newValue.slice(10);
			const blueprint = blueprints.find((b) => b.id === blueprintId);
			if (blueprint) onSelectBlueprint(blueprint);
		}
	}

	return (
		<Select value={value} onValueChange={handleChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select source" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="raw">Paste raw prompt</SelectItem>
				{prompts.length > 0 && (
					<SelectGroup>
						<SelectLabel>Prompts</SelectLabel>
						{prompts.map((p) => (
							<SelectItem key={p.id} value={`prompt:${p.id}`}>
								{p.name}
							</SelectItem>
						))}
					</SelectGroup>
				)}
				{blueprints.length > 0 && (
					<SelectGroup>
						<SelectLabel>Blueprints</SelectLabel>
						{blueprints.map((b) => (
							<SelectItem key={b.id} value={`blueprint:${b.id}`}>
								{b.name}
							</SelectItem>
						))}
					</SelectGroup>
				)}
			</SelectContent>
		</Select>
	);
}
