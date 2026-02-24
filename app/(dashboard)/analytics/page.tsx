import { BarChart3 } from "lucide-react";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { requireAuth } from "@/lib/auth";

export const metadata = {
	title: "Analytics — PromptVault",
};

export default async function AnalyticsPage() {
	const { workspace } = await requireAuth();

	if (workspace.plan === "free") {
		return (
			<div className="flex flex-col items-center gap-4 py-16 text-center">
				<BarChart3 className="h-12 w-12 text-muted-foreground" />
				<div>
					<h2 className="font-semibold text-lg">Usage Analytics</h2>
					<p className="text-muted-foreground text-sm">
						Analytics are available on Pro and Team plans. Upgrade to see how
						your prompts are being used.
					</p>
				</div>
			</div>
		);
	}

	return <AnalyticsDashboard />;
}
