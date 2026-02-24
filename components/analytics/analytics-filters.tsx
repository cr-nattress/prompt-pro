"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type Granularity = "day" | "week" | "month";
type DatePreset = "7d" | "30d" | "90d";

interface AnalyticsFiltersProps {
	datePreset: DatePreset;
	granularity: Granularity;
	onDatePresetChange: (preset: DatePreset) => void;
	onGranularityChange: (granularity: Granularity) => void;
}

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
	{ value: "7d", label: "Last 7 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "90d", label: "Last 90 days" },
];

const GRANULARITIES: { value: Granularity; label: string }[] = [
	{ value: "day", label: "Daily" },
	{ value: "week", label: "Weekly" },
	{ value: "month", label: "Monthly" },
];

export function AnalyticsFilters({
	datePreset,
	granularity,
	onDatePresetChange,
	onGranularityChange,
}: AnalyticsFiltersProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="flex gap-1">
				{DATE_PRESETS.map((preset) => (
					<Button
						key={preset.value}
						variant={datePreset === preset.value ? "default" : "outline"}
						size="sm"
						onClick={() => onDatePresetChange(preset.value)}
					>
						{preset.label}
					</Button>
				))}
			</div>
			<Select
				value={granularity}
				onValueChange={(v) => onGranularityChange(v as Granularity)}
			>
				<SelectTrigger className="w-28">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{GRANULARITIES.map((g) => (
						<SelectItem key={g.value} value={g.value}>
							{g.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export function getDateRange(preset: DatePreset): { from: string; to: string } {
	const now = new Date();
	const to = now.toISOString();
	const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
	const from = new Date(
		now.getTime() - days * 24 * 60 * 60 * 1000,
	).toISOString();
	return { from, to };
}
