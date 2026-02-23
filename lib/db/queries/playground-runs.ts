import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { playgroundRuns } from "@/lib/db/schema";

export async function getRecentPlaygroundRuns(workspaceId: string, limit = 20) {
	return db
		.select()
		.from(playgroundRuns)
		.where(eq(playgroundRuns.workspaceId, workspaceId))
		.orderBy(desc(playgroundRuns.createdAt))
		.limit(limit);
}
