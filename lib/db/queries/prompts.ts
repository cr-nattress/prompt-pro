import { and, asc, count, desc, eq, ilike, max, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	type NewPromptTemplate,
	type NewPromptVersion,
	promptTemplates,
	promptVersions,
} from "@/lib/db/schema";

interface PromptFilters {
	search?: string;
	purpose?: string;
	tag?: string;
	sort?: "name" | "createdAt" | "updatedAt";
	order?: "asc" | "desc";
	page?: number;
	pageSize?: number;
}

export async function getPromptsByWorkspace(
	workspaceId: string,
	filters: PromptFilters = {},
) {
	const {
		search,
		purpose,
		tag,
		sort = "updatedAt",
		order = "desc",
		page = 1,
		pageSize = 20,
	} = filters;

	const conditions = [eq(promptTemplates.workspaceId, workspaceId)];

	if (search) {
		const searchCondition = or(
			ilike(promptTemplates.name, `%${search}%`),
			ilike(promptTemplates.description, `%${search}%`),
		);
		if (searchCondition) conditions.push(searchCondition);
	}

	if (purpose) {
		conditions.push(eq(promptTemplates.purpose, purpose));
	}

	if (tag) {
		conditions.push(sql`${tag} = ANY(${promptTemplates.tags})`);
	}

	const orderFn = order === "asc" ? asc : desc;
	const sortColumn =
		sort === "name"
			? promptTemplates.name
			: sort === "createdAt"
				? promptTemplates.createdAt
				: promptTemplates.updatedAt;

	const [items, totalResult] = await Promise.all([
		db
			.select()
			.from(promptTemplates)
			.where(and(...conditions))
			.orderBy(orderFn(sortColumn))
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		db
			.select({ total: count() })
			.from(promptTemplates)
			.where(and(...conditions)),
	]);

	return {
		items,
		total: totalResult[0]?.total ?? 0,
		page,
		pageSize,
	};
}

export async function getPromptBySlug(appId: string, slug: string) {
	const result = await db
		.select()
		.from(promptTemplates)
		.where(
			and(eq(promptTemplates.appId, appId), eq(promptTemplates.slug, slug)),
		)
		.limit(1);

	const template = result[0];
	if (!template) return null;

	const latestVersion = await db
		.select()
		.from(promptVersions)
		.where(eq(promptVersions.promptTemplateId, template.id))
		.orderBy(desc(promptVersions.version))
		.limit(1);

	return {
		...template,
		latestVersion: latestVersion[0] ?? null,
	};
}

export async function createPrompt(
	templateData: NewPromptTemplate,
	versionData: { templateText: string; llm?: string; changeNote?: string },
) {
	const templateResult = await db
		.insert(promptTemplates)
		.values(templateData)
		.returning();
	const template = templateResult[0] as (typeof templateResult)[0];

	const versionResult = await db
		.insert(promptVersions)
		.values({
			promptTemplateId: template.id,
			version: 1,
			templateText: versionData.templateText,
			llm: versionData.llm,
			changeNote: versionData.changeNote ?? "Initial version",
			status: "draft" as const,
		})
		.returning();
	const version = versionResult[0] as (typeof versionResult)[0];

	return { ...template, latestVersion: version };
}

export async function updatePrompt(
	id: string,
	data: Partial<
		Pick<
			NewPromptTemplate,
			"slug" | "name" | "purpose" | "description" | "tags" | "parameterSchema"
		>
	>,
) {
	const result = await db
		.update(promptTemplates)
		.set(data)
		.where(eq(promptTemplates.id, id))
		.returning();
	return result[0] ?? null;
}

export async function deletePrompt(id: string) {
	const result = await db
		.delete(promptTemplates)
		.where(eq(promptTemplates.id, id))
		.returning();
	return result[0] ?? null;
}

export async function getPromptVersions(promptTemplateId: string) {
	return db
		.select()
		.from(promptVersions)
		.where(eq(promptVersions.promptTemplateId, promptTemplateId))
		.orderBy(desc(promptVersions.createdAt));
}

export async function createPromptVersion(
	promptTemplateId: string,
	data: Pick<NewPromptVersion, "templateText" | "llm" | "changeNote">,
) {
	const maxResult = await db
		.select({ maxVersion: max(promptVersions.version) })
		.from(promptVersions)
		.where(eq(promptVersions.promptTemplateId, promptTemplateId));

	const nextVersion = (maxResult[0]?.maxVersion ?? 0) + 1;

	const result = await db
		.insert(promptVersions)
		.values({
			promptTemplateId,
			version: nextVersion,
			templateText: data.templateText,
			llm: data.llm,
			changeNote: data.changeNote,
			status: "draft" as const,
		})
		.returning();

	// biome-ignore lint/style/noNonNullAssertion: insert always returns the created row
	return result[0]!;
}

export async function promoteVersion(
	versionId: string,
	newStatus: "active" | "stable" | "deprecated",
) {
	const result = await db
		.update(promptVersions)
		.set({ status: newStatus })
		.where(eq(promptVersions.id, versionId))
		.returning();
	return result[0] ?? null;
}
