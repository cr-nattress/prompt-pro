# PromptVault — Technology Stack & UI/UX Architecture

## Design Philosophy

**Simple. Fast. Intelligent.**

The UI should feel like Linear meets Raycast — minimal chrome, fast interactions, keyboard-first, with AI woven into every surface. No clutter, no feature overload on screen. Progressive disclosure: show the simple thing first, reveal depth on demand.

**Core principles:**
- **Density without clutter** — information-rich but visually calm
- **Speed is a feature** — every interaction should feel instant (optimistic UI, streaming, edge rendering)
- **AI-native** — AI assistance is ambient, not bolted on; suggestions appear in context, not behind a button
- **Responsive by default** — single codebase, fluid layouts, touch-friendly targets; works on phone, tablet, and desktop without compromise
- **Dark mode first** — designed for dark, adapted for light; engineers and power users live in dark mode
- **Keyboard-driven** — command palette, shortcuts for every action, vim-style navigation optional

---

## 1. Core Framework

### Next.js 15 (App Router)
The foundation. Server Components, Server Actions, Streaming, Parallel Routes, Intercepting Routes.

| Capability | How We Use It |
|-----------|--------------|
| React Server Components | Data fetching at the component level, zero client JS for static content. Dashboard, prompt lists, knowledge base pages are all server-rendered |
| Server Actions | Form submissions (create/edit prompts, blueprints) without API route boilerplate. Validated with Zod on the server |
| Streaming + Suspense | AI analysis results stream in token-by-token. Blueprint resolve previews render progressively |
| Parallel Routes | Dashboard panels load independently. Analysis sidebar loads without blocking the editor |
| Intercepting Routes | Prompt detail opens as a modal over the list on desktop, full page on mobile |
| Route Handlers | REST API endpoints (`/api/v1/*`) for the public API consumed by SDKs and external apps |
| Middleware | Auth checks, API key validation, rate limiting at the edge |
| Metadata API | Dynamic OG images for shared prompts, SEO for public gallery |

**Why not:** Remix (less ecosystem for our needs), SvelteKit (team expertise), Astro (not enough interactivity).

### TypeScript (Strict Mode)
Everything is TypeScript. Strict mode enabled. No `any` allowed in application code. Shared types between frontend, backend, and SDK packages.

```
tsconfig.json:
  "strict": true
  "noUncheckedIndexedAccess": true
  "exactOptionalPropertyTypes": true
```

### Node.js 22+ (Runtime)
LTS runtime for API route handlers, Server Actions, and SDK. Native `fetch`, `crypto.subtle`, structured clone, and Web Streams support.

---

## 2. Styling & Design System

### Tailwind CSS v4
Utility-first styling. No custom CSS files for 95% of the app. Tailwind v4 brings CSS-first config, automatic content detection, and native cascade layers.

**Why Tailwind:**
- Co-locates style with markup — AI agents can read and modify styles without jumping between files
- Design tokens enforced through config — consistent spacing, colors, typography
- Tiny production CSS — only ships what's used
- Responsive utilities built in (`sm:`, `md:`, `lg:`, `xl:`)
- Dark mode via `dark:` variant with class strategy

### shadcn/ui
Not a component library — a collection of copy-paste, fully customizable components built on Radix UI primitives. You own every line of code.

**Why shadcn/ui over a full component library:**
- Full control over every component — no fighting library opinions
- Built on Radix UI (best-in-class accessibility primitives)
- Tailwind-native — consistent with the rest of the styling
- AI-friendly — components live in your codebase as plain React files, easy for AI to read and modify
- Actively maintained with a large ecosystem

**Components we'll use from shadcn/ui:**
- `Button`, `Input`, `Textarea`, `Select`, `Switch`, `Checkbox`, `Slider`
- `Dialog`, `Sheet` (mobile drawers), `Popover`, `Tooltip`, `Dropdown Menu`, `Command` (command palette)
- `Tabs`, `Accordion`, `Collapsible`
- `Card`, `Badge`, `Avatar`, `Separator`
- `Table`, `Data Table` (with TanStack Table)
- `Form` (with React Hook Form + Zod)
- `Toast` / `Sonner` (notifications)
- `Skeleton` (loading states)
- `Resizable` (panel layouts)

### Radix UI Primitives
The accessibility layer underneath shadcn/ui. Handles focus management, keyboard navigation, ARIA attributes, screen reader announcements, scroll locking, and portal rendering. We never build modals, dropdowns, or popovers from scratch.

### Lucide Icons
Clean, consistent, open-source icon set. Tree-shakeable — only ships the icons used. Matches the shadcn/ui aesthetic.

### CSS Architecture

```
globals.css          — Tailwind directives, CSS custom properties (design tokens), base resets
tailwind.config.ts   — Design token definitions (colors, spacing, typography, radii, shadows)
components/ui/*      — shadcn/ui components (Tailwind classes)
app/**/*.tsx         — Page-level styles via Tailwind utilities
```

No CSS Modules. No styled-components. No CSS-in-JS runtime. One styling paradigm.

---

## 3. Design Tokens & Theming

Defined in `tailwind.config.ts` and mirrored as CSS custom properties for runtime access.

### Color System
HSL-based with CSS custom properties for theme switching. Semantic color names, not raw values.

```
--background        --foreground
--card              --card-foreground
--popover           --popover-foreground
--primary           --primary-foreground
--secondary         --secondary-foreground
--muted             --muted-foreground
--accent            --accent-foreground
--destructive       --destructive-foreground
--border            --input            --ring
--chart-1 ... --chart-5 (for data visualization)
```

Dark mode: swap CSS custom property values via `.dark` class on `<html>`. No JavaScript runtime cost.

### Typography
System font stack for body text (fast, native feel). Monospace for code/prompt editing.

```
--font-sans:  "Inter", ui-sans-serif, system-ui, sans-serif
--font-mono:  "JetBrains Mono", "Fira Code", ui-monospace, monospace
```

**Type scale:** 12px / 14px / 16px / 18px / 20px / 24px / 30px / 36px. No more than 4 sizes on any single screen.

### Spacing
4px base unit. Scale: 0 / 1 (4px) / 2 (8px) / 3 (12px) / 4 (16px) / 5 (20px) / 6 (24px) / 8 (32px) / 10 (40px) / 12 (48px) / 16 (64px) / 20 (80px).

### Border Radius
```
--radius-sm: 0.375rem   (6px — inputs, badges)
--radius-md: 0.5rem     (8px — cards, buttons)
--radius-lg: 0.75rem    (12px — dialogs, panels)
--radius-xl: 1rem       (16px — large containers)
```

### Motion
Subtle, purposeful. Never decorative.

```
--duration-fast:    100ms   (hover states, toggles)
--duration-normal:  200ms   (panels, menus)
--duration-slow:    300ms   (page transitions, modals)
--easing-default:   cubic-bezier(0.16, 1, 0.3, 1)  (ease-out-expo — snappy, natural)
```

---

## 4. Layout & Responsive Strategy

### Layout Architecture

**Desktop (1024px+):** Sidebar navigation + main content area + optional right panel (analysis/coach). Resizable panels.

**Tablet (768px-1023px):** Collapsible sidebar (overlay), full-width content, bottom sheet for secondary panels.

**Mobile (< 768px):** Bottom tab navigation, full-screen pages, swipe gestures, bottom sheets for actions.

### Implementation

**Resizable Panels:** `react-resizable-panels` — drag-to-resize sidebar and analysis panel on desktop. Persists sizes to localStorage.

**Container Queries:** CSS `@container` queries for component-level responsiveness. Components adapt to their container, not the viewport — critical for the blueprint designer where blocks live inside panels of varying widths.

**Fluid Typography & Spacing:** `clamp()` for key measurements that scale smoothly between breakpoints rather than jumping.

```css
font-size: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
```

### Navigation

| Surface | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Primary nav | Left sidebar (collapsible) | Overlay sidebar | Bottom tab bar |
| Secondary nav | Tabs within content area | Same | Same |
| Actions | Top bar + keyboard shortcuts | Top bar | Bottom sheet / FAB |
| Command palette | `Cmd+K` | `Cmd+K` | Swipe down or button |

---

## 5. Interactive Components

### Code/Prompt Editor — CodeMirror 6
The prompt/template editing experience is central to the product. CodeMirror 6 provides:

- **Syntax highlighting** for `{{parameter}}` placeholders (custom language mode)
- **Bracket/tag matching** for XML-tagged prompts
- **Line numbers and word wrap**
- **Search and replace**
- **Multiple cursors**
- **Mobile support** — works on touch devices (unlike Monaco)
- **Lightweight** — modular architecture, only load what we use (~50KB vs Monaco's ~2MB)
- **Accessible** — proper ARIA, keyboard navigation, screen reader support
- **Theming** — matches our dark/light themes via CSS

**Custom extensions we'll build:**
- Parameter highlighting and autocomplete (`{{` triggers dropdown of defined params)
- Token count gutter (live count per line, total in footer)
- Ambiguity detector underlines (squiggly underlines on flagged phrases)
- Inline AI suggestions (ghost text, accept with Tab)
- Block boundary markers for the Context Designer

**Why not Monaco:** Too heavy (2MB+), poor mobile support, overkill for prompt editing. CodeMirror 6 gives us everything we need at a fraction of the bundle size.

### Drag and Drop — dnd kit
For reordering Context Blocks in the Blueprint Designer. `@dnd-kit/core` + `@dnd-kit/sortable`.

- Keyboard-accessible drag and drop (a11y requirement)
- Touch support for mobile/tablet
- Smooth animations during reorder
- Lightweight (~12KB)

### Charts & Data Visualization — Recharts
For the radar chart (prompt/context scores), token budget bar, usage analytics, skill profile visualization.

- Built on D3 but with a React-declarative API
- Responsive and SSR-compatible
- Composable — we build custom chart components
- Lightweight compared to full D3

### Diff View — react-diff-viewer-continued
For side-by-side prompt version comparison and the "before/after" enhancement view.

- Syntax highlighting support
- Split and unified diff modes
- Word-level diff highlighting
- Dark mode support

### Markdown Rendering — react-markdown + rehype/remark
For knowledge base articles, micro-lessons, technique cards, and AI-generated analysis explanations.

- `remark-gfm` for GitHub-flavored Markdown (tables, task lists, strikethrough)
- `rehype-highlight` for code block syntax highlighting
- `rehype-sanitize` for safe rendering of user content

### Command Palette — cmdk
The `Cmd+K` experience. Built by Pacocoursey (same creator as sonner/vaul). Integrated into shadcn/ui.

- Fuzzy search across prompts, blueprints, actions, settings
- Nested subcommands (e.g., `Cmd+K` > "Create" > "New Blueprint")
- Recent items, keyboard-driven navigation
- Extensible — actions register themselves

---

## 6. State Management

### Server State — React Server Components + TanStack Query

**Server Components** handle initial data loading — no loading spinners for first paint. Pages render with data on the server.

**TanStack Query (React Query v5)** handles client-side async state:
- Automatic caching and deduplication
- Background refetching (stale-while-revalidate)
- Optimistic updates (save prompt -> immediately show in list -> confirm with server)
- Infinite scroll pagination
- Mutation management with rollback
- Devtools for debugging

### Client State — Zustand
Minimal client-side state that doesn't belong on the server:

- Editor state (current cursor position, undo history)
- UI preferences (sidebar collapsed, panel sizes, coach mode)
- Transient form state that hasn't been submitted
- Command palette open/closed state

**Why Zustand:** ~1KB, no boilerplate, no providers, no context hell. Just a hook.

```typescript
const useEditorStore = create<EditorState>((set) => ({
  activeBlockId: null,
  coachMode: 'subtle',
  setActiveBlock: (id) => set({ activeBlockId: id }),
  setCoachMode: (mode) => set({ coachMode: mode }),
}))
```

### URL State — nuqs
Search, filter, and pagination state lives in the URL via `nuqs` (type-safe search params for Next.js).

- Shareable URLs (`/prompts?llm=claude&tag=support&sort=updated`)
- Back/forward navigation preserves filter state
- Server-side compatible — filters can be read in Server Components
- Type-safe with Zod schemas

---

## 7. Forms & Validation

### React Hook Form + Zod

**React Hook Form:** Minimal re-renders, uncontrolled inputs by default, excellent performance for complex forms (the blueprint editor has many nested fields).

**Zod:** Schema validation shared between client and server. The same Zod schema validates the form in the browser AND the Server Action on the backend AND the API endpoint.

```typescript
// Shared schema — used by form, server action, and API route
const promptSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  llm: z.enum(['claude-sonnet', 'claude-opus', 'gpt-4o', 'gemini-pro']),
  templateText: z.string().min(1),
  parameterSchema: z.record(z.unknown()).optional(),
  tags: z.array(z.string()).max(20),
})
```

Integration via `@hookform/resolvers/zod` for automatic form validation.

---

## 8. Authentication

### Clerk
Managed auth with a modern, customizable UI. Handles the complexity so we don't build it.

| Feature | How It Helps |
|---------|-------------|
| Email + password | Basic signup/login |
| OAuth (Google, GitHub) | One-click social login |
| Multi-factor auth | Security for team/enterprise users |
| Organization support | Maps directly to our Workspace concept |
| API key management | Extensible for our scoped API key system |
| Session management | Server-side and edge-compatible |
| Customizable UI components | Match our design system via CSS variables |
| Webhook events | User created/updated/deleted sync to our DB |
| Rate limiting | Built-in brute force protection |

**Why Clerk over NextAuth/Auth.js:** Clerk handles the entire auth UX (signup pages, profile management, organization switching) so we focus on the product. NextAuth gives you auth primitives; Clerk gives you a complete auth product. For a SaaS app with workspaces and teams, Clerk saves weeks of work.

Clerk's `<ClerkProvider>` wraps the app. `auth()` and `currentUser()` in Server Components. Middleware protects routes.

---

## 9. Database

### PostgreSQL via Neon
Serverless Postgres that scales to zero. Branching for preview deployments.

| Feature | Why It Matters |
|---------|---------------|
| Serverless | No connection pool management, auto-scaling |
| Branching | Each PR gets its own database branch (like Git for databases) |
| Scale to zero | No cost when idle — critical for a new SaaS |
| Edge-compatible | Neon's serverless driver works at the edge |
| Full Postgres | JSONB for flexible schema fields, full-text search, CTEs, window functions |

### Drizzle ORM
Type-safe, SQL-like ORM. Lighter than Prisma, closer to SQL.

**Why Drizzle over Prisma:**
- No binary engine — smaller deployments, faster cold starts on serverless
- SQL-like syntax — what you write looks like what runs
- Better edge compatibility
- Relational queries with explicit joins (no magic)
- Schema defined in TypeScript — no separate schema file, no code generation step
- Drizzle Kit for migrations

```typescript
export const prompts = pgTable('prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id').references(() => apps.id),
  slug: varchar('slug', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  parameterSchema: jsonb('parameter_schema'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

---

## 10. AI Integration

### Anthropic Claude API (via Vercel AI SDK)
The primary AI backend for analysis, enhancement, and coaching.

### Vercel AI SDK
The unified interface for AI interactions. Provides streaming, structured output, and multi-provider support.

| Feature | How We Use It |
|---------|--------------|
| `streamText()` | Stream analysis results and AI coach suggestions to the UI in real-time |
| `generateObject()` | Get structured JSON for prompt scores, weakness analysis, parameter schema generation |
| `streamObject()` | Stream structured analysis results progressively |
| `useChat()` hook | Power the prompt playground's conversation interface |
| `useCompletion()` hook | Inline AI suggestions in the editor (ghost text) |
| Multi-provider | Support Claude, GPT-4o, Gemini for the playground (test against multiple LLMs) |
| Tool calling | Let the AI analysis engine call tools (e.g., count tokens, check formatting rules) |

**AI-powered features and their implementation:**

| Feature | AI Method | Notes |
|---------|-----------|-------|
| Prompt analysis (scoring) | `generateObject()` with Claude | Returns structured JSON with scores + explanations |
| One-click enhance | `streamText()` with Claude | Streams improved prompt in real-time |
| Smart autocomplete | `useCompletion()` with Claude Haiku | Fast, cheap, inline suggestions |
| Prompt coach | `streamText()` with Claude | Sidebar analysis triggered on pause |
| "Expert rewrite" | `streamText()` with Claude | Annotated rewrite with explanations |
| Few-shot generator | `generateObject()` with Claude | Structured example pairs |
| Ambiguity detector | Deterministic rules + Claude fallback | Rules catch common cases; Claude handles edge cases |
| Token counting | `tiktoken` (local) | No API call needed — runs client-side |

### Token Counting — tiktoken (via js-tiktoken)
Client-side token counting for Claude, GPT, and Gemini tokenizers. Runs in the browser for instant feedback in the editor. WASM-based, fast.

---

## 11. Payments

### Stripe
Subscription billing for Free/Pro/Team tiers.

- **Stripe Checkout** — hosted payment page (PCI compliant, no card handling)
- **Stripe Customer Portal** — self-service subscription management
- **Stripe Webhooks** — sync subscription status to our database
- **Metered billing** (future) — for API resolve usage beyond tier limits

Integration via `stripe` Node.js SDK on the server. No Stripe.js on the client for MVP (Checkout handles it).

---

## 12. API & SDK

### REST API
Next.js Route Handlers at `/api/v1/*`. Standard REST conventions.

- JSON request/response
- API key auth via `Authorization: Bearer <key>` header
- Rate limiting via Upstash Redis (`@upstash/ratelimit`)
- Request validation with Zod
- Consistent error format: `{ error: { code, message, details } }`
- Versioned URL path (`/v1/`)

### Upstash Redis
Serverless Redis for rate limiting and caching.

- Rate limiting on API endpoints (per API key, sliding window)
- Cache frequently resolved prompts (reduce DB reads)
- Session storage if needed
- Serverless — no connection management, HTTP-based

### SDK Packages
- `@promptvault/sdk` — Node.js/TypeScript SDK (published to npm)
- `promptvault` — Python SDK (published to PyPI)

Both are thin wrappers around the REST API with type-safe methods and built-in retry/caching.

---

## 13. Testing

### Vitest
Unit and integration tests. Fast, ESM-native, Vite-powered.

- Component tests with `@testing-library/react`
- API route handler tests
- Zod schema tests
- Utility function tests
- Coverage reporting

### Playwright
End-to-end tests for critical user flows.

- Auth flow (signup, login, OAuth)
- Prompt CRUD (create, edit, delete, search)
- Blueprint designer (add blocks, reorder, configure)
- AI analysis flow (analyze, view scores, enhance)
- API key management
- Responsive testing (desktop, tablet, mobile viewports)
- Visual regression screenshots

### Storybook 8
Component development and documentation environment.

- Every shared UI component has stories
- State coverage: default, loading, empty, error, disabled, overflow, mobile
- Accessibility addon (`@storybook/addon-a11y`) — automated a11y checks on every story
- Dark mode addon — verify both themes
- Design contract metadata in story descriptions
- Interaction tests via `play` functions

---

## 14. Code Quality & DX

### Biome
Linting and formatting in one tool. Replaces ESLint + Prettier with a single, faster binary.

- Linting rules comparable to ESLint recommended + TypeScript strict
- Formatting on save (Prettier-compatible output)
- ~100x faster than ESLint + Prettier
- Single config file (`biome.json`)
- Import sorting built-in

If Biome's JSX a11y rules are insufficient, supplement with `eslint-plugin-jsx-a11y` as a targeted addition.

### Husky + lint-staged
Pre-commit hooks to enforce quality before code reaches the repo.

- `lint-staged` runs Biome on staged files only (fast)
- Type checking on commit (`tsc --noEmit`)
- Prevents broken code from being committed

### T3 Env
Type-safe environment variables. No more `process.env.MAYBE_UNDEFINED`.

```typescript
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    ANTHROPIC_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
})
```

Fails at build time if env vars are missing. Type-safe access everywhere.

---

## 15. Deployment & Infrastructure

### Vercel
Primary hosting. Optimized for Next.js.

| Feature | How We Use It |
|---------|--------------|
| Edge Functions | Middleware (auth, rate limiting, API key validation) |
| Serverless Functions | API routes, Server Actions |
| Edge Network | Global CDN for static assets and ISR pages |
| Preview Deployments | Every PR gets a unique URL for review |
| Analytics | Web Vitals, traffic, performance monitoring |
| Cron Jobs | Scheduled tasks (usage report emails, drift detection) |
| Blob Storage | File uploads if needed (prompt attachments) |

### Neon Database Branching + Vercel
Each preview deployment gets its own Neon database branch. Reviewers test against real data without affecting production.

---

## 16. Monitoring & Observability

### Sentry
Error tracking and performance monitoring.

- Frontend error boundaries with Sentry reporting
- Server-side error capture in API routes and Server Actions
- Performance tracing (identify slow API calls, DB queries)
- Session replay for debugging UI issues
- Release tracking tied to Vercel deployments

### Vercel Analytics
Built-in Web Vitals and usage analytics.

- Core Web Vitals (LCP, FID, CLS) per route
- Real user monitoring (RUM)
- Audience and traffic analytics

---

## 17. Accessibility (a11y)

Accessibility is not optional. PromptVault must be usable by everyone.

### Built-in via Radix UI
- Focus management (focus traps in modals, return focus on close)
- Keyboard navigation (arrow keys in menus, Escape to close, Tab order)
- ARIA attributes (roles, labels, descriptions, live regions)
- Screen reader announcements (toast notifications, loading states, analysis results)

### Additional Measures
- `eslint-plugin-jsx-a11y` for static analysis
- Storybook a11y addon for per-component checks
- Playwright axe tests for automated a11y audits on critical flows
- Color contrast ratios enforced in design tokens (WCAG AA minimum, AAA for text)
- Reduced motion support via `prefers-reduced-motion` media query
- Skip-to-content link
- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<aside>`, `<section>`)

---

## 18. Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| First Contentful Paint | < 1.0s | Server Components, edge rendering, minimal client JS |
| Largest Contentful Paint | < 2.0s | Streaming, Suspense boundaries, image optimization |
| Time to Interactive | < 2.5s | Code splitting, dynamic imports for heavy components |
| Total JS bundle (initial) | < 150KB gzipped | Tree shaking, dynamic imports, server-only code |
| CLS | < 0.05 | Skeleton loaders sized to match content, stable layouts |
| API response (resolve) | < 100ms p95 | Redis caching, prepared queries, edge proximity |

### Code Splitting Strategy
- CodeMirror loaded dynamically (only on editor pages)
- Recharts loaded dynamically (only on analytics/dashboard)
- Diff viewer loaded dynamically (only on version comparison)
- Storybook/dev tools excluded from production build
- Route-based code splitting via Next.js App Router (automatic)

---

## 19. Project Structure

```
prompt-vault/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup) — no sidebar layout
│   ├── (dashboard)/              # Authenticated pages — sidebar layout
│   │   ├── dashboard/            # Main dashboard
│   │   ├── prompts/              # Prompt list and editor
│   │   ├── blueprints/           # Blueprint designer
│   │   ├── playground/           # Prompt testing playground
│   │   ├── analytics/            # Usage analytics
│   │   ├── learn/                # Learning paths, knowledge base
│   │   └── settings/             # Workspace, API keys, billing
│   ├── api/v1/                   # Public REST API
│   │   ├── auth/
│   │   ├── apps/
│   │   ├── resolve/
│   │   └── analyze/
│   ├── layout.tsx                # Root layout (providers, fonts)
│   └── globals.css               # Tailwind directives, CSS vars
├── components/
│   ├── ui/                       # shadcn/ui components (Button, Input, etc.)
│   ├── prompt/                   # Prompt-specific components (editor, analyzer)
│   ├── blueprint/                # Blueprint designer components
│   ├── coach/                    # AI coach sidebar components
│   └── layout/                   # Sidebar, header, command palette
├── lib/
│   ├── db/                       # Drizzle schema, queries, migrations
│   ├── ai/                       # AI integration (analysis, enhancement)
│   ├── auth/                     # Clerk helpers
│   ├── stripe/                   # Billing helpers
│   ├── resolve/                  # Template resolution engine
│   └── utils/                    # Shared utilities
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # Shared TypeScript types
├── public/                       # Static assets
├── tests/
│   ├── e2e/                      # Playwright tests
│   └── unit/                     # Vitest tests
├── .storybook/                   # Storybook config
├── drizzle/                      # DB migrations
├── tailwind.config.ts
├── biome.json
├── next.config.ts
└── package.json
```

---

## 20. Package Manager

### pnpm
Fast, disk-efficient, strict dependency resolution. Monorepo-ready if we split out the SDK as a separate package.

---

## 21. Full Technology Summary

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Full-stack React framework |
| **Language** | TypeScript (strict) | Type safety everywhere |
| **Runtime** | Node.js 22+ | Server-side execution |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Components** | shadcn/ui + Radix UI | Accessible, customizable UI primitives |
| **Icons** | Lucide | Consistent icon set |
| **Editor** | CodeMirror 6 | Prompt/template editing |
| **Drag & Drop** | dnd kit | Block reordering in blueprint designer |
| **Charts** | Recharts | Score radar charts, analytics |
| **Diff View** | react-diff-viewer-continued | Version comparison |
| **Markdown** | react-markdown + rehype/remark | Knowledge base rendering |
| **Command Palette** | cmdk | Cmd+K search and actions |
| **Panels** | react-resizable-panels | Resizable layout panels |
| **Animations** | Tailwind transitions + Framer Motion (selective) | Micro-interactions, page transitions |
| **Server State** | TanStack Query v5 | Client-side async state management |
| **Client State** | Zustand | Minimal client state |
| **URL State** | nuqs | Type-safe search params |
| **Forms** | React Hook Form + Zod | Validated forms with shared schemas |
| **Auth** | Clerk | Managed authentication + organizations |
| **Database** | PostgreSQL (Neon) | Serverless relational database |
| **ORM** | Drizzle | Type-safe, SQL-like database access |
| **AI** | Anthropic Claude API + Vercel AI SDK | Analysis, enhancement, coaching |
| **Tokens** | js-tiktoken | Client-side token counting |
| **Payments** | Stripe | Subscription billing |
| **Cache/Rate Limit** | Upstash Redis | API rate limiting, caching |
| **Hosting** | Vercel | Edge deployment, preview URLs |
| **Error Tracking** | Sentry | Error and performance monitoring |
| **Analytics** | Vercel Analytics | Web Vitals, traffic |
| **Testing (Unit)** | Vitest + Testing Library | Component and logic tests |
| **Testing (E2E)** | Playwright | End-to-end browser tests |
| **Testing (Visual)** | Storybook 8 | Component development + visual review |
| **Linting/Format** | Biome | Fast linting + formatting |
| **Git Hooks** | Husky + lint-staged | Pre-commit quality checks |
| **Env Vars** | T3 Env | Type-safe environment variables |
| **Package Manager** | pnpm | Fast, strict dependency management |
