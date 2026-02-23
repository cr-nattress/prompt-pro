import {
	index,
	integer,
	jsonb,
	real,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { contextBlueprints } from "./blueprints";
import { promptSchema } from "./enums";
import { promptTemplates, promptVersions } from "./prompts";
import { workspaces } from "./workspaces";

export const playgroundRuns = promptSchema.table(
	"playground_runs",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id),
		promptId: uuid("prompt_id").references(() => promptTemplates.id, {
			onDelete: "set null",
		}),
		promptVersionId: uuid("prompt_version_id").references(
			() => promptVersions.id,
			{ onDelete: "set null" },
		),
		blueprintId: uuid("blueprint_id").references(() => contextBlueprints.id, {
			onDelete: "set null",
		}),
		modelId: text("model_id").notNull(),
		resolvedText: text("resolved_text").notNull(),
		parameters: jsonb().default({}).notNull(),
		responseText: text("response_text").notNull().default(""),
		inputTokens: integer("input_tokens").default(0).notNull(),
		outputTokens: integer("output_tokens").default(0).notNull(),
		latencyMs: integer("latency_ms").default(0).notNull(),
		temperature: real().default(1.0).notNull(),
		maxTokens: integer("max_tokens").default(4096).notNull(),
		status: text().default("completed").notNull(),
		error: text(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("playground_runs_workspace_id_idx").on(table.workspaceId),
		index("playground_runs_created_at_idx").on(table.createdAt),
	],
);

export type PlaygroundRun = typeof playgroundRuns.$inferSelect;
export type NewPlaygroundRun = typeof playgroundRuns.$inferInsert;
