"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const RadarChartInner = dynamic(() => import("./blueprint-radar-chart-inner"), {
	ssr: false,
	loading: () => <Skeleton className="mx-auto h-[250px] w-[250px] rounded" />,
});

export interface BlueprintRadarDataPoint {
	dimension: string;
	score: number;
	fullMark: 100;
}

interface BlueprintRadarChartProps {
	data: BlueprintRadarDataPoint[];
}

export function BlueprintRadarChart({ data }: BlueprintRadarChartProps) {
	return <RadarChartInner data={data} />;
}
