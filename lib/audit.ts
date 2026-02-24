import { createAuditLogEntry } from "@/lib/db/queries/audit-log";
import type { AuditLogEntry } from "@/lib/db/schema";

/**
 * Log an action to the audit log. Fire-and-forget — errors are swallowed.
 */
export async function logAudit(
	entry: Omit<Parameters<typeof createAuditLogEntry>[0], "id" | "createdAt">,
): Promise<void> {
	try {
		await createAuditLogEntry(entry);
	} catch {
		// Don't let audit logging failures break the primary action
	}
}

export type AuditAction = AuditLogEntry["action"];
