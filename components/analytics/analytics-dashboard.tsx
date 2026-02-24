"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
	getAnalyticsSummaryAction,
	getHeatmapAction,
	getLatencyAction,
	getResolvesByAppAction,
	getResolveVolumeAction,
	getTopPromptsAction,
} from "@/app/(dashboard)/analytics/actions";
import { showToast } from "@/lib/toast";
import { AnalyticsFilters, getDateRange } from "./analytics-filters";
import { ExportButton } from "./export-button";
import { LatencyChart } from "./latency-chart";
import { ResolveVolumeChart } from "./resolve-volume-chart";
import { SummaryCards } from "./summary-cards";
import { TopPromptsChart } from "./top-prompts-chart";
import { UsageHeatmap } from "./usage-heatmap";

type DatePreset = "7d" | "30d" | "90d";
type Granularity = "day" | "week" | "month";

interface AnalyticsData {
	summary: {
		totalResolves: number;
		avgLatencyMs: number;
		p95LatencyMs: number;
		uniquePrompts: number;
	};
	volume: { date: string; count: number }[];
	topPrompts: {
		promptId: string;
		promptName: string;
		promptSlug: string;
		count: number;
	}[];
	resolvesByApp: { appId: string; appName: string; count: number }[];
	latency: {
		date: string;
		p50: number;
		p95: number;
		p99: number;
		count: number;
	}[];
	heatmap: { dayOfWeek: number; hour: number; count: number }[];
}

const EMPTY_DATA: AnalyticsData = {
	summary: {
		totalResolves: 0,
		avgLatencyMs: 0,
		p95LatencyMs: 0,
		uniquePrompts: 0,
	},
	volume: [],
	topPrompts: [],
	resolvesByApp: [],
	latency: [],
	heatmap: [],
};

export function AnalyticsDashboard() {
	const [datePreset, setDatePreset] = useState<DatePreset>("30d");
	const [granularity, setGranularity] = useState<Granularity>("day");
	const [data, setData] = useState<AnalyticsData>(EMPTY_DATA);
	const [isPending, startTransition] = useTransition();

	const loadData = useCallback((preset: DatePreset, gran: Granularity) => {
		startTransition(async () => {
			const range = getDateRange(preset);
			const filters = { ...range, granularity: gran };

			const [
				summaryResult,
				volumeResult,
				topResult,
				appResult,
				latencyResult,
				heatmapResult,
			] = await Promise.all([
				getAnalyticsSummaryAction(range),
				getResolveVolumeAction(filters),
				getTopPromptsAction(filters),
				getResolvesByAppAction(filters),
				getLatencyAction(filters),
				getHeatmapAction(filters),
			]);

			const newData: AnalyticsData = { ...EMPTY_DATA };

			if (summaryResult.success) newData.summary = summaryResult.data;
			else showToast("error", summaryResult.error);

			if (volumeResult.success) newData.volume = volumeResult.data;
			if (topResult.success) newData.topPrompts = topResult.data;
			if (appResult.success) newData.resolvesByApp = appResult.data;
			if (latencyResult.success) newData.latency = latencyResult.data;
			if (heatmapResult.success) newData.heatmap = heatmapResult.data;

			setData(newData);
		});
	}, []);

	useEffect(() => {
		loadData(datePreset, granularity);
	}, [datePreset, granularity, loadData]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-semibold text-2xl">Analytics</h1>
					<p className="text-muted-foreground text-sm">
						Monitor how your prompts are used via the API
					</p>
				</div>
				<div className="flex items-center gap-2">
					{isPending && (
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					)}
					<AnalyticsFilters
						datePreset={datePreset}
						granularity={granularity}
						onDatePresetChange={setDatePreset}
						onGranularityChange={setGranularity}
					/>
					<ExportButton
						datePreset={datePreset}
						{...getDateRange(datePreset)}
						granularity={granularity}
					/>
				</div>
			</div>

			<SummaryCards {...data.summary} />

			<ResolveVolumeChart data={data.volume} />

			<div className="grid gap-6 lg:grid-cols-2">
				<TopPromptsChart data={data.topPrompts} />
				<UsageHeatmap data={data.heatmap} />
			</div>

			<LatencyChart data={data.latency} />
		</div>
	);
}
