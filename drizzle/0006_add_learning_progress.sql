CREATE TABLE IF NOT EXISTS "prompt"."learning_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "prompt"."users"("id"),
	"path_slug" text NOT NULL,
	"lesson_slug" text NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "learning_progress_user_path_lesson_idx" ON "prompt"."learning_progress" ("user_id", "path_slug", "lesson_slug");
