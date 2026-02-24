import { WebhookManager } from "@/components/settings/webhook-manager";
import { requireAuth } from "@/lib/auth";
import { getWebhooksByWorkspace } from "@/lib/db/queries/webhooks";

export const metadata = {
	title: "Webhooks — Settings",
};

export default async function WebhooksPage() {
	const { workspace, role } = await requireAuth();

	if (workspace.plan === "free") {
		return (
			<div className="space-y-4">
				<h2 className="font-semibold text-lg">Webhooks</h2>
				<p className="text-muted-foreground text-sm">
					Webhooks are available on Pro and Team plans. Upgrade to receive
					notifications when prompts are updated.
				</p>
			</div>
		);
	}

	if (role !== "admin") {
		return (
			<div className="space-y-4">
				<h2 className="font-semibold text-lg">Webhooks</h2>
				<p className="text-muted-foreground text-sm">
					Only workspace admins can manage webhooks.
				</p>
			</div>
		);
	}

	const webhooks = await getWebhooksByWorkspace(workspace.id);

	return <WebhookManager webhooks={webhooks} />;
}
