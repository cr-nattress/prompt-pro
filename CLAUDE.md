# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server (port 3000, Turbopack)
pnpm build            # Production build
pnpm typecheck        # TypeScript type checking (tsc --noEmit)
pnpm lint             # Biome linter
pnpm lint:fix         # Auto-fix Biome issues
pnpm format           # Format with Biome
pnpm test             # Unit tests (Vitest, single run)
pnpm test:watch       # Unit tests in watch mode
pnpm test:e2e         # Playwright E2E tests (requires dev server running)
pnpm db:generate      # Generate Drizzle migrations from schema changes
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema directly (dev only)
pnpm db:studio        # Drizzle Studio UI
pnpm storybook        # Storybook dev server (port 6006)
```

Run a single unit test file:
```bash
pnpm vitest run tests/unit/lib/auth.test.ts
```

## Tech Stack

- **Next.js 16** (Turbopack) with App Router, React 19, TypeScript 5.9
- **Tailwind CSS v4** — CSS-based config via `@theme inline` in `app/globals.css`, not `tailwind.config.ts`
- **shadcn/ui** — New York style, oklch color values, components in `components/ui/`
- **Biome 2.4+** — tab indent, double quotes, semicolons. `components/ui/**` is excluded (generated code)
- **Drizzle ORM** with `postgres` (Porsager) driver. All tables in PostgreSQL `prompt` schema (not `public`)
- **Clerk** for authentication, **Supabase** PostgreSQL for storage
- **Vercel AI SDK** with Anthropic provider for LLM features
- **Zustand** for client state (`stores/*-store.ts`)
- **nuqs** for URL search param state (server-side via `createSearchParamsCache`)

## Architecture

### App Routing Groups

- `app/(auth)/` — Public auth pages (login, signup, forgot-password). Clerk-hosted UI
- `app/(onboarding)/` — Post-signup wizard flow (welcome, first prompt, analysis)
- `app/(dashboard)/` — All protected routes: prompts, blueprints, analytics, learn, settings, pipelines, gallery
- `app/api/v1/` — Public REST API (versioned, API-key auth)
- `app/api/webhooks/` — Clerk webhook receiver (user lifecycle → DB sync)
- `app/api/playground/` — Playground streaming endpoints

### Data Flow

```
Server Component → requireAuth() → DB queries (lib/db/queries/) → render
Client Component → server action (app/**/actions.ts) → requireAuth() → DB queries → ActionResult<T>
```

**Server actions** live in `actions.ts` files within route directories. They always:
1. Start with `"use server"` directive
2. Call `requireAuth()` for workspace-scoped access
3. Return `ActionResult<T>` — a discriminated union: `{ success: true, data: T } | { success: false, error: string }`

**Database queries** are pure functions in `lib/db/queries/` (one file per entity). They use Drizzle query builder and enforce workspace isolation at the query level.

**Schema** is defined in `lib/db/schema/` modules, all within `promptSchema = pgSchema("prompt")`. Raw SQL in queries must reference `prompt.table_name`, not `public.table_name`.

### Authentication

`lib/auth/index.ts` provides:
- `requireAuth()` → `AuthContext` (user + workspace + role). Redirects to sign-in if unauthenticated
- `requireRole(minRole)` → enforces admin > editor > viewer hierarchy
- Auto-provisions DB user and workspace on first Clerk sign-in (handles missing webhook)

`middleware.ts` uses Clerk middleware with route matcher. Public routes: `/`, `/login`, `/signup`, `/forgot-password`, `/api/v1/*`, `/api/webhooks/*`.

### Client Providers

`components/providers.tsx` wraps the app with: ClerkProvider → ThemeProvider (next-themes) → NuqsAdapter → TooltipProvider + Toaster (Sonner).

## Important Patterns

### `exactOptionalPropertyTypes: true`

The tsconfig enables this strict option. `Partial<Pick<T>>` patterns will fail — use mapped types with explicit `| undefined` instead:
```typescript
// Wrong — TS error with exactOptionalPropertyTypes
data: Partial<Pick<NewUser, "email" | "name">>

// Correct
data: { [K in "email" | "name"]?: NewUser[K] | undefined }
```

### Server Action Files and Client Imports

Next.js converts ALL exports from `"use server"` files into server action proxies on the client. Non-function exports (constants, arrays, types) will become broken proxies. Move shared constants to `lib/data/` for client import.

### `next.config.ts` Constraint

Compiled to CJS — cannot use `import.meta.url`. Use `process.cwd()` instead. Has `turbopack.root: process.cwd()` to work around workspace detection issue from a `package-lock.json` in the home directory.

### Environment Variables

Validated via T3 Env + Zod in `lib/env.ts`. Use `env.VARIABLE_NAME` (imported from `@/lib/env`) instead of `process.env` directly. `SKIP_ENV_VALIDATION=true` in `.env.local` disables validation for local dev.

### AI/LLM Calls

All LLM interactions go through `lib/ai/provider.ts` → `getModel(modelId?)`. Default model is Claude Sonnet 4.6. Quota checking via `lib/ai/quota.ts` gates usage by workspace plan.

### Design Tokens

`app/globals.css` defines oklch custom properties. Tailwind v4 registers tokens via `@theme inline` blocks — there is no `tailwind.config.ts`.
