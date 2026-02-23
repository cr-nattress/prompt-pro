import { Activity, Brain, Target, TrendingUp } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SkillProfile } from "@/lib/skills/skill-profile";

interface PromptHealthCardProps {
	profile: SkillProfile;
	averageScore: number | null;
}

function avgSkillValues(skills: Record<string, number>): number {
	const values = Object.values(skills);
	if (values.length === 0) return 0;
	return values.reduce((a, b) => a + b, 0) / values.length;
}

export function PromptHealthCard({
	profile,
	averageScore,
}: PromptHealthCardProps) {
	const promptAvg = avgSkillValues(profile.promptEngineering);
	const contextAvg = avgSkillValues(profile.contextEngineering);
	const scoreDisplay = averageScore !== null ? Math.round(averageScore) : null;

	const metrics = [
		{
			label: "Prompt Engineering",
			value: promptAvg,
			max: 5,
			icon: Brain,
		},
		{
			label: "Context Engineering",
			value: contextAvg,
			max: 5,
			icon: Target,
		},
	];

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">Your Prompt Health</CardTitle>
					<Activity className="h-4 w-4 text-muted-foreground" />
				</div>
				<CardDescription>
					Based on {profile.totalAnalyses} prompt
					{profile.totalAnalyses !== 1 ? " analyses" : " analysis"}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{scoreDisplay !== null && (
					<div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
						<TrendingUp className="h-5 w-5 shrink-0 text-primary" />
						<div className="flex-1">
							<p className="font-medium text-sm">Average Prompt Score</p>
							<p className="text-muted-foreground text-xs">
								Across all analyzed prompts in your workspace
							</p>
						</div>
						<span className="font-bold text-2xl tabular-nums">
							{scoreDisplay}
						</span>
					</div>
				)}

				{metrics.map((metric) => (
					<div key={metric.label} className="flex flex-col gap-1.5">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<metric.icon className="h-3.5 w-3.5 text-muted-foreground" />
								<span className="text-muted-foreground text-xs">
									{metric.label}
								</span>
							</div>
							<span className="font-medium text-xs tabular-nums">
								{metric.value.toFixed(1)} / {metric.max}
							</span>
						</div>
						<Progress
							value={(metric.value / metric.max) * 100}
							className="h-2"
						/>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
