-- Epic 22: Webhooks + Audit Log

-- Webhook event type enum
DO $$ BEGIN
  CREATE TYPE "prompt"."webhook_event" AS ENUM (
    'prompt.created',
    'prompt.deleted',
    'prompt.version.promoted',
    'blueprint.created',
    'blueprint.deleted',
    'blueprint.version.promoted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Delivery status enum
DO $$ BEGIN
  CREATE TYPE "prompt"."delivery_status" AS ENUM ('pending', 'success', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Audit action enum
DO $$ BEGIN
  CREATE TYPE "prompt"."audit_action" AS ENUM (
    'prompt.create',
    'prompt.update',
    'prompt.delete',
    'prompt.version.promote',
    'blueprint.create',
    'blueprint.update',
    'blueprint.delete',
    'blueprint.version.promote',
    'api_key.create',
    'api_key.revoke',
    'member.invite',
    'member.remove',
    'member.role_change',
    'collection.create',
    'collection.update',
    'collection.delete',
    'workspace.update',
    'webhook.create',
    'webhook.update',
    'webhook.delete',
    'export.download',
    'import.upload'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Webhooks table
CREATE TABLE IF NOT EXISTS "prompt"."webhooks" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "secret" text NOT NULL,
  "events" "prompt"."webhook_event"[] NOT NULL DEFAULT '{}',
  "active" boolean NOT NULL DEFAULT true,
  "description" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "webhooks_workspace_id_idx" ON "prompt"."webhooks" ("workspace_id");

-- Webhook deliveries table
CREATE TABLE IF NOT EXISTS "prompt"."webhook_deliveries" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "webhook_id" uuid NOT NULL REFERENCES "prompt"."webhooks"("id") ON DELETE CASCADE,
  "event" "prompt"."webhook_event" NOT NULL,
  "payload" jsonb NOT NULL,
  "status" "prompt"."delivery_status" NOT NULL DEFAULT 'pending',
  "status_code" integer,
  "response_body" text,
  "attempts" integer NOT NULL DEFAULT 0,
  "next_retry_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "webhook_deliveries_webhook_id_idx" ON "prompt"."webhook_deliveries" ("webhook_id");
CREATE INDEX IF NOT EXISTS "webhook_deliveries_status_idx" ON "prompt"."webhook_deliveries" ("status") WHERE "status" = 'pending';

-- Audit log table
CREATE TABLE IF NOT EXISTS "prompt"."audit_log" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "workspace_id" uuid NOT NULL REFERENCES "prompt"."workspaces"("id") ON DELETE CASCADE,
  "user_id" uuid REFERENCES "prompt"."users"("id") ON DELETE SET NULL,
  "user_name" text,
  "action" "prompt"."audit_action" NOT NULL,
  "resource_type" text NOT NULL,
  "resource_id" text,
  "resource_name" text,
  "details" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "audit_log_workspace_id_idx" ON "prompt"."audit_log" ("workspace_id");
CREATE INDEX IF NOT EXISTS "audit_log_created_at_idx" ON "prompt"."audit_log" ("workspace_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "audit_log_action_idx" ON "prompt"."audit_log" ("workspace_id", "action");
