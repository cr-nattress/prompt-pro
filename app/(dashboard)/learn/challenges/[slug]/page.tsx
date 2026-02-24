import { Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeWorkspace } from "@/components/learn/challenge-workspace";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth";
import { getChallenge } from "@/lib/data/challenges";
import { getUserBestScore } from "@/lib/db/queries/challenge-submissions";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params;
	const challenge = getChallenge(slug);
	return {
		title: challenge ? `${challenge.title} — Challenge` : "Challenge",
	};
}

export default async function ChallengePage({ params }: Props) {
	const { slug } = await params;
	const challenge = getChallenge(slug);
	if (!challenge) notFound();

	let bestScore: number | null = null;
	try {
		const { user } = await requireAuth();
		bestScore = await getUserBestScore(user.id, slug);
	} catch {
		// Not logged in
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button variant="outline" size="sm" asChild>
					<Link href={`/learn/challenges/${slug}/leaderboard`}>
						<Trophy className="mr-2 h-4 w-4" />
						Leaderboard
					</Link>
				</Button>
			</div>
			<ChallengeWorkspace challenge={challenge} bestScore={bestScore} />
		</div>
	);
}
