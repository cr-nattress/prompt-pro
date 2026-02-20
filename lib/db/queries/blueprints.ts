import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	contextBlocks,
	contextBlueprints,
	type NewContextBlueprint,
} from "@/lib/db/schema";

interface BlueprintFilters {
	search?: string;
	sort?: "name" | "createdAt" | "updatedAt";
	order?: "asc" | "desc";
	page?: number;
	pageSize?: number;
}

export async function getBlueprintsByWorkspace(
	workspaceId: string,
	filters: BlueprintFilters = {},
) {
	const {
		search,
		sort = "updatedAt",
		order = "desc",
		page = 1,
		pageSize = 20,
	} = filters;

	const conditions = [eq(contextBlueprints.workspaceId, workspaceId)];

	if (search) {
		const searchCondition = or(
			ilike(contextBlueprints.name, `%${search}%`),
			ilike(contextBlueprints.description, `%${search}%`),
		);
		if (searchCondition) conditions.push(searchCondition);
	}

	const orderFn = order === "asc" ? asc : desc;
	const sortColumn =
		sort === "name"
			? contextBlueprints.name
			: sort === "createdAt"
				? contextBlueprints.createdAt
				: contextBlueprints.updatedAt;

	const [items, totalResult] = await Promise.all([
		db
			.select()
			.from(contextBlueprints)
			.where(and(...conditions))
			.orderBy(orderFn(sortColumn))
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		db
			.select({ total: count() })
			.from(contextBlueprints)
			.where(and(...conditions)),
	]);

	return {
		items,
		total: totalResult[0]?.total ?? 0,
		page,
		pageSize,
	};
}

export async function getBlueprintBySlug(appId: string, slug: string) {
	const result = await db
		.select()
		.from(contextBlueprints)
		.where(
			and(eq(contextBlueprints.appId, appId), eq(contextBlueprints.slug, slug)),
		)
		.limit(1);

	const blueprint = result[0];
	if (!blueprint) return null;

	const blocks = await db
		.select()
		.from(contextBlocks)
		.where(eq(contextBlocks.blueprintId, blueprint.id))
		.orderBy(contextBlocks.position);

	return { ...blueprint, blocks };
}

export async function createBlueprint(data: NewContextBlueprint) {
	const result = await db.insert(contextBlueprints).values(data).returning();
	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function updateBlueprint(
	id: string,
	data: Partial<
		Pick<
			NewContextBlueprint,
			| "slug"
			| "name"
			| "description"
			| "targetLlm"
			| "totalTokenBudget"
			| "blockOrder"
			| "globalParameters"
		>
	>,
) {
	const result = await db
		.update(contextBlueprints)
		.set(data)
		.where(eq(contextBlueprints.id, id))
		.returning();
	return result[0] ?? null;
}

export async function deleteBlueprint(id: string) {
	const result = await db
		.delete(contextBlueprints)
		.where(eq(contextBlueprints.id, id))
		.returning();
	return result[0] ?? null;
}
