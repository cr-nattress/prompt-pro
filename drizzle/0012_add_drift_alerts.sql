CREATE TABLE "prompt"."drift_alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id"),
  "prompt_template_id" uuid NOT NULL REFERENCES "prompt"."prompt_templates"("id") ON DELETE CASCADE,
  "test_suite_id" uuid NOT NULL REFERENCES "prompt"."test_suites"("id") ON DELETE CASCADE,
  "severity" text NOT NULL DEFAULT 'warning',
  "similarity_score" numeric(5,4) NOT NULL,
  "details" jsonb,
  "dismissed" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "drift_alerts_workspace_id_idx" ON "prompt"."drift_alerts" ("workspace_id");
CREATE INDEX "drift_alerts_dismissed_idx" ON "prompt"."drift_alerts" ("dismissed");
