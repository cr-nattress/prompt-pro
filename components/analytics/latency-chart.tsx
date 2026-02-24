"use client";

import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LatencyChartProps {
	data: {
		date: string;
		p50: number;
		p95: number;
		p99: number;
		count: number;
	}[];
}

function formatDate(dateStr: string) {
	const d = new Date(dateStr);
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function LatencyChart({ data }: LatencyChartProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Resolve Latency</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground text-sm">
						No latency data for this period
					</p>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={data}>
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
								label={{
									value: "ms",
									angle: -90,
									position: "insideLeft",
									style: {
										fontSize: 11,
										fill: "var(--color-muted-foreground)",
									},
								}}
							/>
							<Tooltip
								labelFormatter={(label) => formatDate(String(label))}
								formatter={(value) => [`${value}ms`]}
								contentStyle={{
									backgroundColor: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: "6px",
									fontSize: "12px",
								}}
							/>
							<Legend wrapperStyle={{ fontSize: "12px" }} />
							<Line
								type="monotone"
								dataKey="p50"
								name="P50"
								stroke="var(--color-primary)"
								strokeWidth={2}
								dot={false}
							/>
							<Line
								type="monotone"
								dataKey="p95"
								name="P95"
								stroke="var(--color-chart-2)"
								strokeWidth={2}
								dot={false}
								strokeDasharray="4 2"
							/>
							<Line
								type="monotone"
								dataKey="p99"
								name="P99"
								stroke="var(--color-destructive)"
								strokeWidth={2}
								dot={false}
								strokeDasharray="2 2"
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
