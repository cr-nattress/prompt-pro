"use client";

import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";
import type { RadarDataPoint } from "./analysis-radar-chart";

interface RadarChartInnerProps {
	data: RadarDataPoint[];
}

export default function RadarChartInner({ data }: RadarChartInnerProps) {
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
					stroke="var(--color-chart-1)"
					fill="var(--color-chart-1)"
					fillOpacity={0.2}
					strokeWidth={2}
				/>
			</RadarChart>
		</ResponsiveContainer>
	);
}
