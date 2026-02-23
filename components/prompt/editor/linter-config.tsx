"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LINT_RULES } from "@/lib/linter/rules";
import { type LinterPreset, useLinterStore } from "@/stores/linter-store";

export function LinterConfig() {
	const {
		enabledRules,
		maxTokens,
		preset,
		toggleRule,
		setMaxTokens,
		applyPreset,
	} = useLinterStore();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon-sm">
					<Settings2 className="h-4 w-4" />
					<span className="sr-only">Linter settings</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="start">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-sm">Linter Rules</h4>
						<Select
							value={preset}
							onValueChange={(v) => applyPreset(v as LinterPreset)}
						>
							<SelectTrigger className="h-7 w-28 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="strict">Strict</SelectItem>
								<SelectItem value="relaxed">Relaxed</SelectItem>
								<SelectItem value="off">Off</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						{LINT_RULES.map((rule) => (
							<div key={rule.id} className="flex items-start gap-2">
								<Checkbox
									id={`rule-${rule.id}`}
									checked={enabledRules.has(rule.id)}
									onCheckedChange={() => toggleRule(rule.id)}
									className="mt-0.5"
								/>
								<div className="flex flex-col gap-0.5">
									<Label
										htmlFor={`rule-${rule.id}`}
										className="cursor-pointer text-xs leading-none"
									>
										{rule.name}
									</Label>
									<span className="text-muted-foreground text-xs">
										{rule.description}
									</span>
								</div>
							</div>
						))}
					</div>

					<div className="flex items-center gap-2 border-t pt-3">
						<Label htmlFor="max-tokens" className="shrink-0 text-xs">
							Max tokens:
						</Label>
						<Input
							id="max-tokens"
							type="number"
							value={maxTokens}
							onChange={(e) => setMaxTokens(Number(e.target.value) || 4000)}
							className="h-7 w-24 text-xs"
							min={100}
							max={128000}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
