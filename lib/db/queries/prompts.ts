import { and, asc, count, desc, eq, ilike, max, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	type NewPromptTemplate,
	type NewPromptVersion,
	promptTemplates,
	promptVersions,
} from "@/lib/db/schema";

interface PromptFilters {
	search?: string | undefined;
	purpose?: string | undefined;
	tag?: string | undefined;
	sort?: "name" | "createdAt" | "updatedAt" | undefined;
	order?: "asc" | "desc" | undefined;
	page?: number | undefined;
	pageSize?: number | undefined;
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
	data: {
		[K in
			| "slug"
			| "name"
			| "purpose"
			| "description"
			| "tags"
			| "parameterSchema"]?: NewPromptTemplate[K] | undefined;
	},
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

export async function getPromptVersionById(versionId: string) {
	const result = await db
		.select()
		.from(promptVersions)
		.where(eq(promptVersions.id, versionId))
		.limit(1);
	return result[0] ?? null;
}

export async function promotePromptVersion(
	versionId: string,
	promptTemplateId: string,
	newStatus: "active" | "stable" | "deprecated",
) {
	return db.transaction(async (tx) => {
		// Demote the current holder of this status to "draft"
		await tx
			.update(promptVersions)
			.set({ status: "draft" })
			.where(
				and(
					eq(promptVersions.promptTemplateId, promptTemplateId),
					eq(promptVersions.status, newStatus),
				),
			);

		// Promote the target version
		const result = await tx
			.update(promptVersions)
			.set({ status: newStatus })
			.where(eq(promptVersions.id, versionId))
			.returning();
		return result[0] ?? null;
	});
}

export async function restorePromptVersion(
	promptTemplateId: string,
	sourceVersionId: string,
) {
	const source = await getPromptVersionById(sourceVersionId);
	if (!source) return null;

	return createPromptVersion(promptTemplateId, {
		templateText: source.templateText,
		llm: source.llm,
		changeNote: `Restored from v${source.version}`,
	});
}

export async function getPromptVersionByStatus(
	promptTemplateId: string,
	status: "active" | "stable" | "deprecated",
) {
	const result = await db
		.select()
		.from(promptVersions)
		.where(
			and(
				eq(promptVersions.promptTemplateId, promptTemplateId),
				eq(promptVersions.status, status),
			),
		)
		.limit(1);
	return result[0] ?? null;
}

export async function getPromptVersionByNumber(
	promptTemplateId: string,
	version: number,
) {
	const result = await db
		.select()
		.from(promptVersions)
		.where(
			and(
				eq(promptVersions.promptTemplateId, promptTemplateId),
				eq(promptVersions.version, version),
			),
		)
		.limit(1);
	return result[0] ?? null;
}

export async function getPromptBySlugInWorkspace(
	workspaceId: string,
	slug: string,
) {
	const result = await db
		.select()
		.from(promptTemplates)
		.where(
			and(
				eq(promptTemplates.workspaceId, workspaceId),
				eq(promptTemplates.slug, slug),
			),
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

export async function getPromptById(id: string) {
	const result = await db
		.select()
		.from(promptTemplates)
		.where(eq(promptTemplates.id, id))
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

export async function getPromptsWithLatestVersion(
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

	const whereClause = and(...conditions);

	const [items, totalResult] = await Promise.all([
		db
			.select()
			.from(promptTemplates)
			.where(whereClause)
			.orderBy(orderFn(sortColumn))
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		db.select({ total: count() }).from(promptTemplates).where(whereClause),
	]);

	// Fetch latest version for each template
	const itemsWithVersions = await Promise.all(
		items.map(async (template) => {
			const version = await db
				.select()
				.from(promptVersions)
				.where(eq(promptVersions.promptTemplateId, template.id))
				.orderBy(desc(promptVersions.version))
				.limit(1);
			return {
				...template,
				latestVersion: version[0] ?? null,
			};
		}),
	);

	return {
		items: itemsWithVersions,
		total: totalResult[0]?.total ?? 0,
		page,
		pageSize,
	};
}
