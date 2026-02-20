# Epic 01 — Project Foundation

**Phase:** 1 (MVP)
**Estimated:** Week 1
**Dependencies:** None
**References:** TECHNOLOGY.md §1-4, §14, §19-20; UIUX.md §1

## Goal

Set up the project scaffold, tooling, design tokens, and theming so all subsequent epics build on a consistent foundation.

---

## Stories

### 1.1 — Initialize Next.js 15 Project [P0]

**As a** developer
**I want** a Next.js 15 App Router project with TypeScript strict mode
**So that** we have the foundational framework configured correctly

**Acceptance Criteria:**
- [ ] `pnpm create next-app` with App Router, TypeScript, Tailwind CSS, ESLint disabled (we use Biome)
- [ ] TypeScript strict mode enabled: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- [ ] Node.js 22+ specified in `engines` field and `.nvmrc`
- [ ] `pnpm dev` starts the app with no errors
- [ ] Git initialized with `.gitignore` for Next.js

**Technical Notes:**
- Use `pnpm` as package manager (see TECHNOLOGY.md §20)
- App Router route groups: `(auth)` for public auth pages, `(dashboard)` for authenticated pages
- Set up path aliases: `@/components`, `@/lib`, `@/hooks`, `@/stores`, `@/types`

---

### 1.2 — Configure Biome (Linting & Formatting) [P0]

**As a** developer
**I want** Biome configured for linting and formatting
**So that** code quality is enforced consistently

**Acceptance Criteria:**
- [ ] `biome.json` configured with recommended rules + TypeScript strict
- [ ] Import sorting enabled
- [ ] Format on save works in VS Code (`.vscode/settings.json`)
- [ ] `pnpm lint` and `pnpm format` scripts work
- [ ] Remove any default ESLint config from Next.js scaffold

**Technical Notes:**
- Supplement with `eslint-plugin-jsx-a11y` if Biome's JSX a11y rules are insufficient (defer to Epic 14)

---

### 1.3 — Configure Husky & lint-staged [P1]

**As a** developer
**I want** pre-commit hooks that run linting and type checking
**So that** broken code never reaches the repository

**Acceptance Criteria:**
- [ ] Husky installed with pre-commit hook
- [ ] `lint-staged` runs Biome on staged files
- [ ] `tsc --noEmit` runs on commit
- [ ] Commits with lint errors are rejected

---

### 1.4 — Set Up Design Tokens & Theming [P0]

**As a** developer
**I want** design tokens defined in Tailwind config and CSS custom properties
**So that** colors, typography, spacing, and motion are consistent app-wide

**Acceptance Criteria:**
- [ ] `tailwind.config.ts` defines full token set:
  - Colors: semantic HSL-based (background, foreground, primary, secondary, muted, accent, destructive, card, popover, border, input, ring, chart-1 through chart-5)
  - Typography: `--font-sans` (Inter), `--font-mono` (JetBrains Mono)
  - Type scale: 12/14/16/18/20/24/30/36px
  - Spacing: 4px base unit (0-20 scale)
  - Border radius: sm (6px), md (8px), lg (12px), xl (16px)
  - Motion: fast (100ms), normal (200ms), slow (300ms), ease-out-expo easing
- [ ] `globals.css` defines CSS custom properties for all tokens
- [ ] Dark mode via `.dark` class on `<html>` with swapped CSS custom property values
- [ ] Light mode values also defined
- [ ] Inter font loaded via `next/font/google`
- [ ] JetBrains Mono loaded via `next/font/google` (for code/prompt contexts)

**Technical Notes:**
- See TECHNOLOGY.md §3 for exact token definitions
- See UIUX.md §10 for color coding system (block types, scores, version status, diff)

---

### 1.5 — Set Up T3 Env (Type-Safe Env Vars) [P0]

**As a** developer
**I want** type-safe environment variable validation
**So that** missing env vars cause build-time failures, not runtime crashes

**Acceptance Criteria:**
- [ ] `@t3-oss/env-nextjs` installed and configured
- [ ] Server env vars: `DATABASE_URL`, `CLERK_SECRET_KEY`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- [ ] Client env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`
- [ ] `.env.example` file with all required vars documented
- [ ] Build fails if required vars are missing

---

### 1.6 — Install Core UI Dependencies [P0]

**As a** developer
**I want** shadcn/ui initialized and core dependencies installed
**So that** we can build UI components immediately

**Acceptance Criteria:**
- [ ] shadcn/ui initialized (`pnpm dlx shadcn@latest init`)
- [ ] `components/ui/` directory created
- [ ] Initial components installed: Button, Input, Textarea, Card, Badge, Separator, Skeleton, Tooltip
- [ ] Lucide React icons installed
- [ ] Sonner (toast) installed via shadcn/ui
- [ ] All components render correctly in dark and light mode

---

### 1.7 — Set Up Storybook 8 [P1]

**As a** developer
**I want** Storybook configured for component development
**So that** we can develop and document UI components in isolation

**Acceptance Criteria:**
- [ ] Storybook 8 installed and configured for Next.js + Tailwind
- [ ] `@storybook/addon-a11y` installed
- [ ] Dark mode addon configured
- [ ] `pnpm storybook` runs without errors
- [ ] One example story created for the Button component (all variants)
- [ ] Stories load design tokens correctly (dark and light themes)

---

### 1.8 — Set Up Vitest [P1]

**As a** developer
**I want** Vitest configured for unit and integration tests
**So that** we can write tests from the start

**Acceptance Criteria:**
- [ ] Vitest installed and configured for Next.js
- [ ] `@testing-library/react` installed
- [ ] `pnpm test` and `pnpm test:watch` scripts work
- [ ] One example test passes
- [ ] Coverage reporting configured (`pnpm test:coverage`)

---

### 1.9 — Set Up Playwright [P1]

**As a** developer
**I want** Playwright configured for e2e tests
**So that** critical flows can be tested end-to-end

**Acceptance Criteria:**
- [ ] Playwright installed and configured
- [ ] `pnpm test:e2e` script works
- [ ] Desktop, tablet, and mobile viewport configs defined
- [ ] One example test (homepage loads) passes
- [ ] Screenshots directory configured for visual regression

---

### 1.10 — Project Structure Scaffold [P0]

**As a** developer
**I want** the directory structure created per the architecture plan
**So that** files have a consistent home from day one

**Acceptance Criteria:**
- [ ] Directory structure matches TECHNOLOGY.md §19:
  - `app/(auth)/`, `app/(dashboard)/`, `app/api/v1/`
  - `components/ui/`, `components/prompt/`, `components/blueprint/`, `components/coach/`, `components/layout/`
  - `lib/db/`, `lib/ai/`, `lib/auth/`, `lib/stripe/`, `lib/resolve/`, `lib/utils/`
  - `hooks/`, `stores/`, `types/`, `tests/e2e/`, `tests/unit/`
- [ ] Each directory has a `.gitkeep` or index file as placeholder
- [ ] Import paths via aliases work: `@/components/ui/button`

---

### 1.11 — Configure Vercel Project [P2]

**As a** developer
**I want** the Vercel project configured with preview deployments
**So that** every PR gets a live preview URL

**Acceptance Criteria:**
- [ ] Vercel project created and linked
- [ ] Preview deployments enabled
- [ ] Environment variables configured for preview and production
- [ ] `main` branch deploys to production
- [ ] Build succeeds on Vercel
