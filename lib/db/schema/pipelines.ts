import {
	integer,
	jsonb,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { workspaces } from "./workspaces";

export const pipelines = promptSchema.table(
	"pipelines",
	{
		id: uuid().defaultRandom().primaryKey(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id),
		slug: text().notNull(),
		name: text().notNull(),
		description: text(),
		steps: jsonb().notNull().default([]),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		uniqueIndex("pipelines_workspace_slug_idx").on(t.workspaceId, t.slug),
	],
);

export const pipelineRuns = promptSchema.table("pipeline_runs", {
	id: uuid().defaultRandom().primaryKey(),
	pipelineId: uuid("pipeline_id")
		.notNull()
		.references(() => pipelines.id, { onDelete: "cascade" }),
	status: text().notNull().default("running"),
	stepResults: jsonb("step_results").notNull().default([]),
	totalTokens: integer("total_tokens").default(0),
	totalLatencyMs: integer("total_latency_ms").default(0),
	startedAt: timestamp("started_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type Pipeline = typeof pipelines.$inferSelect;
export type NewPipeline = typeof pipelines.$inferInsert;
export type PipelineRun = typeof pipelineRuns.$inferSelect;
export type NewPipelineRun = typeof pipelineRuns.$inferInsert;
