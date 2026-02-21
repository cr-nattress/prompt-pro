-- Seed development data
-- Creates a dev user, workspace, and default app for local/bypass-auth development
--
-- These IDs match the BYPASS_AUTH mock values in lib/auth/index.ts:
--   User:      00000000-0000-0000-0000-000000000001
--   Workspace: 00000000-0000-0000-0000-000000000010
--   App:       00000000-0000-0000-0000-000000000100

-- Dev user
INSERT INTO "prompt"."users" (id, clerk_id, email, name, first_name, last_name, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dev_clerk_001',
  'dev@localhost',
  'Dev User',
  'Dev',
  'User',
  'free'
)
ON CONFLICT (id) DO NOTHING;

-- Dev workspace
INSERT INTO "prompt"."workspaces" (id, slug, name, owner_id, plan)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'dev',
  'Dev Workspace',
  '00000000-0000-0000-0000-000000000001',
  'free'
)
ON CONFLICT (id) DO NOTHING;

-- Default app
INSERT INTO "prompt"."apps" (id, workspace_id, slug, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000100',
  '00000000-0000-0000-0000-000000000010',
  'default',
  'Default App',
  'Default application for development'
)
ON CONFLICT (id) DO NOTHING;
