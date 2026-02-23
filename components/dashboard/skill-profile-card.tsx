"use client";

import { ArrowUpRight, Award, Target } from "lucide-react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SkillProfile } from "@/lib/skills/skill-profile";
import { getGrowthRecommendation } from "@/lib/skills/skill-profile";

const SkillRadarChart = dynamic(() => import("./skill-radar-chart"), {
	ssr: false,
	loading: () => <Skeleton className="mx-auto h-[220px] w-[220px] rounded" />,
});

interface SkillProfileCardProps {
	profile: SkillProfile;
}

const LEVEL_COLORS: Record<string, string> = {
	Beginner: "bg-red-500/10 text-red-600 dark:text-red-400",
	Novice: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	Intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	Advanced: "bg-green-500/10 text-green-600 dark:text-green-400",
	Expert: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export function SkillProfileCard({ profile }: SkillProfileCardProps) {
	const radarData = [
		{
			skill: "Structure",
			value: profile.promptEngineering.structure,
		},
		{
			skill: "Techniques",
			value: profile.promptEngineering.techniques,
		},
		{
			skill: "Specificity",
			value: profile.promptEngineering.specificity,
		},
		{
			skill: "Complexity",
			value: profile.promptEngineering.complexity,
		},
		{
			skill: "Model Aware",
			value: profile.promptEngineering.modelAwareness,
		},
		{
			skill: "Ctx Design",
			value: profile.contextEngineering.contextDesign,
		},
		{
			skill: "Grounding",
			value: profile.contextEngineering.grounding,
		},
		{
			skill: "Token Mgmt",
			value: profile.contextEngineering.tokenManagement,
		},
		{
			skill: "Info Arch",
			value: profile.contextEngineering.informationArchitecture,
		},
		{
			skill: "Dynamic Ctx",
			value: profile.contextEngineering.dynamicContext,
		},
	];

	const recommendation = getGrowthRecommendation(profile);

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">Skill Profile</CardTitle>
					<Badge
						variant="outline"
						className={LEVEL_COLORS[profile.levelLabel] ?? ""}
					>
						<Award className="mr-1 h-3 w-3" />
						{profile.levelLabel}
					</Badge>
				</div>
				<CardDescription>
					Based on {profile.totalAnalyses} prompt
					{profile.totalAnalyses !== 1 ? " analyses" : " analysis"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SkillRadarChart data={radarData} />

				<div className="mt-3 rounded-md border bg-muted/30 p-3">
					<div className="flex items-start gap-2">
						<Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
						<div>
							<p className="font-medium text-sm">
								Next Growth Area: {profile.weakestSkill.label}
							</p>
							<p className="mt-0.5 text-muted-foreground text-xs">
								{recommendation}
							</p>
						</div>
						<ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
