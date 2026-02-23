import {
	index,
	integer,
	jsonb,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { promptTemplates, promptVersions } from "./prompts";
import { workspaces } from "./workspaces";

export const testSuites = promptSchema.table(
	"test_suites",
	{
		id: uuid().defaultRandom().primaryKey(),
		promptTemplateId: uuid("prompt_template_id")
			.notNull()
			.references(() => promptTemplates.id, { onDelete: "cascade" }),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id),
		name: text().notNull().default("Default Test Suite"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("test_suites_prompt_template_id_idx").on(table.promptTemplateId),
	],
);

export const testCases = promptSchema.table(
	"test_cases",
	{
		id: uuid().defaultRandom().primaryKey(),
		testSuiteId: uuid("test_suite_id")
			.notNull()
			.references(() => testSuites.id, { onDelete: "cascade" }),
		name: text().notNull(),
		description: text(),
		parameters: jsonb().default({}).notNull(),
		assertions: jsonb().default([]).notNull(),
		sortOrder: integer("sort_order").default(0).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [index("test_cases_test_suite_id_idx").on(table.testSuiteId)],
);

export const testRuns = promptSchema.table(
	"test_runs",
	{
		id: uuid().defaultRandom().primaryKey(),
		testSuiteId: uuid("test_suite_id")
			.notNull()
			.references(() => testSuites.id, { onDelete: "cascade" }),
		promptVersionId: uuid("prompt_version_id")
			.notNull()
			.references(() => promptVersions.id, { onDelete: "cascade" }),
		modelId: text("model_id").notNull(),
		status: text().default("running").notNull(),
		passed: integer().default(0).notNull(),
		failed: integer().default(0).notNull(),
		total: integer().default(0).notNull(),
		results: jsonb().default([]).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("test_runs_test_suite_id_idx").on(table.testSuiteId),
		index("test_runs_prompt_version_id_idx").on(table.promptVersionId),
	],
);

export type TestSuite = typeof testSuites.$inferSelect;
export type NewTestSuite = typeof testSuites.$inferInsert;
export type TestCase = typeof testCases.$inferSelect;
export type NewTestCase = typeof testCases.$inferInsert;
export type TestRun = typeof testRuns.$inferSelect;
export type NewTestRun = typeof testRuns.$inferInsert;
