-- Epic 15: Playground runs table for storing test run history
CREATE TABLE IF NOT EXISTS "prompt"."playground_runs" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id"),
  "prompt_id" uuid REFERENCES "prompt"."prompt_templates"("id") ON DELETE SET NULL,
  "prompt_version_id" uuid REFERENCES "prompt"."prompt_versions"("id") ON DELETE SET NULL,
  "blueprint_id" uuid REFERENCES "prompt"."context_blueprints"("id") ON DELETE SET NULL,
  "model_id" text NOT NULL,
  "resolved_text" text NOT NULL,
  "parameters" jsonb DEFAULT '{}' NOT NULL,
  "response_text" text NOT NULL DEFAULT '',
  "input_tokens" integer DEFAULT 0 NOT NULL,
  "output_tokens" integer DEFAULT 0 NOT NULL,
  "latency_ms" integer DEFAULT 0 NOT NULL,
  "temperature" real DEFAULT 1.0 NOT NULL,
  "max_tokens" integer DEFAULT 4096 NOT NULL,
  "status" text DEFAULT 'completed' NOT NULL,
  "error" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "playground_runs_workspace_id_idx" ON "prompt"."playground_runs" ("workspace_id");
CREATE INDEX IF NOT EXISTS "playground_runs_created_at_idx" ON "prompt"."playground_runs" ("created_at" DESC);
