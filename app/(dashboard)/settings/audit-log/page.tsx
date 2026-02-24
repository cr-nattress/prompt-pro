import { AuditLogViewer } from "@/components/settings/audit-log-viewer";
import { requireAuth } from "@/lib/auth";

export const metadata = {
	title: "Audit Log — Settings",
};

export default async function AuditLogPage() {
	const { workspace, role } = await requireAuth();

	if (workspace.plan !== "team") {
		return (
			<div className="space-y-4">
				<h2 className="font-semibold text-lg">Audit Log</h2>
				<p className="text-muted-foreground text-sm">
					The audit log is available on the Team plan. Upgrade to track all
					actions in your workspace for security and compliance.
				</p>
			</div>
		);
	}

	if (role !== "admin") {
		return (
			<div className="space-y-4">
				<h2 className="font-semibold text-lg">Audit Log</h2>
				<p className="text-muted-foreground text-sm">
					Only workspace admins can view the audit log.
				</p>
			</div>
		);
	}

	return <AuditLogViewer />;
}
