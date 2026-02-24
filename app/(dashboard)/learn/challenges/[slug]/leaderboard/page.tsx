import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeLeaderboard } from "@/components/learn/challenge-leaderboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth";
import { getChallenge } from "@/lib/data/challenges";
import {
	getChallengeLeaderboard,
	getUserRank,
} from "@/lib/db/queries/leaderboard";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const challenge = getChallenge(slug);
	return {
		title: challenge ? `${challenge.title} — Leaderboard` : "Leaderboard",
	};
}

export default async function ChallengeLeaderboardPage({ params }: Props) {
	const { slug } = await params;
	const challenge = getChallenge(slug);
	if (!challenge) notFound();

	const { user } = await requireAuth();
	const [entries, userRank] = await Promise.all([
		getChallengeLeaderboard(slug, user.id),
		getUserRank(user.id, slug),
	]);

	return (
		<div className="space-y-6">
			<Button variant="ghost" size="sm" asChild>
				<Link href={`/learn/challenges/${slug}`}>
					<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
					Back to Challenge
				</Link>
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>{challenge.title} — Leaderboard</CardTitle>
				</CardHeader>
				<CardContent>
					<ChallengeLeaderboard entries={entries} userRank={userRank} />
				</CardContent>
			</Card>
		</div>
	);
}
