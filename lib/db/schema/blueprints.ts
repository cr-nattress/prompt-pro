import {
	boolean,
	index,
	integer,
	jsonb,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { apps } from "./apps";
import { blockTypeEnum, promptSchema, versionStatusEnum } from "./enums";
import { workspaces } from "./workspaces";

export const contextBlueprints = promptSchema.table(
	"context_blueprints",
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
		description: text(),
		targetLlm: text("target_llm"),
		totalTokenBudget: integer("total_token_budget"),
		blockOrder: uuid("block_order").array(),
		globalParameters: jsonb("global_parameters"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("context_blueprints_app_id_slug_idx").on(
			table.appId,
			table.slug,
		),
		index("context_blueprints_workspace_id_idx").on(table.workspaceId),
	],
);

export const contextBlocks = promptSchema.table(
	"context_blocks",
	{
		id: uuid().defaultRandom().primaryKey(),
		blueprintId: uuid("blueprint_id")
			.notNull()
			.references(() => contextBlueprints.id, { onDelete: "cascade" }),
		type: blockTypeEnum().notNull(),
		slug: text().notNull(),
		name: text().notNull(),
		description: text(),
		content: text(),
		parameters: jsonb(),
		config: jsonb(),
		position: integer().notNull(),
		isRequired: boolean("is_required").default(true).notNull(),
		isConditional: boolean("is_conditional").default(false).notNull(),
		condition: text(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("context_blocks_blueprint_id_slug_idx").on(
			table.blueprintId,
			table.slug,
		),
		index("context_blocks_blueprint_id_idx").on(table.blueprintId),
	],
);

export const contextBlockVersions = promptSchema.table(
	"context_block_versions",
	{
		id: uuid().defaultRandom().primaryKey(),
		blockId: uuid("block_id")
			.notNull()
			.references(() => contextBlocks.id, { onDelete: "cascade" }),
		version: integer().notNull(),
		content: text(),
		config: jsonb(),
		changeNote: text("change_note"),
		status: versionStatusEnum().default("draft").notNull(),
		analysisResult: jsonb("analysis_result"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("context_block_versions_block_id_version_idx").on(
			table.blockId,
			table.version,
		),
	],
);

export const blueprintVersions = promptSchema.table(
	"blueprint_versions",
	{
		id: uuid().defaultRandom().primaryKey(),
		blueprintId: uuid("blueprint_id")
			.notNull()
			.references(() => contextBlueprints.id, { onDelete: "cascade" }),
		version: integer().notNull(),
		blockVersionSnapshot: jsonb("block_version_snapshot"),
		status: versionStatusEnum().default("draft").notNull(),
		changeNote: text("change_note"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("blueprint_versions_blueprint_id_version_idx").on(
			table.blueprintId,
			table.version,
		),
	],
);

export type ContextBlueprint = typeof contextBlueprints.$inferSelect;
export type NewContextBlueprint = typeof contextBlueprints.$inferInsert;
export type ContextBlock = typeof contextBlocks.$inferSelect;
export type NewContextBlock = typeof contextBlocks.$inferInsert;
export type ContextBlockVersion = typeof contextBlockVersions.$inferSelect;
export type NewContextBlockVersion = typeof contextBlockVersions.$inferInsert;
export type BlueprintVersion = typeof blueprintVersions.$inferSelect;
export type NewBlueprintVersion = typeof blueprintVersions.$inferInsert;
