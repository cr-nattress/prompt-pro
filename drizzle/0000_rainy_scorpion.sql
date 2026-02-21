CREATE SCHEMA "prompt";
--> statement-breakpoint
CREATE TYPE "prompt"."block_type" AS ENUM('system', 'knowledge', 'examples', 'tools', 'history', 'task');--> statement-breakpoint
CREATE TYPE "prompt"."plan" AS ENUM('free', 'pro', 'team');--> statement-breakpoint
CREATE TYPE "prompt"."version_status" AS ENUM('draft', 'active', 'stable', 'deprecated');--> statement-breakpoint
CREATE TABLE "prompt"."analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_id" uuid,
	"blueprint_id" uuid,
	"prompt_version_id" uuid,
	"clarity" integer,
	"specificity" integer,
	"context_adequacy" integer,
	"role_definition" integer,
	"constraint_quality" integer,
	"example_usage" integer,
	"error_handling" integer,
	"output_formatting" integer,
	"token_efficiency" integer,
	"safety_alignment" integer,
	"task_decomposition" integer,
	"creativity_scope" integer,
	"overall_score" integer,
	"weaknesses" text[],
	"suggestions" text[],
	"enhanced_prompt_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key_hash" text NOT NULL,
	"label" text,
	"scopes" text[],
	"app_id" uuid,
	"expires_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."apps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"default_llm" text,
	"default_params" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."blueprint_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blueprint_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"block_version_snapshot" jsonb,
	"status" "prompt"."version_status" DEFAULT 'draft' NOT NULL,
	"change_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."context_block_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"content" text,
	"config" jsonb,
	"change_note" text,
	"status" "prompt"."version_status" DEFAULT 'draft' NOT NULL,
	"analysis_result" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."context_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blueprint_id" uuid NOT NULL,
	"type" "prompt"."block_type" NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"content" text,
	"parameters" jsonb,
	"config" jsonb,
	"position" integer NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"is_conditional" boolean DEFAULT false NOT NULL,
	"condition" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."context_blueprints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"target_llm" text,
	"total_token_budget" integer,
	"block_order" uuid[],
	"global_parameters" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."prompt_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"purpose" text,
	"description" text,
	"tags" text[],
	"parameter_schema" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."prompt_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_template_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"template_text" text NOT NULL,
	"llm" text,
	"change_note" text,
	"status" "prompt"."version_status" DEFAULT 'draft' NOT NULL,
	"analysis_result" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt"."resolve_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_version_id" uuid,
	"blueprint_version_id" uuid,
	"api_key_id" uuid NOT NULL,
	"resolved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"parameters_used_hash" text,
	"latency_ms" integer
);
--> statement-breakpoint
CREATE TABLE "prompt"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"image_url" text,
	"plan" "prompt"."plan" DEFAULT 'free' NOT NULL,
	"skill_profile" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "prompt"."workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"plan" "prompt"."plan" DEFAULT 'free' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "prompt"."analyses" ADD CONSTRAINT "analyses_prompt_id_prompt_templates_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "prompt"."prompt_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."analyses" ADD CONSTRAINT "analyses_blueprint_id_context_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "prompt"."context_blueprints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."analyses" ADD CONSTRAINT "analyses_prompt_version_id_prompt_versions_id_fk" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt"."prompt_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."api_keys" ADD CONSTRAINT "api_keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "prompt"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."api_keys" ADD CONSTRAINT "api_keys_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "prompt"."apps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."apps" ADD CONSTRAINT "apps_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "prompt"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."blueprint_versions" ADD CONSTRAINT "blueprint_versions_blueprint_id_context_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "prompt"."context_blueprints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."context_block_versions" ADD CONSTRAINT "context_block_versions_block_id_context_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "prompt"."context_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."context_blocks" ADD CONSTRAINT "context_blocks_blueprint_id_context_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "prompt"."context_blueprints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."context_blueprints" ADD CONSTRAINT "context_blueprints_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "prompt"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."context_blueprints" ADD CONSTRAINT "context_blueprints_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "prompt"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."prompt_templates" ADD CONSTRAINT "prompt_templates_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "prompt"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."prompt_templates" ADD CONSTRAINT "prompt_templates_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "prompt"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."prompt_versions" ADD CONSTRAINT "prompt_versions_prompt_template_id_prompt_templates_id_fk" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt"."prompt_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."resolve_logs" ADD CONSTRAINT "resolve_logs_prompt_version_id_prompt_versions_id_fk" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt"."prompt_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."resolve_logs" ADD CONSTRAINT "resolve_logs_blueprint_version_id_blueprint_versions_id_fk" FOREIGN KEY ("blueprint_version_id") REFERENCES "prompt"."blueprint_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."resolve_logs" ADD CONSTRAINT "resolve_logs_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "prompt"."api_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt"."workspaces" ADD CONSTRAINT "workspaces_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "prompt"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "api_keys_workspace_id_idx" ON "prompt"."api_keys" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "apps_workspace_id_slug_idx" ON "prompt"."apps" USING btree ("workspace_id","slug");--> statement-breakpoint
CREATE INDEX "apps_workspace_id_idx" ON "prompt"."apps" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "blueprint_versions_blueprint_id_version_idx" ON "prompt"."blueprint_versions" USING btree ("blueprint_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "context_block_versions_block_id_version_idx" ON "prompt"."context_block_versions" USING btree ("block_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "context_blocks_blueprint_id_slug_idx" ON "prompt"."context_blocks" USING btree ("blueprint_id","slug");--> statement-breakpoint
CREATE INDEX "context_blocks_blueprint_id_idx" ON "prompt"."context_blocks" USING btree ("blueprint_id");--> statement-breakpoint
CREATE UNIQUE INDEX "context_blueprints_app_id_slug_idx" ON "prompt"."context_blueprints" USING btree ("app_id","slug");--> statement-breakpoint
CREATE INDEX "context_blueprints_workspace_id_idx" ON "prompt"."context_blueprints" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_templates_app_id_slug_idx" ON "prompt"."prompt_templates" USING btree ("app_id","slug");--> statement-breakpoint
CREATE INDEX "prompt_templates_workspace_id_idx" ON "prompt"."prompt_templates" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_versions_template_id_version_idx" ON "prompt"."prompt_versions" USING btree ("prompt_template_id","version");--> statement-breakpoint
CREATE INDEX "prompt_versions_status_idx" ON "prompt"."prompt_versions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "prompt_versions_created_at_idx" ON "prompt"."prompt_versions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "workspaces_owner_id_idx" ON "prompt"."workspaces" USING btree ("owner_id");