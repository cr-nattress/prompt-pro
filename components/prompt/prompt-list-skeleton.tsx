import { Skeleton } from "@/components/ui/skeleton";

export function PromptListSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			{Array.from({ length: 5 }, (_, i) => (
				<div
					key={`skeleton-${i.toString()}`}
					className="flex items-center gap-4 rounded-lg border p-4"
				>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<div className="flex items-center gap-2">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-5 w-14 rounded-full" />
							<Skeleton className="h-5 w-10 rounded-full" />
						</div>
						<Skeleton className="hidden h-4 w-64 md:block" />
					</div>
					<Skeleton className="hidden h-4 w-16 md:block" />
					<Skeleton className="h-8 w-8 rounded-md" />
				</div>
			))}
		</div>
	);
}
