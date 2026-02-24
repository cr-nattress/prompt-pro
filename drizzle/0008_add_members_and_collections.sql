CREATE TYPE "prompt"."workspace_role" AS ENUM('admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TABLE "prompt"."workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id") ON DELETE CASCADE,
	"user_id" uuid NOT NULL REFERENCES "prompt"."users"("id") ON DELETE CASCADE,
	"role" "prompt"."workspace_role" NOT NULL DEFAULT 'editor',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_workspace_user_unique" UNIQUE("workspace_id", "user_id")
);--> statement-breakpoint
CREATE INDEX "workspace_members_workspace_id_idx" ON "prompt"."workspace_members" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_members_user_id_idx" ON "prompt"."workspace_members" USING btree ("user_id");--> statement-breakpoint
CREATE TABLE "prompt"."workspace_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id") ON DELETE CASCADE,
	"email" text NOT NULL,
	"role" "prompt"."workspace_role" NOT NULL DEFAULT 'editor',
	"token" text NOT NULL UNIQUE,
	"invited_by" uuid NOT NULL REFERENCES "prompt"."users"("id"),
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "workspace_invitations_token_idx" ON "prompt"."workspace_invitations" USING btree ("token");--> statement-breakpoint
CREATE INDEX "workspace_invitations_workspace_id_idx" ON "prompt"."workspace_invitations" USING btree ("workspace_id");--> statement-breakpoint
CREATE TABLE "prompt"."collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id") ON DELETE CASCADE,
	"parent_id" uuid REFERENCES "prompt"."collections"("id") ON DELETE CASCADE,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "collections_workspace_id_idx" ON "prompt"."collections" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "collections_parent_id_idx" ON "prompt"."collections" USING btree ("parent_id");--> statement-breakpoint
ALTER TABLE "prompt"."prompt_templates" ADD COLUMN "collection_id" uuid REFERENCES "prompt"."collections"("id") ON DELETE SET NULL;--> statement-breakpoint
CREATE INDEX "prompt_templates_collection_id_idx" ON "prompt"."prompt_templates" USING btree ("collection_id");
