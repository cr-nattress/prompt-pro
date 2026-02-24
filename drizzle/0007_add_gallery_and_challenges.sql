CREATE TYPE "prompt"."gallery_category" AS ENUM('writing', 'coding', 'analysis', 'creative', 'support', 'education', 'research', 'other');--> statement-breakpoint
CREATE TABLE "prompt"."gallery_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_template_id" uuid NOT NULL REFERENCES "prompt"."prompt_templates"("id") ON DELETE CASCADE,
	"workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id"),
	"author_id" uuid NOT NULL REFERENCES "prompt"."users"("id"),
	"category" "prompt"."gallery_category" NOT NULL,
	"description" text NOT NULL,
	"author_name" text NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"fork_count" integer DEFAULT 0 NOT NULL,
	"avg_rating" numeric(3, 2) DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_listings_prompt_template_id_unique" UNIQUE("prompt_template_id")
);--> statement-breakpoint
CREATE INDEX "gallery_listings_category_idx" ON "prompt"."gallery_listings" USING btree ("category");--> statement-breakpoint
CREATE INDEX "gallery_listings_published_at_idx" ON "prompt"."gallery_listings" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "gallery_listings_avg_rating_idx" ON "prompt"."gallery_listings" USING btree ("avg_rating");--> statement-breakpoint
CREATE INDEX "gallery_listings_fork_count_idx" ON "prompt"."gallery_listings" USING btree ("fork_count");--> statement-breakpoint
CREATE TABLE "prompt"."gallery_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL REFERENCES "prompt"."gallery_listings"("id") ON DELETE CASCADE,
	"user_id" uuid NOT NULL REFERENCES "prompt"."users"("id"),
	"rating" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_ratings_listing_user_unique" UNIQUE("listing_id", "user_id"),
	CONSTRAINT "gallery_ratings_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);--> statement-breakpoint
CREATE TABLE "prompt"."challenge_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL REFERENCES "prompt"."users"("id"),
	"challenge_slug" text NOT NULL,
	"prompt_text" text NOT NULL,
	"score" integer,
	"strengths" text[],
	"gaps" text[],
	"feedback" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "challenge_submissions_user_id_idx" ON "prompt"."challenge_submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "challenge_submissions_challenge_slug_idx" ON "prompt"."challenge_submissions" USING btree ("challenge_slug");
