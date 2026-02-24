"use server";

import { requireAuth } from "@/lib/auth";
import type { LeaderboardEntry } from "@/lib/db/queries/leaderboard";
import {
	getChallengeLeaderboard,
	getOverallLeaderboard,
	getUserRank,
} from "@/lib/db/queries/leaderboard";
import type { ActionResult } from "@/types";

export async function getChallengeLeaderboardAction(slug: string): Promise<
	ActionResult<{
		entries: LeaderboardEntry[];
		userRank: { rank: number; total: number } | null;
	}>
> {
	try {
		const { user } = await requireAuth();
		const [entries, userRank] = await Promise.all([
			getChallengeLeaderboard(slug, user.id),
			getUserRank(user.id, slug),
		]);
		return { success: true, data: { entries, userRank } };
	} catch {
		return { success: false, error: "Failed to load leaderboard." };
	}
}

export async function getOverallLeaderboardAction(): Promise<
	ActionResult<{
		entries: (LeaderboardEntry & { completedChallenges: number })[];
		userRank: { rank: number; total: number } | null;
	}>
> {
	try {
		const { user } = await requireAuth();
		const [entries, userRank] = await Promise.all([
			getOverallLeaderboard(user.id),
			getUserRank(user.id),
		]);
		return { success: true, data: { entries, userRank } };
	} catch {
		return { success: false, error: "Failed to load leaderboard." };
	}
}
