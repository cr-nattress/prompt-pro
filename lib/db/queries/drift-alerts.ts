import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	driftAlerts,
	type NewDriftAlert,
	promptTemplates,
} from "@/lib/db/schema";

export async function createDriftAlert(
	data: Omit<NewDriftAlert, "id" | "createdAt">,
) {
	const result = await db.insert(driftAlerts).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function getActiveDriftAlerts(workspaceId: string) {
	return db
		.select({
			alert: driftAlerts,
			promptName: promptTemplates.name,
			promptSlug: promptTemplates.slug,
		})
		.from(driftAlerts)
		.innerJoin(
			promptTemplates,
			eq(driftAlerts.promptTemplateId, promptTemplates.id),
		)
		.where(
			and(
				eq(driftAlerts.workspaceId, workspaceId),
				eq(driftAlerts.dismissed, false),
			),
		)
		.orderBy(desc(driftAlerts.createdAt));
}

export async function dismissDriftAlert(alertId: string) {
	const result = await db
		.update(driftAlerts)
		.set({ dismissed: true })
		.where(eq(driftAlerts.id, alertId))
		.returning();
	return result[0] ?? null;
}

export async function getDriftAlertsForPrompt(promptTemplateId: string) {
	return db
		.select()
		.from(driftAlerts)
		.where(
			and(
				eq(driftAlerts.promptTemplateId, promptTemplateId),
				eq(driftAlerts.dismissed, false),
			),
		)
		.orderBy(desc(driftAlerts.createdAt));
}
