"use client";

import { Medal, Trophy } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { LeaderboardEntry } from "@/lib/db/queries/leaderboard";
import { cn } from "@/lib/utils";

interface ChallengeLeaderboardProps {
	entries: LeaderboardEntry[];
	userRank: { rank: number; total: number } | null;
}

const MEDAL_EMOJI: Record<number, string> = {
	1: "\u{1F947}",
	2: "\u{1F948}",
	3: "\u{1F949}",
};

export function ChallengeLeaderboard({
	entries,
	userRank,
}: ChallengeLeaderboardProps) {
	if (entries.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
				<Trophy className="h-8 w-8" />
				<p className="text-sm">No submissions yet. Be the first!</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-16">Rank</TableHead>
						<TableHead>Name</TableHead>
						<TableHead className="w-24 text-right">Score</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{entries.map((entry) => (
						<TableRow
							key={entry.userId}
							className={cn(entry.isCurrentUser && "bg-primary/5 font-medium")}
						>
							<TableCell className="font-medium tabular-nums">
								{MEDAL_EMOJI[entry.rank] ?? `#${entry.rank}`}
							</TableCell>
							<TableCell>
								{entry.displayName}
								{entry.isCurrentUser && (
									<span className="ml-2 text-muted-foreground text-xs">
										(you)
									</span>
								)}
							</TableCell>
							<TableCell className="text-right tabular-nums">
								{entry.score}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{userRank && !entries.some((e) => e.isCurrentUser) && (
				<div className="flex items-center justify-center gap-2 rounded-md border border-dashed p-3 text-sm">
					<Medal className="h-4 w-4 text-muted-foreground" />
					<span>
						Your rank: <span className="font-medium">#{userRank.rank}</span> of{" "}
						{userRank.total}
					</span>
				</div>
			)}
		</div>
	);
}
