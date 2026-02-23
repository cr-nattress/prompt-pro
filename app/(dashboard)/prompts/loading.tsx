import { Skeleton } from "@/components/ui/skeleton";

export default function PromptsLoading() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-9 w-28" />
			</div>
			<div className="flex flex-col gap-3">
				{Array.from({ length: 8 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
					<Skeleton key={`prompt-${i}`} className="h-16 w-full rounded-lg" />
				))}
			</div>
		</div>
	);
}
