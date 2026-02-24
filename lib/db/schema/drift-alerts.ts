import {
	boolean,
	jsonb,
	numeric,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { promptTemplates } from "./prompts";
import { testSuites } from "./test-suites";
import { workspaces } from "./workspaces";

export const driftAlerts = promptSchema.table("drift_alerts", {
	id: uuid().defaultRandom().primaryKey(),
	workspaceId: uuid("workspace_id")
		.notNull()
		.references(() => workspaces.id),
	promptTemplateId: uuid("prompt_template_id")
		.notNull()
		.references(() => promptTemplates.id, { onDelete: "cascade" }),
	testSuiteId: uuid("test_suite_id")
		.notNull()
		.references(() => testSuites.id, { onDelete: "cascade" }),
	severity: text().notNull().default("warning"),
	similarityScore: numeric("similarity_score", {
		precision: 5,
		scale: 4,
	}).notNull(),
	details: jsonb(),
	dismissed: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type DriftAlert = typeof driftAlerts.$inferSelect;
export type NewDriftAlert = typeof driftAlerts.$inferInsert;
