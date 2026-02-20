import { pgSchema } from "drizzle-orm/pg-core";

export const promptSchema = pgSchema("prompt");

export const planEnum = promptSchema.enum("plan", ["free", "pro", "team"]);

export const blockTypeEnum = promptSchema.enum("block_type", [
	"system",
	"knowledge",
	"examples",
	"tools",
	"history",
	"task",
]);

export const versionStatusEnum = promptSchema.enum("version_status", [
	"draft",
	"active",
	"stable",
	"deprecated",
]);
