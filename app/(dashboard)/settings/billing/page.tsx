import { BillingSettings } from "@/components/settings/billing-settings";
import { checkAnalysisQuota } from "@/lib/ai/quota";
import { requireAuth } from "@/lib/auth";

export default async function SettingsBillingPage() {
	const { workspace } = await requireAuth();
	const quota = await checkAnalysisQuota(workspace.id, workspace.plan);

	return (
		<BillingSettings currentPlan={workspace.plan} analysisUsage={quota.used} />
	);
}
