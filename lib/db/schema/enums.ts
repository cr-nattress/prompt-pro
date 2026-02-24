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

export const workspaceRoleEnum = promptSchema.enum("workspace_role", [
	"admin",
	"editor",
	"viewer",
]);

export const galleryCategoryEnum = promptSchema.enum("gallery_category", [
	"writing",
	"coding",
	"analysis",
	"creative",
	"support",
	"education",
	"research",
	"other",
]);

export const webhookEventEnum = promptSchema.enum("webhook_event", [
	"prompt.created",
	"prompt.deleted",
	"prompt.version.promoted",
	"blueprint.created",
	"blueprint.deleted",
	"blueprint.version.promoted",
]);

export const deliveryStatusEnum = promptSchema.enum("delivery_status", [
	"pending",
	"success",
	"failed",
]);

export const auditActionEnum = promptSchema.enum("audit_action", [
	"prompt.create",
	"prompt.update",
	"prompt.delete",
	"prompt.version.promote",
	"blueprint.create",
	"blueprint.update",
	"blueprint.delete",
	"blueprint.version.promote",
	"api_key.create",
	"api_key.revoke",
	"member.invite",
	"member.remove",
	"member.role_change",
	"collection.create",
	"collection.update",
	"collection.delete",
	"workspace.update",
	"webhook.create",
	"webhook.update",
	"webhook.delete",
	"export.download",
	"import.upload",
]);
