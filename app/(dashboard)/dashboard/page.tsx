import type { Metadata } from "next";
import { DashboardLesson } from "@/components/dashboard/dashboard-lesson";
import { ExamplePromptCards } from "@/components/dashboard/example-prompt-cards";
import { PromptHealthCard } from "@/components/dashboard/prompt-health-card";
import { RecentItems } from "@/components/dashboard/recent-items";
import { Recommendations } from "@/components/dashboard/recommendations";
import { SkillProfileCard } from "@/components/dashboard/skill-profile-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { WeeklyProgressCard } from "@/components/dashboard/weekly-progress-card";
import { DriftAlertList } from "@/components/drift/drift-alert-list";
import { requireAuth } from "@/lib/auth";
import {
	getDashboardStats,
	getRecentItems,
} from "@/lib/db/queries/dashboard-stats";
import { getActiveDriftAlerts } from "@/lib/db/queries/drift-alerts";
import {
	getUserSkillProfile,
	getWeeklyProgressHistory,
} from "@/lib/db/queries/skill-profile";
import type { SkillProfile } from "@/lib/skills/skill-profile";
import { dismissDriftAlertAction } from "./actions";

export const metadata: Metadata = { title: "Dashboard" };

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

export default async function DashboardPage() {
	const { user, workspace } = await requireAuth();
	const [stats, recentItems, skillProfile, weeklyHistory, driftAlerts] =
		await Promise.all([
			getDashboardStats(workspace.id),
			getRecentItems(workspace.id),
			getUserSkillProfile(user.id),
			getWeeklyProgressHistory(user.id),
			getActiveDriftAlerts(workspace.id),
		]);

	const isEmpty = stats.totalPrompts <= 1;
	const typedProfile = skillProfile as SkillProfile | null;
	const currentWeek = weeklyHistory[0] ?? null;

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="font-bold text-2xl">
					{getGreeting()}, {user.firstName || user.name}
				</h1>
				<p className="text-muted-foreground">
					Here&apos;s an overview of your{" "}
					<span className="font-medium text-foreground">{workspace.name}</span>{" "}
					workspace.
				</p>
			</div>

			{driftAlerts.length > 0 && (
				<DriftAlertList
					alerts={driftAlerts}
					onDismiss={dismissDriftAlertAction}
				/>
			)}

			{isEmpty ? (
				<ExamplePromptCards />
			) : (
				<>
					<StatCards stats={stats} />
					<div className="grid gap-6 md:grid-cols-2">
						{typedProfile && <SkillProfileCard profile={typedProfile} />}
						{typedProfile ? (
							<PromptHealthCard
								profile={typedProfile}
								averageScore={stats.averageScore}
							/>
						) : (
							<Recommendations
								items={recentItems}
								totalPrompts={stats.totalPrompts}
								skillProfile={null}
							/>
						)}
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						<WeeklyProgressCard current={currentWeek} history={weeklyHistory} />
						<Recommendations
							items={recentItems}
							totalPrompts={stats.totalPrompts}
							skillProfile={typedProfile}
						/>
					</div>
					<RecentItems items={recentItems} />
				</>
			)}

			<DashboardLesson
				dismissedLessons={user.dismissedLessons}
				totalPrompts={stats.totalPrompts}
			/>
		</div>
	);
}
