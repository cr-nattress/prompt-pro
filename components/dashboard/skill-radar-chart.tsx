"use client";

import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
} from "recharts";

interface SkillDataPoint {
	skill: string;
	value: number;
}

interface SkillRadarChartProps {
	data: SkillDataPoint[];
}

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
	return (
		<ResponsiveContainer width="100%" height={220}>
			<RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
				<PolarGrid stroke="var(--color-border)" />
				<PolarAngleAxis
					dataKey="skill"
					tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
				/>
				<PolarRadiusAxis
					angle={90}
					domain={[0, 5]}
					tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
					tickCount={6}
				/>
				<Radar
					name="Prompt"
					dataKey="value"
					stroke="var(--color-chart-1)"
					fill="var(--color-chart-1)"
					fillOpacity={0.2}
					strokeWidth={2}
				/>
			</RadarChart>
		</ResponsiveContainer>
	);
}
