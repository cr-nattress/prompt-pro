import {
	index,
	integer,
	jsonb,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { apps } from "./apps";
import { collections } from "./collections";
import { promptSchema, versionStatusEnum } from "./enums";
import { workspaces } from "./workspaces";

export const promptTemplates = promptSchema.table(
	"prompt_templates",
	{
		id: uuid().defaultRandom().primaryKey(),
		appId: uuid("app_id")
			.notNull()
			.references(() => apps.id, { onDelete: "cascade" }),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id),
		slug: text().notNull(),
		name: text().notNull(),
		purpose: text(),
		description: text(),
		tags: text().array(),
		parameterSchema: jsonb("parameter_schema"),
		collectionId: uuid("collection_id").references(() => collections.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("prompt_templates_app_id_slug_idx").on(table.appId, table.slug),
		index("prompt_templates_workspace_id_idx").on(table.workspaceId),
	],
);

export const promptVersions = promptSchema.table(
	"prompt_versions",
	{
		id: uuid().defaultRandom().primaryKey(),
		promptTemplateId: uuid("prompt_template_id")
			.notNull()
			.references(() => promptTemplates.id, { onDelete: "cascade" }),
		version: integer().notNull(),
		templateText: text("template_text").notNull(),
		llm: text(),
		changeNote: text("change_note"),
		status: versionStatusEnum().default("draft").notNull(),
		analysisResult: jsonb("analysis_result"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("prompt_versions_template_id_version_idx").on(
			table.promptTemplateId,
			table.version,
		),
		index("prompt_versions_status_idx").on(table.status),
		index("prompt_versions_created_at_idx").on(table.createdAt),
	],
);

export type PromptTemplate = typeof promptTemplates.$inferSelect;
export type NewPromptTemplate = typeof promptTemplates.$inferInsert;
export type PromptVersion = typeof promptVersions.$inferSelect;
export type NewPromptVersion = typeof promptVersions.$inferInsert;
