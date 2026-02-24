"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageHeatmapProps {
	data: { dayOfWeek: number; hour: number; count: number }[];
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
	22, 23,
] as const;

function getIntensity(count: number, maxCount: number): string {
	if (maxCount === 0 || count === 0) return "var(--color-muted)";
	const ratio = count / maxCount;
	if (ratio > 0.75) return "oklch(0.65 0.22 145)";
	if (ratio > 0.5) return "oklch(0.72 0.17 145)";
	if (ratio > 0.25) return "oklch(0.80 0.12 145)";
	return "oklch(0.88 0.07 145)";
}

export function UsageHeatmap({ data }: UsageHeatmapProps) {
	const grid = new Map<string, number>();
	let maxCount = 0;
	for (const item of data) {
		const key = `${item.dayOfWeek}-${item.hour}`;
		grid.set(key, item.count);
		if (item.count > maxCount) maxCount = item.count;
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Usage Heatmap</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground text-sm">
						No usage data for this period
					</p>
				) : (
					<div className="overflow-x-auto">
						<div
							className="inline-grid gap-0.5"
							style={{ gridTemplateColumns: `48px repeat(24, 1fr)` }}
						>
							{/* Hour headers */}
							<div />
							{HOURS.map((h) => (
								<div
									key={`h-${h}`}
									className="text-center text-muted-foreground text-xs"
								>
									{h % 4 === 0 ? `${h}` : ""}
								</div>
							))}

							{/* Day rows */}
							{DAY_LABELS.map((day, dayIdx) => (
								<>
									<div
										key={`label-${day}`}
										className="flex items-center text-muted-foreground text-xs"
									>
										{day}
									</div>
									{HOURS.map((hour) => {
										const cellKey = `${dayIdx}-${hour}`;
										const cellCount = grid.get(cellKey) ?? 0;
										return (
											<div
												key={cellKey}
												className="h-5 min-w-5 rounded-sm"
												style={{
													backgroundColor: getIntensity(cellCount, maxCount),
												}}
												title={`${day} ${hour}:00 — ${cellCount} resolves`}
											/>
										);
									})}
								</>
							))}
						</div>

						{/* Legend */}
						<div className="mt-3 flex items-center gap-1 text-muted-foreground text-xs">
							<span>Less</span>
							{[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
								<div
									key={ratio}
									className="h-3 w-3 rounded-sm"
									style={{
										backgroundColor: getIntensity(ratio * maxCount, maxCount),
									}}
								/>
							))}
							<span>More</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
