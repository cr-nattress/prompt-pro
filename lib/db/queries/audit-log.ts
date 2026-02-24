import { and, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	type AuditLogEntry,
	auditLog,
	type NewAuditLogEntry,
} from "@/lib/db/schema";

export async function createAuditLogEntry(
	data: Omit<NewAuditLogEntry, "id" | "createdAt">,
): Promise<AuditLogEntry> {
	const rows = await db.insert(auditLog).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return rows[0]!;
}

interface AuditLogFilters {
	workspaceId: string;
	userId?: string | undefined;
	action?: string | undefined;
	resourceType?: string | undefined;
	search?: string | undefined;
	startDate?: Date | undefined;
	endDate?: Date | undefined;
	page?: number | undefined;
	pageSize?: number | undefined;
}

export async function getAuditLog(filters: AuditLogFilters): Promise<{
	entries: AuditLogEntry[];
	total: number;
}> {
	const {
		workspaceId,
		userId,
		action,
		resourceType,
		search,
		startDate,
		endDate,
		page = 1,
		pageSize = 50,
	} = filters;

	const conditions = [eq(auditLog.workspaceId, workspaceId)];

	if (userId) {
		conditions.push(eq(auditLog.userId, userId));
	}
	if (action) {
		conditions.push(eq(auditLog.action, action as AuditLogEntry["action"]));
	}
	if (resourceType) {
		conditions.push(eq(auditLog.resourceType, resourceType));
	}
	if (startDate) {
		conditions.push(gte(auditLog.createdAt, startDate));
	}
	if (endDate) {
		conditions.push(lte(auditLog.createdAt, endDate));
	}
	if (search) {
		const searchCondition = or(
			ilike(auditLog.resourceName, `%${search}%`),
			ilike(auditLog.userName, `%${search}%`),
		);
		if (searchCondition) conditions.push(searchCondition);
	}

	const where = and(...conditions);

	const [entries, totalRows] = await Promise.all([
		db
			.select()
			.from(auditLog)
			.where(where)
			.orderBy(desc(auditLog.createdAt))
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		db.select({ count: count() }).from(auditLog).where(where),
	]);

	return { entries, total: totalRows[0]?.count ?? 0 };
}

export async function getAuditLogActions(
	workspaceId: string,
): Promise<string[]> {
	const rows = await db
		.selectDistinct({ action: auditLog.action })
		.from(auditLog)
		.where(eq(auditLog.workspaceId, workspaceId));
	return rows.map((r) => r.action);
}

export async function getAuditLogUsers(
	workspaceId: string,
): Promise<{ userId: string | null; userName: string | null }[]> {
	const rows = await db
		.selectDistinct({
			userId: auditLog.userId,
			userName: auditLog.userName,
		})
		.from(auditLog)
		.where(eq(auditLog.workspaceId, workspaceId));
	return rows;
}

/** Delete entries older than the given date (for retention policies) */
export async function deleteAuditLogBefore(
	workspaceId: string,
	before: Date,
): Promise<number> {
	const rows = await db
		.delete(auditLog)
		.where(
			and(
				eq(auditLog.workspaceId, workspaceId),
				lte(auditLog.createdAt, before),
			),
		)
		.returning();
	return rows.length;
}
