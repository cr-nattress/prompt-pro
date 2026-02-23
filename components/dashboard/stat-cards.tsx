import { Boxes, ScrollText, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/db/queries/dashboard-stats";

interface StatCardsProps {
	stats: DashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
	const cards = [
		{
			title: "Total Prompts",
			value: stats.totalPrompts.toLocaleString(),
			icon: ScrollText,
		},
		{
			title: "Total Blueprints",
			value: stats.totalBlueprints.toLocaleString(),
			icon: Boxes,
		},
		{
			title: "Average Score",
			value:
				stats.averageScore !== null ? stats.averageScore.toFixed(1) : "N/A",
			icon: Sparkles,
		},
		{
			title: "Resolves This Month",
			value: stats.resolvesThisMonth.toLocaleString(),
			icon: Zap,
		},
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => (
				<Card key={card.title}>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="font-medium text-muted-foreground text-sm">
							{card.title}
						</CardTitle>
						<card.icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="font-bold text-2xl">{card.value}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
