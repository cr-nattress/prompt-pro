CREATE TABLE IF NOT EXISTS "prompt"."weekly_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "prompt"."users"("id"),
	"week_start" date NOT NULL,
	"skill_profile" jsonb NOT NULL,
	"prompts_created" integer DEFAULT 0 NOT NULL,
	"prompts_edited" integer DEFAULT 0 NOT NULL,
	"analyses_run" integer DEFAULT 0 NOT NULL,
	"prompts_improved" integer DEFAULT 0 NOT NULL,
	"average_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "weekly_progress_user_week_idx" ON "prompt"."weekly_progress" ("user_id", "week_start");
