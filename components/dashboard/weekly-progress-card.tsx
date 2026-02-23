"use client";

import {
	ArrowDown,
	ArrowUp,
	BarChart3,
	Edit3,
	Minus,
	PlusCircle,
	Sparkles,
	TrendingUp,
	Zap,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { WeeklyProgress } from "@/lib/db/schema/weekly-progress";

interface WeeklyProgressCardProps {
	current: WeeklyProgress | null;
	history: WeeklyProgress[];
}

interface ActivityMetric {
	label: string;
	value: number;
	icon: typeof PlusCircle;
	delta: number | null;
}

function getDelta(
	current: number,
	previous: WeeklyProgress | undefined,
	field: keyof WeeklyProgress,
): number | null {
	if (!previous) return null;
	const prev = previous[field];
	if (typeof prev !== "number") return null;
	return current - prev;
}

function DeltaBadge({ delta }: { delta: number | null }) {
	if (delta === null || delta === 0) {
		return (
			<span className="flex items-center gap-0.5 text-muted-foreground text-xs">
				<Minus className="h-3 w-3" />
			</span>
		);
	}
	if (delta > 0) {
		return (
			<span className="flex items-center gap-0.5 text-green-600 text-xs dark:text-green-400">
				<ArrowUp className="h-3 w-3" />+{delta}
			</span>
		);
	}
	return (
		<span className="flex items-center gap-0.5 text-red-600 text-xs dark:text-red-400">
			<ArrowDown className="h-3 w-3" />
			{delta}
		</span>
	);
}

function MiniSparkline({ data }: { data: number[] }) {
	if (data.length < 2) return null;

	const max = Math.max(...data, 1);
	const width = 80;
	const height = 24;
	const padding = 2;

	const points = data.map((v, i) => ({
		x: padding + (i / (data.length - 1)) * (width - 2 * padding),
		y: padding + (1 - v / max) * (height - 2 * padding),
	}));

	const pathD = points
		.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
		.join(" ");

	return (
		<svg
			width={width}
			height={height}
			className="text-primary"
			aria-hidden="true"
		>
			<path
				d={pathD}
				fill="none"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function WeeklyProgressCard({
	current,
	history,
}: WeeklyProgressCardProps) {
	const previousWeek = history[1]; // history[0] is current week

	const metrics: ActivityMetric[] = [
		{
			label: "Prompts Created",
			value: current?.promptsCreated ?? 0,
			icon: PlusCircle,
			delta: current
				? getDelta(current.promptsCreated, previousWeek, "promptsCreated")
				: null,
		},
		{
			label: "Prompts Edited",
			value: current?.promptsEdited ?? 0,
			icon: Edit3,
			delta: current
				? getDelta(current.promptsEdited, previousWeek, "promptsEdited")
				: null,
		},
		{
			label: "Analyses Run",
			value: current?.analysesRun ?? 0,
			icon: Sparkles,
			delta: current
				? getDelta(current.analysesRun, previousWeek, "analysesRun")
				: null,
		},
		{
			label: "Prompts Improved",
			value: current?.promptsImproved ?? 0,
			icon: Zap,
			delta: current
				? getDelta(current.promptsImproved, previousWeek, "promptsImproved")
				: null,
		},
	];

	// Build sparkline data from historical average scores (oldest to newest)
	const scoreHistory = [...history].reverse().map((w) => w.averageScore ?? 0);

	const hasActivity = metrics.some((m) => m.value > 0);

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">This Week&apos;s Progress</CardTitle>
					{scoreHistory.length >= 2 && (
						<div className="flex items-center gap-2">
							<BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
							<MiniSparkline data={scoreHistory} />
						</div>
					)}
				</div>
				<CardDescription>
					{hasActivity
						? "Your activity and progress this week"
						: "Start working on prompts to track your progress"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3">
					{metrics.map((metric) => (
						<div
							key={metric.label}
							className="flex items-center gap-2.5 rounded-md border p-2.5"
						>
							<metric.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
							<div className="min-w-0 flex-1">
								<p className="truncate text-muted-foreground text-xs">
									{metric.label}
								</p>
								<div className="flex items-center gap-1.5">
									<span className="font-semibold text-lg tabular-nums">
										{metric.value}
									</span>
									<DeltaBadge delta={metric.delta} />
								</div>
							</div>
						</div>
					))}
				</div>

				{current && current.averageScore > 0 && (
					<div className="mt-3 flex items-center gap-2 rounded-md bg-muted/30 p-2.5">
						<TrendingUp className="h-4 w-4 shrink-0 text-primary" />
						<span className="text-muted-foreground text-xs">
							Average score this week:
						</span>
						<span className="font-semibold text-sm tabular-nums">
							{current.averageScore}
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
