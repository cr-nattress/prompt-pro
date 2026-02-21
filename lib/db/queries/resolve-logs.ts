import { db } from "@/lib/db";
import { type NewResolveLog, resolveLogs } from "@/lib/db/schema";

export async function createResolveLog(data: NewResolveLog) {
	const result = await db.insert(resolveLogs).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}
