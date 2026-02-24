"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopPromptsChartProps {
	data: {
		promptId: string;
		promptName: string;
		promptSlug: string;
		count: number;
	}[];
}

export function TopPromptsChart({ data }: TopPromptsChartProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Most Resolved Prompts</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground text-sm">
						No resolve data for this period
					</p>
				) : (
					<ResponsiveContainer
						width="100%"
						height={Math.max(200, data.length * 40)}
					>
						<BarChart data={data} layout="vertical">
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="var(--color-border)"
								horizontal={false}
							/>
							<XAxis
								type="number"
								tick={{
									fontSize: 11,
									fill: "var(--color-muted-foreground)",
								}}
								allowDecimals={false}
							/>
							<YAxis
								type="category"
								dataKey="promptName"
								width={150}
								tick={{
									fontSize: 11,
									fill: "var(--color-muted-foreground)",
								}}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: "6px",
									fontSize: "12px",
								}}
							/>
							<Bar
								dataKey="count"
								name="Resolves"
								fill="var(--color-primary)"
								radius={[0, 4, 4, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
