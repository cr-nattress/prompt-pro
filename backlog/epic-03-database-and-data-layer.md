# Epic 03 — Database & Data Layer

**Phase:** 1 (MVP)
**Estimated:** Week 1-2
**Dependencies:** Epic 01 (Project Foundation)
**References:** PLAN.md §4 (Data Model); TECHNOLOGY.md §9

## Goal

Set up the PostgreSQL database via Neon, define the full Drizzle ORM schema, run initial migrations, and create reusable query helpers for all core entities.

---

## Stories

### 3.1 — Set Up Neon PostgreSQL [P0]

**As a** developer
**I want** a serverless Postgres database provisioned and connected
**So that** we have persistent data storage

**Acceptance Criteria:**
- [ ] Neon project created with a `main` branch
- [ ] `DATABASE_URL` connection string added to env vars (local `.env` and Vercel)
- [ ] Neon serverless driver (`@neondatabase/serverless`) installed
- [ ] Database connection verified — a test query returns successfully
- [ ] Connection pooling configured for serverless environment

**Technical Notes:**
- Use Neon's serverless driver for edge compatibility
- Enable database branching for preview deployments (can be done later in Epic 01.11)

---

### 3.2 — Define Drizzle Schema — Core Tables [P0]

**As a** developer
**I want** the Drizzle ORM schema defined for all core tables
**So that** we have type-safe database access

**Acceptance Criteria:**
- [ ] Drizzle ORM installed with `drizzle-kit`
- [ ] Schema file(s) in `lib/db/schema/` define all tables from PLAN.md §4:
  - `workspaces` — id, slug, name, ownerId, plan, createdAt
  - `users` — id, clerkId, email, name, plan, skillProfile (JSONB), createdAt
  - `apps` — id, workspaceId, slug, name, description, defaultLlm, defaultParams (JSONB)
  - `promptTemplates` — id, appId, workspaceId, slug, name, purpose, description, tags (text[]), parameterSchema (JSONB), createdAt, updatedAt
  - `promptVersions` — id, promptTemplateId, version, templateText, llm, changeNote, status (enum: draft/active/stable/deprecated), analysisResult (JSONB), createdAt
  - `contextBlueprints` — id, appId, workspaceId, slug, name, description, targetLlm, totalTokenBudget, blockOrder (UUID[]), globalParameters (JSONB), createdAt, updatedAt
  - `contextBlocks` — id, blueprintId, type (enum), slug, name, description, content, parameters (JSONB), config (JSONB), position, isRequired, isConditional, condition, createdAt, updatedAt
  - `contextBlockVersions` — id, blockId, version, content, config (JSONB), changeNote, status, analysisResult (JSONB), createdAt
  - `blueprintVersions` — id, blueprintId, version, blockVersionSnapshot (JSONB), status, changeNote, createdAt
  - `apiKeys` — id, workspaceId, keyHash, label, scopes (text[]), appId (nullable), expiresAt, lastUsedAt, createdAt
  - `analyses` — id, promptId, blueprintId, promptVersionId, all score fields (integer), weaknesses (text[]), suggestions (text[]), enhancedPromptText, createdAt
  - `resolveLogs` — id, promptVersionId, blueprintVersionId, apiKeyId, resolvedAt, parametersUsedHash, latencyMs
- [ ] Foreign keys defined with proper cascading (delete app → delete its prompts)
- [ ] Indexes on: workspaceId (all tables), slug (unique within parent), status, createdAt
- [ ] Enums defined for: plan, blockType, versionStatus
- [ ] TypeScript types inferred from schema and exported

---

### 3.3 — Run Initial Migration [P0]

**As a** developer
**I want** the schema applied to the database via migration
**So that** tables exist and are version-controlled

**Acceptance Criteria:**
- [ ] `drizzle-kit generate` creates migration files in `drizzle/` directory
- [ ] `drizzle-kit migrate` applies migrations to the database
- [ ] `pnpm db:generate` and `pnpm db:migrate` scripts configured in package.json
- [ ] `pnpm db:push` script for quick development iteration
- [ ] `pnpm db:studio` opens Drizzle Studio for database inspection
- [ ] All tables created successfully in Neon

---

### 3.4 — Database Client & Connection [P0]

**As a** developer
**I want** a configured Drizzle client exported from `lib/db`
**So that** any server code can import and query the database

**Acceptance Criteria:**
- [ ] `lib/db/index.ts` exports configured Drizzle client
- [ ] Connection uses Neon serverless driver
- [ ] Client is singleton (no new connection per request)
- [ ] Works in Server Components, Server Actions, and Route Handlers
- [ ] TypeScript inference works — `db.select().from(prompts)` returns typed results

---

### 3.5 — Query Helpers — Workspace & App [P0]

**As a** developer
**I want** reusable query functions for workspaces and apps
**So that** CRUD operations are consistent and don't duplicate SQL

**Acceptance Criteria:**
- [ ] `lib/db/queries/workspaces.ts`:
  - `getWorkspaceBySlug(slug)`, `getWorkspacesByUserId(userId)`, `createWorkspace(data)`, `updateWorkspace(id, data)`
- [ ] `lib/db/queries/apps.ts`:
  - `getAppsByWorkspaceId(workspaceId)`, `getAppBySlug(workspaceId, slug)`, `createApp(data)`, `updateApp(id, data)`, `deleteApp(id)`
- [ ] All queries scoped by workspaceId for multi-tenancy
- [ ] TypeScript return types match the schema

---

### 3.6 — Query Helpers — Prompts [P0]

**As a** developer
**I want** reusable query functions for prompt templates and versions
**So that** prompt CRUD operations are consistent

**Acceptance Criteria:**
- [ ] `lib/db/queries/prompts.ts`:
  - `getPromptsByWorkspace(workspaceId, filters?)` — supports search, LLM filter, purpose filter, tag filter, sort, pagination
  - `getPromptBySlug(appId, slug)` — includes latest version
  - `createPrompt(data)` — creates template + initial draft version
  - `updatePrompt(id, data)` — updates template metadata
  - `deletePrompt(id)` — soft delete or cascade
  - `getPromptVersions(promptId)` — ordered by version desc
  - `createPromptVersion(promptId, data)` — auto-increments version
  - `promoteVersion(versionId, newStatus)` — updates status
- [ ] Pagination returns `{ items, total, page, pageSize }`
- [ ] Search queries use Postgres `ILIKE` or full-text search on title + description

---

### 3.7 — Query Helpers — Blueprints & Blocks [P0]

**As a** developer
**I want** reusable query functions for blueprints, blocks, and their versions
**So that** blueprint CRUD operations are consistent

**Acceptance Criteria:**
- [ ] `lib/db/queries/blueprints.ts`:
  - `getBlueprintsByWorkspace(workspaceId, filters?)`
  - `getBlueprintBySlug(appId, slug)` — includes blocks with latest versions
  - `createBlueprint(data)` — creates blueprint with initial blocks
  - `updateBlueprint(id, data)`
  - `deleteBlueprint(id)`
- [ ] `lib/db/queries/blocks.ts`:
  - `getBlocksByBlueprintId(blueprintId)` — ordered by position
  - `createBlock(blueprintId, data)`
  - `updateBlock(id, data)`
  - `deleteBlock(id)`
  - `reorderBlocks(blueprintId, orderedIds[])` — updates positions
  - `createBlockVersion(blockId, data)`
  - `getBlockVersions(blockId)`
- [ ] Blueprint version snapshot captures current block version IDs

---

### 3.8 — Seed Data [P2]

**As a** developer
**I want** seed data for development and testing
**So that** I can work with realistic data during development

**Acceptance Criteria:**
- [ ] `pnpm db:seed` script populates database with:
  - 1 workspace with 2 apps
  - 10 prompts across different purposes (writing, support, coding, analysis)
  - 3 blueprints with various block configurations
  - Multiple versions per prompt (demonstrating the lifecycle)
  - Sample analyses with scores
- [ ] Seed script is idempotent (can re-run without duplicates)
- [ ] Seed data includes the example prompts shown in onboarding empty states
