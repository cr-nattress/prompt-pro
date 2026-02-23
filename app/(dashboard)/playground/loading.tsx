import { Skeleton } from "@/components/ui/skeleton";

export default function PlaygroundLoading() {
	return (
		<div className="flex h-[calc(100vh-7rem)] gap-4">
			<div className="flex w-80 shrink-0 flex-col gap-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="flex-1">
				<Skeleton className="h-full w-full" />
			</div>
		</div>
	);
}
