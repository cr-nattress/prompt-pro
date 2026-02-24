"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResolveVolumeChartProps {
	data: { date: string; count: number }[];
}

function formatDate(dateStr: string) {
	const d = new Date(dateStr);
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ResolveVolumeChart({ data }: ResolveVolumeChartProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Resolve Volume</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground text-sm">
						No resolve data for this period
					</p>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={data}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="var(--color-border)"
							/>
							<XAxis
								dataKey="date"
								tickFormatter={formatDate}
								tick={{
									fontSize: 11,
									fill: "var(--color-muted-foreground)",
								}}
							/>
							<YAxis
								tick={{
									fontSize: 11,
									fill: "var(--color-muted-foreground)",
								}}
								allowDecimals={false}
							/>
							<Tooltip
								labelFormatter={(label) => formatDate(String(label))}
								contentStyle={{
									backgroundColor: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: "6px",
									fontSize: "12px",
								}}
							/>
							<Area
								type="monotone"
								dataKey="count"
								name="Resolves"
								stroke="var(--color-primary)"
								fill="var(--color-primary)"
								fillOpacity={0.1}
								strokeWidth={2}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
