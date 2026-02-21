import { Skeleton } from "@/components/ui/skeleton";

export function AnalysisSkeleton() {
	return (
		<div className="space-y-6 p-4">
			{/* Overall score */}
			<div className="flex items-center gap-3">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-1.5">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-16" />
				</div>
			</div>

			{/* Radar chart placeholder */}
			<Skeleton className="mx-auto h-[250px] w-[250px] rounded" />

			{/* Score bars */}
			<div className="space-y-3">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
					<div key={i} className="flex items-center gap-3">
						<Skeleton className="h-3 w-28" />
						<Skeleton className="h-2 flex-1" />
						<Skeleton className="h-3 w-8" />
					</div>
				))}
			</div>

			{/* Weaknesses/suggestions */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-12 w-full rounded-md" />
				<Skeleton className="h-12 w-full rounded-md" />
			</div>
		</div>
	);
}
