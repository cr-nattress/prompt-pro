import { Boxes, ScrollText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentItem } from "@/lib/db/queries/dashboard-stats";

interface RecentItemsProps {
	items: RecentItem[];
}

export function RecentItems({ items }: RecentItemsProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-lg">Recent</CardTitle>
				<Link href="/prompts" className="text-primary text-sm hover:underline">
					View All
				</Link>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col divide-y">
					{items.map((item) => {
						const href =
							item.type === "prompt"
								? `/prompts/${item.slug}`
								: `/blueprints/${item.slug}`;

						return (
							<Link
								key={item.id}
								href={href}
								className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/50 first:pt-0 last:pb-0"
							>
								{item.type === "prompt" ? (
									<ScrollText className="h-4 w-4 shrink-0 text-muted-foreground" />
								) : (
									<Boxes className="h-4 w-4 shrink-0 text-muted-foreground" />
								)}
								<span className="min-w-0 flex-1 truncate font-medium text-sm">
									{item.name}
								</span>
								<Badge
									variant="outline"
									className="hidden text-xs sm:inline-flex"
								>
									{item.type}
								</Badge>
								{item.score !== null && (
									<span className="shrink-0 font-medium text-sm tabular-nums">
										{item.score}
									</span>
								)}
							</Link>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
