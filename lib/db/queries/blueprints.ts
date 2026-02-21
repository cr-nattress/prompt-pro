import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	contextBlocks,
	contextBlueprints,
	type NewContextBlueprint,
} from "@/lib/db/schema";
import type { BlueprintWithBlockCount } from "@/types";

interface BlueprintFilters {
	search?: string | undefined;
	sort?: "name" | "createdAt" | "updatedAt" | undefined;
	order?: "asc" | "desc" | undefined;
	page?: number | undefined;
	pageSize?: number | undefined;
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

type BlueprintUpdateKeys =
	| "slug"
	| "name"
	| "description"
	| "targetLlm"
	| "totalTokenBudget"
	| "blockOrder"
	| "globalParameters";
type BlueprintUpdateData = {
	[K in BlueprintUpdateKeys]?: NewContextBlueprint[K] | undefined;
};

export async function updateBlueprint(id: string, data: BlueprintUpdateData) {
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

export async function getBlueprintsWithBlockCount(
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

	const whereClause = and(...conditions);

	const [rows, totalResult] = await Promise.all([
		db
			.select({
				id: contextBlueprints.id,
				appId: contextBlueprints.appId,
				workspaceId: contextBlueprints.workspaceId,
				slug: contextBlueprints.slug,
				name: contextBlueprints.name,
				description: contextBlueprints.description,
				targetLlm: contextBlueprints.targetLlm,
				totalTokenBudget: contextBlueprints.totalTokenBudget,
				blockOrder: contextBlueprints.blockOrder,
				globalParameters: contextBlueprints.globalParameters,
				createdAt: contextBlueprints.createdAt,
				updatedAt: contextBlueprints.updatedAt,
				blockCount: sql<number>`cast(count(${contextBlocks.id}) as int)`,
			})
			.from(contextBlueprints)
			.leftJoin(
				contextBlocks,
				eq(contextBlueprints.id, contextBlocks.blueprintId),
			)
			.where(whereClause)
			.groupBy(contextBlueprints.id)
			.orderBy(orderFn(sortColumn))
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		db.select({ total: count() }).from(contextBlueprints).where(whereClause),
	]);

	return {
		items: rows as BlueprintWithBlockCount[],
		total: totalResult[0]?.total ?? 0,
		page,
		pageSize,
	};
}

export async function getBlueprintBySlugInWorkspace(
	workspaceId: string,
	slug: string,
) {
	const result = await db
		.select()
		.from(contextBlueprints)
		.where(
			and(
				eq(contextBlueprints.workspaceId, workspaceId),
				eq(contextBlueprints.slug, slug),
			),
		)
		.limit(1);

	const blueprint = result[0];
	if (!blueprint) return null;

	const blocks = await db
		.select()
		.from(contextBlocks)
		.where(eq(contextBlocks.blueprintId, blueprint.id))
		.orderBy(asc(contextBlocks.position));

	return { ...blueprint, blocks };
}

export async function duplicateBlueprint(
	blueprintId: string,
	newName: string,
	newSlug: string,
	workspaceId: string,
) {
	const original = await db
		.select()
		.from(contextBlueprints)
		.where(eq(contextBlueprints.id, blueprintId))
		.limit(1);

	const blueprint = original[0];
	if (!blueprint) return null;

	const originalBlocks = await db
		.select()
		.from(contextBlocks)
		.where(eq(contextBlocks.blueprintId, blueprintId))
		.orderBy(asc(contextBlocks.position));

	const newBlueprintResult = await db
		.insert(contextBlueprints)
		.values({
			appId: blueprint.appId,
			workspaceId,
			slug: newSlug,
			name: newName,
			description: blueprint.description,
			targetLlm: blueprint.targetLlm,
			totalTokenBudget: blueprint.totalTokenBudget,
			globalParameters: blueprint.globalParameters,
		})
		.returning();

	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	const newBlueprint = newBlueprintResult[0]!;

	let newBlocks: typeof originalBlocks = [];
	if (originalBlocks.length > 0) {
		newBlocks = await db
			.insert(contextBlocks)
			.values(
				originalBlocks.map((block) => ({
					blueprintId: newBlueprint.id,
					type: block.type,
					slug: block.slug,
					name: block.name,
					description: block.description,
					content: block.content,
					parameters: block.parameters,
					config: block.config,
					position: block.position,
					isRequired: block.isRequired,
					isConditional: block.isConditional,
					condition: block.condition,
				})),
			)
			.returning();
	}

	return { ...newBlueprint, blocks: newBlocks };
}
