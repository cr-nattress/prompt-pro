ALTER TABLE "prompt"."users" ADD COLUMN "dismissed_lessons" text[] DEFAULT '{}' NOT NULL;
