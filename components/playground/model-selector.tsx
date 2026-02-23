"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PLAYGROUND_MODELS } from "@/lib/ai/models";

interface ModelSelectorProps {
	value: string;
	onChange: (modelId: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select model" />
			</SelectTrigger>
			<SelectContent>
				{PLAYGROUND_MODELS.map((model) => (
					<SelectItem
						key={model.id}
						value={model.id}
						disabled={!model.available}
					>
						<span className="flex items-center gap-2">
							{model.name}
							{!model.available && (
								<span className="text-muted-foreground text-xs">
									(coming soon)
								</span>
							)}
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
