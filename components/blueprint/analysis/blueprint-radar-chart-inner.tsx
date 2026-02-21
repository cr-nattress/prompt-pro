"use client";

import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";
import type { BlueprintRadarDataPoint } from "./blueprint-radar-chart";

interface BlueprintRadarChartInnerProps {
	data: BlueprintRadarDataPoint[];
}

export default function BlueprintRadarChartInner({
	data,
}: BlueprintRadarChartInnerProps) {
	return (
		<ResponsiveContainer width="100%" height={250}>
			<RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
				<PolarGrid stroke="var(--color-border)" />
				<PolarAngleAxis
					dataKey="dimension"
					tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
				/>
				<PolarRadiusAxis
					angle={90}
					domain={[0, 100]}
					tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
					tickCount={5}
				/>
				<Radar
					name="Score"
					dataKey="score"
					stroke="var(--color-chart-2)"
					fill="var(--color-chart-2)"
					fillOpacity={0.2}
					strokeWidth={2}
				/>
			</RadarChart>
		</ResponsiveContainer>
	);
}
