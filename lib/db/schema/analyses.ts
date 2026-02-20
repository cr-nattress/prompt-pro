import { integer, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { contextBlueprints } from "./blueprints";
import { promptSchema } from "./enums";
import { promptTemplates, promptVersions } from "./prompts";

export const analyses = promptSchema.table("analyses", {
	id: uuid().defaultRandom().primaryKey(),
	promptId: uuid("prompt_id").references(() => promptTemplates.id),
	blueprintId: uuid("blueprint_id").references(() => contextBlueprints.id),
	promptVersionId: uuid("prompt_version_id").references(
		() => promptVersions.id,
	),
	// Score columns (0-100 scale)
	clarity: integer(),
	specificity: integer(),
	contextAdequacy: integer("context_adequacy"),
	roleDefinition: integer("role_definition"),
	constraintQuality: integer("constraint_quality"),
	exampleUsage: integer("example_usage"),
	errorHandling: integer("error_handling"),
	outputFormatting: integer("output_formatting"),
	tokenEfficiency: integer("token_efficiency"),
	safetyAlignment: integer("safety_alignment"),
	taskDecomposition: integer("task_decomposition"),
	creativityScope: integer("creativity_scope"),
	overallScore: integer("overall_score"),
	// Analysis details
	weaknesses: text().array(),
	suggestions: text().array(),
	enhancedPromptText: text("enhanced_prompt_text"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
