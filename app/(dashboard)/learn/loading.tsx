import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-7 w-40" />
			<Skeleton className="h-5 w-72" />
			<div className="grid gap-4 sm:grid-cols-2">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
					<Skeleton key={`card-${i}`} className="h-32 w-full rounded-lg" />
				))}
			</div>
		</div>
	);
}
