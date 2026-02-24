"use client";

import { Activity, Clock, Hash, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardsProps {
	totalResolves: number;
	avgLatencyMs: number;
	p95LatencyMs: number;
	uniquePrompts: number;
}

export function SummaryCards({
	totalResolves,
	avgLatencyMs,
	p95LatencyMs,
	uniquePrompts,
}: SummaryCardsProps) {
	const stats = [
		{
			label: "Total Resolves",
			value: totalResolves.toLocaleString(),
			icon: Activity,
		},
		{
			label: "Avg Latency",
			value: avgLatencyMs > 0 ? `${avgLatencyMs}ms` : "—",
			icon: Zap,
		},
		{
			label: "P95 Latency",
			value: p95LatencyMs > 0 ? `${p95LatencyMs}ms` : "—",
			icon: Clock,
		},
		{
			label: "Unique Prompts",
			value: uniquePrompts.toLocaleString(),
			icon: Hash,
		},
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<Card key={stat.label}>
					<CardContent className="flex items-center gap-3 p-4">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
							<stat.icon className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-muted-foreground text-xs">{stat.label}</p>
							<p className="font-semibold text-xl">{stat.value}</p>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
