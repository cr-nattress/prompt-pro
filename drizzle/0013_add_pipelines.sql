CREATE TABLE "prompt"."pipelines" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id"),
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "steps" jsonb NOT NULL DEFAULT '[]',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "pipelines_workspace_slug_idx" ON "prompt"."pipelines" ("workspace_id", "slug");

CREATE TABLE "prompt"."pipeline_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "pipeline_id" uuid NOT NULL REFERENCES "prompt"."pipelines"("id") ON DELETE CASCADE,
  "status" text NOT NULL DEFAULT 'running',
  "step_results" jsonb NOT NULL DEFAULT '[]',
  "total_tokens" integer DEFAULT 0,
  "total_latency_ms" integer DEFAULT 0,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "completed_at" timestamp with time zone
);
CREATE INDEX "pipeline_runs_pipeline_id_idx" ON "prompt"."pipeline_runs" ("pipeline_id");
