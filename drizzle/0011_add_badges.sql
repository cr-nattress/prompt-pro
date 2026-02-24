CREATE TABLE "prompt"."badges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "prompt"."users"("id"),
  "badge_type" text NOT NULL,
  "badge_slug" text NOT NULL,
  "metadata" jsonb,
  "earned_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "badges_user_badge_unique" UNIQUE ("user_id", "badge_slug")
);
CREATE INDEX "badges_user_id_idx" ON "prompt"."badges" ("user_id");
