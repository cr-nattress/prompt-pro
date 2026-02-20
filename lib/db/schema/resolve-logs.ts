import { integer, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { apiKeys } from "./api-keys";
import { blueprintVersions } from "./blueprints";
import { promptSchema } from "./enums";
import { promptVersions } from "./prompts";

export const resolveLogs = promptSchema.table("resolve_logs", {
	id: uuid().defaultRandom().primaryKey(),
	promptVersionId: uuid("prompt_version_id").references(
		() => promptVersions.id,
	),
	blueprintVersionId: uuid("blueprint_version_id").references(
		() => blueprintVersions.id,
	),
	apiKeyId: uuid("api_key_id")
		.notNull()
		.references(() => apiKeys.id),
	resolvedAt: timestamp("resolved_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	parametersUsedHash: text("parameters_used_hash"),
	latencyMs: integer("latency_ms"),
});

export type ResolveLog = typeof resolveLogs.$inferSelect;
export type NewResolveLog = typeof resolveLogs.$inferInsert;
