"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const RadarChartInner = dynamic(() => import("./radar-chart-inner"), {
	ssr: false,
	loading: () => <Skeleton className="mx-auto h-[250px] w-[250px] rounded" />,
});

export interface RadarDataPoint {
	dimension: string;
	score: number;
	fullMark: 100;
}

interface AnalysisRadarChartProps {
	data: RadarDataPoint[];
}

export function AnalysisRadarChart({ data }: AnalysisRadarChartProps) {
	return <RadarChartInner data={data} />;
}
