-- Epic 15: Test suites for prompt testing

CREATE TABLE IF NOT EXISTS "prompt"."test_suites" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "prompt_template_id" uuid NOT NULL REFERENCES "prompt"."prompt_templates"("id") ON DELETE CASCADE,
  "workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id"),
  "name" text NOT NULL DEFAULT 'Default Test Suite',
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "test_suites_prompt_template_id_idx" ON "prompt"."test_suites" ("prompt_template_id");

CREATE TABLE IF NOT EXISTS "prompt"."test_cases" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "test_suite_id" uuid NOT NULL REFERENCES "prompt"."test_suites"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text,
  "parameters" jsonb DEFAULT '{}' NOT NULL,
  "assertions" jsonb DEFAULT '[]' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "test_cases_test_suite_id_idx" ON "prompt"."test_cases" ("test_suite_id");

CREATE TABLE IF NOT EXISTS "prompt"."test_runs" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "test_suite_id" uuid NOT NULL REFERENCES "prompt"."test_suites"("id") ON DELETE CASCADE,
  "prompt_version_id" uuid NOT NULL REFERENCES "prompt"."prompt_versions"("id") ON DELETE CASCADE,
  "model_id" text NOT NULL,
  "status" text DEFAULT 'running' NOT NULL,
  "passed" integer DEFAULT 0 NOT NULL,
  "failed" integer DEFAULT 0 NOT NULL,
  "total" integer DEFAULT 0 NOT NULL,
  "results" jsonb DEFAULT '[]' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "test_runs_test_suite_id_idx" ON "prompt"."test_runs" ("test_suite_id");
CREATE INDEX IF NOT EXISTS "test_runs_prompt_version_id_idx" ON "prompt"."test_runs" ("prompt_version_id");
