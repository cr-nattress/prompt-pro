# PromptVault — UI/UX Plan

## 1. Design Philosophy

**Linear meets Raycast, but for AI engineers.**

The interface is calm, dense, fast, and intelligent. Every screen prioritizes the user's content — prompts and context — not the chrome around it. AI assistance is ambient: it appears in the margins, in the gutters, in the sidebars — never blocking, always available.

**Visual identity:**
- Dark mode first, light mode supported
- Monospace for prompt content, sans-serif (Inter) for UI
- Muted backgrounds, high-contrast text, accent color used sparingly for actions and scores
- No gradients, no shadows deeper than `sm`, no decorative elements
- Information density of a code editor, approachability of a notes app

**Interaction principles:**
- Every action reachable via keyboard. Command palette (`Cmd+K`) is the power user's front door
- Optimistic UI everywhere — actions feel instant, confirmations come from the server after
- Streaming AI output renders token-by-token, never a loading spinner followed by a wall of text
- Progressive disclosure — defaults are simple, depth is one click away
- Touch targets minimum 44px on mobile, hover states only enhance (never required)

---

## 2. Information Architecture

```
PromptVault
├── Marketing / Landing Page (public, unauthenticated)
│
├── Auth
│   ├── Sign Up
│   ├── Log In
│   └── Password Reset
│
├── Onboarding (first-time user, 3 steps)
│
├── Dashboard (home after login)
│   ├── Quick Stats
│   ├── Recent Prompts/Blueprints
│   ├── Personalized Recommendations
│   └── Weekly Progress (v2)
│
├── Prompts
│   ├── Prompt List (filterable, searchable)
│   ├── Prompt Editor (create/edit)
│   │   ├── Editor Panel (CodeMirror)
│   │   ├── Metadata Panel (fields, tags, params)
│   │   ├── Analysis Panel (scores, suggestions)
│   │   └── Coach Sidebar (v2)
│   ├── Prompt Detail (read-only view, intercepting route modal)
│   └── Version History + Diff View
│
├── Blueprints
│   ├── Blueprint List
│   ├── Context Designer (create/edit)
│   │   ├── Block Stack (drag-to-reorder)
│   │   ├── Token Budget Bar
│   │   ├── Block Editor (per-block, slide-out or inline)
│   │   ├── Analysis Panel
│   │   └── Preview / Render Context
│   ├── Blueprint Detail
│   └── Version History + Diff View
│
├── Guided Builder (wizard, accessible from Prompts or Blueprints)
│
├── Playground (v2)
│   ├── Prompt Runner (single prompt)
│   ├── A/B Comparison (two versions side-by-side)
│   └── Test Suite Runner (v2)
│
├── Learn (knowledge base + education)
│   ├── Technique Cards
│   ├── Anti-Pattern Encyclopedia
│   ├── Model Guides
│   ├── Glossary
│   ├── Learning Paths (v2)
│   └── Challenges (v3)
│
├── Analytics (v2/v3)
│   ├── Usage Heatmaps
│   ├── Resolve Logs
│   └── Response Quality Tracking
│
├── Community Gallery (v3)
│
├── Settings
│   ├── Profile
│   ├── Workspace Management
│   ├── API Keys
│   ├── Billing / Plan
│   ├── Team Members (v3)
│   └── Integrations (Git Sync, Webhooks — v3)
│
└── Command Palette (overlay, accessible from anywhere)
```

---

## 3. Navigation Model

### Desktop (1024px+)

```
┌──────────────────────────────────────────────────────────────────┐
│ ┌──────┐  PromptVault    workspace-name ▾         Cmd+K    [AV] │
│ │      │                                                         │
│ │  ◆   │  ┌──────────────────────────────────────────────────┐  │
│ │ Home  │  │                                                  │  │
│ │      │  │                                                  │  │
│ │  □   │  │                                                  │  │
│ │Prompt│  │              MAIN CONTENT AREA                   │  │
│ │      │  │                                                  │  │
│ │  ▦   │  │                                                  │  │
│ │Blprnt│  │                                                  │  │
│ │      │  │                                                  │  │
│ │  ▶   │  │                                                  │  │
│ │Play  │  │                                                  │  │
│ │      │  │                                                  │  │
│ │  📖  │  │                                                  │  │
│ │Learn │  │                                                  │  │
│ │      │  │                                                  │  │
│ │      │  │                                                  │  │
│ │      │  │                                                  │  │
│ │──────│  │                                                  │  │
│ │  ⚙   │  │                                                  │  │
│ │Setng │  └──────────────────────────────────────────────────┘  │
│ └──────┘                                                         │
└──────────────────────────────────────────────────────────────────┘
```

- **Left sidebar:** 56px wide (icon-only, collapsed). Hover or click to expand to 220px with labels. Persists preference in localStorage.
- **Top bar:** Workspace switcher, global search trigger (`Cmd+K`), avatar/profile menu. Minimal — no breadcrumbs unless 3+ levels deep.
- **Main content:** Full remaining width. On editor pages, splits into resizable panels.

### Tablet (768px-1023px)

- Sidebar hidden by default, opens as overlay on hamburger tap
- Main content full width
- Secondary panels (analysis, coach) open as bottom sheets
- Same navigation items, same hierarchy

### Mobile (< 768px)

```
┌──────────────────────────┐
│  PromptVault    [K] [AV] │   ← Slim header
│                          │
│                          │
│    MAIN CONTENT AREA     │
│    (full screen)         │
│                          │
│                          │
│                          │
│                          │
├──────────────────────────┤
│  ◆    □    ▦    📖   ⚙  │   ← Bottom tab bar (5 items)
└──────────────────────────┘
```

- Bottom tab bar: Dashboard, Prompts, Blueprints, Learn, Settings
- Playground accessible from Prompts/Blueprints actions
- All secondary panels are full-screen pages or bottom sheets
- No resizable panels — single column layouts
- FAB (floating action button) for "New Prompt" / "New Blueprint" on list pages

---

## 4. Shared Component States

Every data-driven component implements these states consistently:

### Loading
- **Skeleton loaders** that match the dimensions of the content they replace
- Skeletons use `animate-pulse` on `bg-muted` rectangles
- Never a centered spinner on a blank page — always show the page structure with skeletons filling the content areas
- Streaming AI content shows a cursor/caret animation at the insertion point

### Empty
- Centered illustration (simple line art, not cartoon) + headline + description + primary CTA
- Empty states always teach — "No prompts yet" includes 3 example prompt cards the user can fork
- Empty filter results: "No prompts match your filters" with a clear-filters button

### Error
- Inline error banner (red/destructive border on the left, icon + message + retry action)
- Never a full-page error for partial failures — if the prompt list loads but analytics fails, show the list with an error banner in the analytics section
- Form field errors appear below the field in `text-destructive` with the field border turning red
- Toast notifications for transient errors (network timeout, rate limit) — auto-dismiss after 5s with undo where applicable

### Success
- Optimistic UI — the change appears instantly
- Subtle toast confirmation ("Prompt saved") — 3s auto-dismiss, bottom-right
- No success modals. No success pages. Never interrupt flow.

### Disabled
- `opacity-50` + `cursor-not-allowed` + `pointer-events-none`
- Tooltip on hover explaining why (e.g., "Upgrade to Pro to export")

---

## 5. Page-by-Page Specification

---

### 5.1 Auth Pages

**Route:** `/login`, `/signup`, `/forgot-password`

**Layout:** Centered card on a full-bleed dark background. No sidebar, no navigation. Logo at top.

**Components:** Clerk's pre-built UI components, styled via CSS variables to match our design tokens.

**Flow:**
1. `/signup` — Email/password form + Google OAuth button + GitHub OAuth button. On submit, create workspace automatically.
2. `/login` — Same form without password-confirm. "Forgot password?" link.
3. After first login ever → redirect to `/onboarding`. Subsequent logins → `/dashboard`.

**Responsive:** Card is `max-w-sm` centered horizontally and vertically. Identical on all breakpoints.

---

### 5.2 Onboarding

**Route:** `/onboarding` (only shown once per user)

**Layout:** Full-screen, centered content, no sidebar. Step indicator at top (3 dots).

**Steps:**

**Step 1 — Welcome + Workspace Setup**
- "Welcome to PromptVault" headline
- Workspace name input (pre-filled from email domain)
- "What will you use PromptVault for?" — multi-select chips: Personal projects, Work/Team, Learning prompt engineering, API/SDK integration
- Continue button

**Step 2 — First Prompt (Guided Builder)**
- Abbreviated guided builder (3 fields: role, task, output format)
- Live preview of the assembled prompt on the right (desktop) or below (mobile)
- "This is your first prompt!" encouragement text
- Save & Continue button

**Step 3 — Run Your First Analysis**
- Show the prompt they just created
- Big "Analyze" button
- Scores stream in with brief explanations
- "Apply top suggestion" button → saves improved version
- "Go to Dashboard" CTA

**Responsive:** Single column on mobile. Side-by-side (form left, preview right) on desktop for Step 2.

---

### 5.3 Dashboard

**Route:** `/dashboard`

**Layout:** Single column, scrollable. Cards in a responsive grid.

```
┌──────────────────────────────────────────────────────────────┐
│  Good morning, Chris                                         │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 34       │ │ 8        │ │ 7.2      │ │ 1,240    │       │
│  │ Prompts  │ │ Blueprnts│ │ Avg Score│ │ Resolves │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  Recent ──────────────────────────────────── [View All →]   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Blog Intro Generator  claude-sonnet  v2.1  7.8/10   │    │
│  │ Customer Reply Agent   gpt-4o        v1.0  6.2/10   │    │
│  │ Code Review Prompt     claude-opus   v3.4  8.5/10   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Recommendations ─────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 💡 Add few-shot examples to "Customer Reply Agent"  │    │
│  │    This is your most-used prompt (1,200 resolves)   │    │
│  │    but has no examples.              [Show me how →]│    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ 💡 "Code Review Prompt" may be too long (2,400 tok) │    │
│  │    3 sections could be compressed.    [Optimize →]  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [Micro-lesson banner — dismissible]                         │
│  "Tip: Prompts with defined output formats produce 40%      │
│   more consistent results. Your 'Blog Intro' prompt         │
│   doesn't specify one. [Add one →] [Dismiss]"              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Stat cards:** 4-column grid on desktop, 2x2 on tablet, single column stack on mobile. Each card: large number + label + subtle sparkline showing 7-day trend.

**Recent prompts/blueprints:** Table-like list with columns: Name, LLM, Version, Score. Rows are clickable → navigate to editor. On mobile, simplified to name + score only.

**Recommendations:** Card stack. Each card: icon + title + 1-line description + action button. Max 3 shown, expandable.

**Micro-lesson banner:** Full-width card at bottom of dashboard. Subtle background color (`bg-accent/10`). Dismissible via X. Shows once per trigger condition. "Learn more" expands inline.

**Empty state (new user, post-onboarding):**
```
┌──────────────────────────────────────────────────┐
│                                                  │
│        Your vault is ready.                      │
│        Start building your prompt library.       │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Customer │  │ Code     │  │ Blog     │      │
│  │ Support  │  │ Reviewer │  │ Writer   │      │
│  │          │  │          │  │          │      │
│  │ Fork →   │  │ Fork →   │  │ Fork →   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                  │
│  or [Create from scratch]  [Use guided builder]  │
│                                                  │
└──────────────────────────────────────────────────┘
```
Three example prompt cards across different use cases. Each shows the prompt name, purpose, and a "Fork" button that copies it to the user's vault and opens the editor.

---

### 5.4 Prompt List

**Route:** `/prompts`

**Layout:** Full-width content area with filter bar at top, scrollable list below.

```
┌──────────────────────────────────────────────────────────────┐
│  Prompts (34)                          [+ New Prompt]        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search...          LLM ▾   Purpose ▾   Tags ▾     │  │
│  │                       Sort: Last updated ▾             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ☐ Blog Intro Generator                                 │  │
│  │   claude-sonnet · v2.1 · writing · 7.8/10             │  │
│  │   "Generate engaging blog introductions..."            │  │
│  │   Updated 2 hours ago                                  │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ ☐ Customer Reply Agent                                 │  │
│  │   gpt-4o · v1.0 · support · 6.2/10                    │  │
│  │   ⚠ Low specificity — consider adding constraints     │  │
│  │   Updated yesterday                                    │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ ...                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Showing 1–20 of 34                        [← 1 2 →]        │
└──────────────────────────────────────────────────────────────┘
```

**Filter bar:**
- Search input with instant filtering (debounced 200ms, URL-synced via `nuqs`)
- Dropdown filters: LLM, Purpose, Tags (multi-select)
- Sort: Last updated, Created, Name, Score (ascending/descending)
- All filter state persists in URL for shareability and back/forward

**List items:**
- Each row: checkbox (for bulk actions) + name (bold, clickable) + metadata line (LLM badge, version badge, purpose badge, score) + description excerpt (1 line, truncated) + relative timestamp
- Inline warning badge if analysis flagged issues (e.g., "Low specificity")
- Hover: subtle background highlight. Click: navigate to editor (desktop: intercepting route opens modal over list; mobile: full page)
- Row context menu (right-click or `...` button): Duplicate, Analyze, Export, Delete

**Bulk actions bar:** Appears above list when checkboxes are selected. Actions: Delete, Export, Move to collection. Dismissible.

**Mobile:**
- Filter bar collapses to a single search input + "Filters" button that opens a bottom sheet with all filter options
- List items simplified: name + LLM badge + score. Description hidden.
- FAB at bottom-right: "+ New Prompt"
- Swipe left on a row: quick actions (Analyze, Delete)

---

### 5.5 Prompt Editor

**Route:** `/prompts/[slug]` (edit) or `/prompts/new` (create)

This is the most complex and most important screen. The user spends most of their time here.

**Desktop Layout — 3-panel:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Prompts / Blog Intro Generator                 v2.1 draft  [Save]  │
│─────────────────────────────────────────────────────────────────────────│
│  ┌───────────────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │                           │ │ METADATA         │ │ ANALYSIS        ││
│  │                           │ │                  │ │                 ││
│  │                           │ │ Title            │ │ Score: 7.8/10   ││
│  │                           │ │ [Blog Intro Gen] │ │                 ││
│  │                           │ │                  │ │ ┌───────────┐  ││
│  │   PROMPT EDITOR           │ │ Slug             │ │ │  Radar    │  ││
│  │   (CodeMirror)            │ │ [blog-intro-gen] │ │ │  Chart    │  ││
│  │                           │ │                  │ │ └───────────┘  ││
│  │   You are a {{role}}      │ │ LLM              │ │                 ││
│  │   assistant. Write a      │ │ [claude-sonnet ▾]│ │ Clarity: 8     ││
│  │   compelling blog intro   │ │                  │ │ Specificity: 7  ││
│  │   for {{topic}} that...   │ │ Purpose          │ │ Structure: 9    ││
│  │                           │ │ [writing ▾]      │ │ ...             ││
│  │                           │ │                  │ │                 ││
│  │                           │ │ Tags             │ │ Weaknesses      ││
│  │                           │ │ [blog] [content] │ │ - No output     ││
│  │                           │ │ [+ add tag]      │ │   format spec   ││
│  │                           │ │                  │ │ - Vague: "com-  ││
│  │                           │ │ Parameters       │ │   pelling" →    ││
│  │                           │ │ role: string ✱   │ │   use specific  ││
│  │                           │ │ topic: string ✱  │ │   criteria      ││
│  │                           │ │ [+ add param]    │ │                 ││
│  │                           │ │                  │ │ [Enhance →]     ││
│  │                           │ │ Version          │ │ [Expert View →] ││
│  │───────────────────────────│ │ v2.1 draft       │ │                 ││
│  │ 342 tokens · ~$0.001/call │ │ [Publish ▾]      │ │                 ││
│  └───────────────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

**Editor Panel (left, ~50% width):**
- CodeMirror 6 instance
- `{{parameters}}` highlighted with accent color, autocomplete on `{{`
- Squiggly underlines on ambiguous phrases (ambiguity detector)
- Ghost text for AI autocomplete suggestions (Tab to accept)
- Line numbers + word wrap enabled
- Footer: token count (live), estimated cost per call, LLM tokenizer selector

**Metadata Panel (center, ~25% width):**
- Form fields: Title, Slug (auto-generated from title, editable), LLM (dropdown), Purpose (dropdown), Tags (tag input), Description (textarea)
- Parameters section: auto-detected from `{{}}` in editor. Each param shows name, type, required toggle, default value. Manual "add param" for params not yet in the template.
- Version info: current version string, status badge (draft/active/stable), Publish dropdown (promote to active, promote to stable)
- Save button (top-right of page, always visible). Auto-save after 3s of inactivity (debounced).

**Analysis Panel (right, ~25% width):**
- Only shows after first analysis. Before: empty state with "Analyze" CTA
- Radar chart (6 axes) at top
- Score breakdown: each dimension with numeric score + 1-line explanation
- Weaknesses list: each item has a description + "Fix" action (auto-applies the suggestion to the editor)
- "Enhance" button: generates improved version, opens diff view
- "Expert View" button: generates annotated expert rewrite

**Panels are resizable** via drag handles between them. Sizes persist in localStorage. Any panel can be collapsed to zero width (icon button in panel header to toggle).

**Tablet:** Metadata panel becomes a collapsible section above the editor. Analysis panel becomes a bottom sheet triggered by "Analyze" button.

**Mobile:** Full-screen editor. Metadata fields in a slide-up sheet (triggered by "Details" button in header). Analysis in a separate slide-up sheet. Tab bar at bottom of editor: [Edit] [Details] [Analysis].

---

### 5.6 Guided Prompt Builder

**Route:** `/prompts/new?mode=guided` (or modal overlay)

**Layout:** Multi-step wizard. One question per step. Large, centered UI.

```
┌──────────────────────────────────────────────────────────────┐
│  Guided Builder                              Step 2 of 6     │
│  ─ ─ ● ─ ─ ─                                                │
│                                                              │
│  What task should the AI perform?                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  Write a blog introduction that hooks the reader...    │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  💡 Be specific about what "good" looks like.               │
│     Instead of "write something engaging," try              │
│     "write a 2-sentence hook that uses a surprising         │
│     statistic or counterintuitive claim."                   │
│                                                              │
│  ┌──────────── Live Preview ──────────────────────────────┐ │
│  │ You are a senior content strategist.                    │ │
│  │                                                        │ │
│  │ Write a blog introduction that hooks the reader...     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│                                    [← Back]  [Next →]        │
└──────────────────────────────────────────────────────────────┘
```

**Steps:**
1. **Role** — "What role should the AI take?" Text input + common role suggestions as chips (Expert writer, Data analyst, Customer support agent, Code reviewer)
2. **Task** — "What task should the AI perform?" Textarea. Inline tip about specificity.
3. **Input format** — "What will you provide as input?" Chips: Free text, Document/article, Data/CSV, Code, Conversation. Defines parameter structure.
4. **Output format** — "What format should the response be in?" Chips: Prose, Bullet list, JSON, Table, Code. Additional fields: max length, specific structure.
5. **Constraints** — "Any rules or constraints?" Textarea + common constraint chips: Stay factual, Don't use jargon, Be concise, Include sources. Tone selector: Professional, Friendly, Academic, Casual.
6. **Review** — Full assembled prompt in CodeMirror (editable). "Save" or "Save & Analyze" buttons.

**Live preview panel** (right side on desktop, collapsible section on mobile) shows the prompt being assembled in real-time as the user fills in each step.

Each step has a **contextual education tip** — short, relevant, dismissible. Different per step.

---

### 5.7 Blueprint List

**Route:** `/blueprints`

**Layout:** Identical structure to Prompt List, but each list item shows additional blueprint-specific info.

**List item differences from prompts:**
- Shows block count (e.g., "6 blocks") and token budget usage (e.g., "4,200 / 8,000 tokens")
- Mini block-type indicators: colored dots for each block type (system=blue, knowledge=green, examples=purple, tools=orange, history=gray, task=red)
- Status badge: draft/active/stable

---

### 5.8 Context Designer (Blueprint Editor)

**Route:** `/blueprints/[slug]` or `/blueprints/new`

The flagship screen. The visual editor for building context blueprints.

**Desktop Layout:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Blueprints / Customer Support Agent          v2.3 stable    [Save]  │
│  Target: claude-sonnet · Budget: 8,000 tokens                           │
│────────────────────────────────────────────────────────────────────────── │
│  ┌────────────────────────────────────────────────┐ ┌──────────────────┐│
│  │                                                │ │    ANALYSIS /    ││
│  │  Token Budget ━━━━━━━━━━━━━━━━░░░░░░ 62%      │ │    INSPECTOR     ││
│  │  Sys:800 Knw:2400 Ex:1200 Hst:400 Tsk:200     │ │                  ││
│  │                                                │ │  (shows details  ││
│  │  ┌─── SYSTEM ──────────────── v1.2 ────────┐  │ │   for selected   ││
│  │  │ ⋮⋮ You are a support agent for {{co...  │  │ │   block, or full ││
│  │  │    ~800 tok            [Edit] [▲▼] [···]│  │ │   blueprint      ││
│  │  └─────────────────────────────────────────┘  │ │   analysis)      ││
│  │                                                │ │                  ││
│  │  ┌─── KNOWLEDGE: Product Docs ── v3.0 ─────┐  │ │  When a block is ││
│  │  │ ⋮⋮ Source: Parameter · Priority: High    │  │ │  selected:       ││
│  │  │    Grounding: "Only reference features.."│  │ │  - Block content  ││
│  │  │    Max: 2000 tok       [Edit] [▲▼] [···]│  │ │    in CodeMirror ││
│  │  └─────────────────────────────────────────┘  │ │  - Block config  ││
│  │                                                │ │  - Block analysis││
│  │  ┌─── KNOWLEDGE: Customer Rec ── v1.1 ─────┐  │ │  - Block history ││
│  │  │ ⋮⋮ Source: Parameter · Priority: High    │  │ │                  ││
│  │  │    ⚠ No grounding instructions           │  │ │  When nothing    ││
│  │  │    ~varies tok         [Edit] [▲▼] [···]│  │ │  selected:       ││
│  │  └─────────────────────────────────────────┘  │ │  - Blueprint-wide ││
│  │                                                │ │    analysis       ││
│  │  ┌─── EXAMPLES ──────────────── v1.4 ──────┐  │ │  - Radar chart   ││
│  │  │ ⋮⋮ 3 pairs · Strategy: Most relevant    │  │ │  - Suggestions   ││
│  │  │    ~1200 tok           [Edit] [▲▼] [···]│  │ │                  ││
│  │  └─────────────────────────────────────────┘  │ │                  ││
│  │                                                │ │                  ││
│  │  ┌─── TASK ─────────────────── v2.1 ──────┐   │ │                  ││
│  │  │ ⋮⋮ Respond to: {{user_message}}         │  │ │                  ││
│  │  │    Format: text · Max: 300 words        │  │ │                  ││
│  │  │    ~200 tok            [Edit] [▲▼] [···]│  │ │                  ││
│  │  └─────────────────────────────────────────┘  │ │                  ││
│  │                                                │ │                  ││
│  │  [+ Add Block]                                 │ │                  ││
│  │                                                │ │                  ││
│  │  [Preview Context] [Test Run] [Analyze] [Pub]  │ │                  ││
│  └────────────────────────────────────────────────┘ └──────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**Block Stack (left panel, ~60% width):**

Each block is a **card** in a vertical list:
- **Drag handle** (`⋮⋮`) on the left — drag to reorder (dnd kit)
- **Type badge** with color coding: SYSTEM (blue), KNOWLEDGE (green), EXAMPLES (purple), TOOLS (orange), HISTORY (gray), TASK (red)
- **Name** (editable inline) + version badge
- **Summary line** — 1-line preview of content or key config values
- **Token count** — right-aligned, shows estimated tokens for this block
- **Warning indicator** — yellow badge if analysis flagged issues (e.g., no grounding)
- **Conditional indicator** — if block has a condition, show it as a muted label: `if {{query_type}} == "refund"`
- **Actions**: Edit (opens block in inspector panel), reorder arrows (keyboard-accessible alternative to drag), context menu (`...`): Duplicate, Delete, View history, Analyze

**Click a block** → it becomes highlighted/selected, and the inspector panel on the right shows that block's full detail.

**Token budget bar** at top of the block stack:
- Segmented horizontal bar, each segment colored by block type
- Total used / total budget
- Segments are proportional to token count
- Overflow state: bar turns red/destructive when over budget, with a warning message

**"+ Add Block" button** → dropdown with block types: System, Knowledge, Examples, Tools, History, Task. Selecting one adds a new block at the bottom with sensible defaults and opens it in the inspector.

**Inspector Panel (right panel, ~40% width):**

When a block is selected:
- **Block header**: type badge + name (editable) + version
- **Content editor**: CodeMirror instance for the block's template text
- **Config section**: type-specific form fields
  - Knowledge: source dropdown, priority dropdown, maxTokens slider, truncation strategy dropdown, grounding instructions textarea
  - Examples: pair editor (input/output text areas, add/remove pairs), selection strategy dropdown
  - History: maxTurns number input, summarization threshold, strategy dropdown
  - Tools: JSON editor for tool definitions, tool choice dropdown
  - Task: output format dropdown, max length, tone selector
- **Condition toggle**: enable/disable conditional inclusion, condition expression input
- **Block analysis**: scores + suggestions specific to this block

When no block is selected:
- Blueprint-wide analysis (if run)
- Combined radar chart (prompt + context scores)
- Blueprint-level suggestions
- Global parameters list
- Metadata fields (name, slug, target LLM, budget)

**Bottom action bar:**
- **Preview Context** — opens a full-screen modal showing the assembled context as raw text with sample parameter values filled in. Attention heatmap overlay toggle.
- **Test Run** — opens the playground with this blueprint pre-loaded
- **Analyze Blueprint** — runs full analysis, results populate the inspector panel
- **Publish Version** — version string input + change note + status selection → publish

**Tablet:** Inspector becomes a right-side sheet (slide in from right, 60% width). Block stack takes full width when inspector is closed.

**Mobile:** Block stack is full-width, simplified cards (type badge + name + token count). Tap a block → full-screen editor for that block. Actions via bottom sheet. Token budget bar is a sticky header that scrolls with the block list.

---

### 5.9 Version History & Diff View

**Route:** `/prompts/[slug]/versions` or `/blueprints/[slug]/versions`

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  Version History: Blog Intro Generator                       │
│                                                              │
│  ┌── Timeline ─────────────────────────────────────────────┐│
│  │                                                          ││
│  │  ● v2.1 (draft) — 2 hours ago                           ││
│  │    "Added output format constraint"                      ││
│  │    Score: 7.8 (+0.6)                                     ││
│  │                                                          ││
│  │  ● v2.0 (stable) — 3 days ago                           ││
│  │    "Restructured for Claude with XML tags"               ││
│  │    Score: 7.2 (+1.4)                      [Compare ▾]   ││
│  │                                                          ││
│  │  ● v1.0 (deprecated) — 2 weeks ago                      ││
│  │    "Initial version"                                     ││
│  │    Score: 5.8                                            ││
│  │                                                          ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌── Diff: v2.0 → v2.1 ───────────────────────────────────┐│
│  │  ┌──────────────────┐  ┌──────────────────┐             ││
│  │  │ v2.0 (before)    │  │ v2.1 (after)     │             ││
│  │  │                  │  │                  │             ││
│  │  │ ...              │  │ ...              │             ││
│  │  │ - deleted text - │  │ + added text +   │             ││
│  │  │ ...              │  │ ...              │             ││
│  │  └──────────────────┘  └──────────────────┘             ││
│  │                                                          ││
│  │  AI Insight: "This change added an explicit output       ││
│  │  format (JSON with 3 fields). This is likely an          ││
│  │  improvement — specificity score increased from          ││
│  │  5/10 to 7/10."                                          ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Timeline:** Vertical list, newest first. Each entry: version badge with status color, change note, relative time, score delta (green for improvement, red for regression). "Compare" button opens diff between any two versions.

**Diff view:** Side-by-side (split mode) on desktop, unified diff on mobile. Word-level highlighting. Green for additions, red for deletions. react-diff-viewer-continued.

**AI Insight (v2):** Below the diff, an AI-generated annotation explaining what changed and whether it's likely positive or negative, with reasoning.

**Promote action:** On any version, a "Promote" button to change status (draft → active → stable). Confirmation dialog explains the implications.

---

### 5.10 Playground (v2)

**Route:** `/playground`

**Layout:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Playground                                                          │
│                                                                      │
│  ┌── Prompt Selector ───────────────────────────────────────────────┐│
│  │ [Select a prompt or blueprint ▾]  or  [Paste raw prompt]         ││
│  │ acme/customer-bot/greeting@stable                                ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌── Parameters ────────────────────────────────────────────────────┐│
│  │ user_name: [Sarah        ]    plan_tier: [pro ▾]                 ││
│  │ language:  [English      ]    tone:      [professional ▾]        ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌── Model ─────────┐  ┌── Settings ─────────────────┐              │
│  │ [claude-sonnet ▾] │  │ Temperature: [0.7] Tokens: [1024]│        │
│  └──────────────────┘  └─────────────────────────────────┘          │
│                                                                      │
│                                         [Run ▶]  [A/B Compare]      │
│                                                                      │
│  ┌── Response ──────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  (AI response streams in here, token by token)                   ││
│  │                                                                  ││
│  │  Tokens: 234 · Latency: 1.2s · Cost: $0.003                     ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**A/B mode:** Split response area into two columns, each with its own model selector. Same parameters. Side-by-side output. "Which is better?" thumbs up/down on each.

**Mobile:** Single column, all sections stacked. Response area expands to full screen when streaming.

---

### 5.11 Learn (Knowledge Base)

**Route:** `/learn`

**Layout:** Left sidebar (on desktop) with category navigation, main content area for articles.

```
┌──────────────────────────────────────────────────────────────┐
│  Learn                                          🔍 Search    │
│                                                              │
│  ┌─── Categories ──┐  ┌─── Technique Cards ────────────────┐│
│  │                  │  │                                    ││
│  │  Techniques ●    │  │  ┌────────────┐ ┌────────────┐    ││
│  │  Anti-Patterns   │  │  │ Few-Shot   │ │ Chain of   │    ││
│  │  Model Guides    │  │  │ Prompting  │ │ Thought    │    ││
│  │  Glossary        │  │  │            │ │            │    ││
│  │  ──────────      │  │  │ Add to     │ │ Add to     │    ││
│  │  Learning Paths  │  │  │ prompt →   │ │ prompt →   │    ││
│  │  Challenges      │  │  └────────────┘ └────────────┘    ││
│  │                  │  │                                    ││
│  │                  │  │  ┌────────────┐ ┌────────────┐    ││
│  │                  │  │  │ Role       │ │ XML        │    ││
│  │                  │  │  │ Assignment │ │ Structuring│    ││
│  │                  │  │  └────────────┘ └────────────┘    ││
│  │                  │  │                                    ││
│  └──────────────────┘  └────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Technique Card detail page:**
- Title + 1-sentence summary
- "When to use" section
- "When NOT to use" section
- Minimal example (before/after)
- Advanced example
- Model compatibility table (which LLMs benefit most)
- **"Add to my prompt" button** — opens a modal to select which prompt to inject the pattern into, then inserts it at cursor position

**Anti-Pattern detail page:**
- Named anti-pattern with icon
- What it looks like (bad example)
- Why it's a problem
- How to fix it (good example)
- Related technique cards (cross-links)

**Learning Paths (v2):**
- List of paths with progress indicators (0/5 lessons completed)
- Each lesson: concept explanation → before/after example → hands-on exercise (apply to your own prompt) → AI feedback → completion badge

**Mobile:** Categories become horizontal scrollable tabs at top. Cards in a single-column list.

---

### 5.12 Settings

**Route:** `/settings`

**Layout:** Left sidebar navigation (Stacked list of settings sections), content area on the right.

**Sections:**

**Profile** — Name, email, avatar (from Clerk), theme toggle (dark/light/system)

**Workspace** — Name, slug, plan badge, created date. "Danger zone" for workspace deletion.

**API Keys:**
```
┌──────────────────────────────────────────────────────────────┐
│  API Keys                                  [+ Create Key]    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  production-reader                                     │  │
│  │  pk_live_xxxxx...xxxxx · Scopes: read, resolve         │  │
│  │  App: customer-bot · Last used: 2 hours ago            │  │
│  │  Expires: Never                          [Revoke]       │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  dev-full-access                                       │  │
│  │  pk_test_xxxxx...xxxxx · Scopes: read, write, resolve  │  │
│  │  App: All · Last used: yesterday                       │  │
│  │  Expires: 2025-12-31                     [Revoke]       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Create Key dialog:                                          │
│  - Label (text input)                                        │
│  - Scopes (multi-select chips: read, resolve, write, admin)  │
│  - App scope (dropdown: All apps, or specific app)           │
│  - Expiration (None, 30 days, 90 days, 1 year, custom date)  │
│  → Shows key ONCE after creation (copy button, warning)      │
└──────────────────────────────────────────────────────────────┘
```

**Billing** — Current plan card, usage meters (prompts used, API resolves this month, analyses this month), upgrade CTA for free users. "Manage subscription" button → Stripe Customer Portal.

**Team Members (v3)** — Invite by email, role assignment (admin, editor, viewer), list of current members.

**Mobile:** Settings sections as a stacked list on the main page. Tap a section → full-screen page for that section. No sidebar.

---

## 6. AI-Native UX Patterns

These patterns define how AI features are presented throughout the app.

### 6.1 Streaming Output
All AI-generated content renders progressively:
- Token-by-token text appearance with a blinking cursor at the insertion point
- Structured data (scores, suggestions) renders section-by-section: first the overall score appears, then individual dimensions fill in, then weaknesses populate
- No loading spinner → streaming text. The transition from "waiting" to "receiving" is the text itself appearing.

### 6.2 Inline Suggestions (Ghost Text)
In the prompt editor:
- After 2s of inactivity, the AI generates a completion suggestion
- Appears as dimmed/muted text after the cursor position
- `Tab` to accept, keep typing to dismiss
- `Esc` to dismiss explicitly
- Never appears while the user is actively typing
- Configurable: on/off in settings

### 6.3 Margin Annotations
The analysis panel isn't the only way feedback appears:
- **Ambiguity underlines:** squiggly yellow underlines on flagged phrases directly in the editor. Hover to see the issue and suggested replacement. Click to apply fix.
- **Score badges in lists:** each prompt in the list view shows its score. Color-coded: green (8+), yellow (5-7), red (< 5).
- **Warning badges on blocks:** in the context designer, blocks with issues show a yellow warning icon. Hover for a tooltip with the issue summary.

### 6.4 One-Click Actions
AI suggestions always come with a direct action:
- "Low specificity" → "Add constraints" button that inserts a template constraint section
- "No output format" → "Add format instruction" button with format selector
- "Try few-shot" → "Generate examples" button that creates and inserts examples
- Actions are always reversible (undo via `Cmd+Z` or version history)

### 6.5 Micro-Lesson Delivery
Micro-lessons appear as:
- **Inline banners** in the dashboard (full-width card, subtle background)
- **Tooltips with depth** in the editor (hover a field label → short tip, click "Learn more" → expand to full lesson)
- **Margin notes** in the analysis panel (next to relevant scores)
- **Bottom sheets** on mobile (triggered by the same conditions, presented as dismissible sheets)

All micro-lessons share:
- Dismissible via X (never shown again for same trigger)
- "Learn more" link to the relevant knowledge base entry
- Contextual — only appear when relevant to what the user is doing right now
- Progressive — depth adapts to the user's skill profile

---

## 7. Command Palette

**Trigger:** `Cmd+K` (Mac) / `Ctrl+K` (Windows). Also accessible via search icon in header.

```
┌──────────────────────────────────────────────────┐
│  🔍 Type a command or search...                  │
│──────────────────────────────────────────────────│
│  Recent                                          │
│  → Blog Intro Generator                  prompt  │
│  → Customer Support Agent              blueprint  │
│                                                  │
│  Actions                                         │
│  → New Prompt                           Cmd+N    │
│  → New Blueprint                     Cmd+Shift+N │
│  → Analyze current prompt               Cmd+A    │
│  → Switch workspace                              │
│  → Open settings                        Cmd+,    │
│                                                  │
│  Navigation                                      │
│  → Dashboard                                     │
│  → Prompts                                       │
│  → Blueprints                                    │
│  → Learn                                         │
│                                                  │
│  Search results update as you type...            │
└──────────────────────────────────────────────────┘
```

- Fuzzy search across: prompt names, blueprint names, actions, navigation, settings, knowledge base articles
- Keyboard navigation: up/down arrows, Enter to select, Esc to close
- Nested subcommands: type "new" → shows "New Prompt" and "New Blueprint"
- Recent items at top
- Context-aware: when in the editor, shows "Analyze", "Enhance", "Publish" actions
- On mobile: triggered by tapping the search icon or swiping down on any page

---

## 8. Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command palette | `Cmd+K` |
| New prompt | `Cmd+N` |
| New blueprint | `Cmd+Shift+N` |
| Save | `Cmd+S` |
| Analyze | `Cmd+Shift+A` |
| Enhance | `Cmd+Shift+E` |
| Settings | `Cmd+,` |
| Close panel/modal | `Esc` |
| Navigate to Dashboard | `G` then `D` |
| Navigate to Prompts | `G` then `P` |
| Navigate to Blueprints | `G` then `B` |
| Navigate to Learn | `G` then `L` |
| Toggle sidebar | `Cmd+\` |
| Toggle coach mode | `Cmd+Shift+C` |
| Accept AI suggestion | `Tab` |
| Dismiss AI suggestion | `Esc` |

Shortcuts displayed in command palette and tooltips. Discoverable, not required.

---

## 9. Toast & Notification Patterns

**Sonner** (via shadcn/ui) for all toasts. Bottom-right position on desktop, bottom-center on mobile.

| Scenario | Type | Duration | Action |
|----------|------|----------|--------|
| Prompt saved | Success | 3s auto-dismiss | None |
| Analysis complete | Success | 5s | "View results" link |
| Enhancement ready | Success | 5s | "View diff" link |
| Version published | Success | 3s | None |
| API key created | Success | Persistent | "Copy key" button |
| Save failed (network) | Error | Persistent | "Retry" button |
| Rate limited | Warning | 5s | "Upgrade" link |
| Analysis quota reached | Warning | Persistent | "Upgrade plan" link |
| Prompt deleted | Destructive | 5s | "Undo" button |
| Item forked from gallery | Info | 3s | "Open" link |

---

## 10. Color Coding System

Consistent color semantics used everywhere:

**Block types:**
| Type | Color | Usage |
|------|-------|-------|
| System | `blue-500` | Block badges, token bar segments, icons |
| Knowledge | `green-500` | Block badges, token bar segments, icons |
| Examples | `purple-500` | Block badges, token bar segments, icons |
| Tools | `orange-500` | Block badges, token bar segments, icons |
| History | `gray-400` | Block badges, token bar segments, icons |
| Task | `red-500` | Block badges, token bar segments, icons |

**Scores:**
| Range | Color | Label |
|-------|-------|-------|
| 8-10 | `green-500` | Good |
| 5-7 | `yellow-500` | Fair |
| 1-4 | `red-500` | Needs work |

**Version status:**
| Status | Color | Badge style |
|--------|-------|-------------|
| Draft | `gray-400` | Outline badge |
| Active | `blue-500` | Solid badge |
| Stable | `green-500` | Solid badge |
| Deprecated | `red-500` | Strikethrough text |

**Diff:**
| Change | Color |
|--------|-------|
| Added | `green-500/20` background |
| Removed | `red-500/20` background |
| Modified | `yellow-500/20` background |

---

## 11. Responsive Breakpoint Behaviors

| Component | Desktop (1024px+) | Tablet (768-1023px) | Mobile (< 768px) |
|-----------|-------------------|---------------------|-------------------|
| Navigation | Left sidebar (56px collapsed / 220px expanded) | Overlay sidebar on hamburger | Bottom tab bar (5 items) |
| Prompt Editor | 3 resizable panels (editor + metadata + analysis) | Editor full-width + metadata collapsible + analysis as bottom sheet | Full-screen editor + tab switcher (Edit / Details / Analysis) |
| Context Designer | Block stack + inspector panel (resizable) | Block stack full-width + inspector as right sheet | Block stack full-width, tap block → full-screen editor |
| Dashboard | 4-column stat cards + multi-column layout | 2-column stat cards | Single column, stacked |
| List pages | Table-like rows with all columns | Simplified rows (fewer columns) | Card-style rows (name + badges + score) |
| Diff view | Side-by-side (split) | Side-by-side (narrower) | Unified diff (single column) |
| Command palette | Centered modal (max-w-lg) | Same | Same, slightly wider |
| Modals/Dialogs | Centered overlay (max-w-md to max-w-2xl) | Same | Full-screen sheet from bottom |
| Guided builder | Side-by-side (form + preview) | Same (narrower) | Stacked (form above, preview collapsed) |
| Knowledge base | Sidebar nav + content | Sidebar as horizontal tabs | Horizontal tabs |
| Settings | Sidebar nav + content | Same (narrower) | List → tap → full-screen section |

---

## 12. Accessibility Specification

### Focus Management
- All interactive elements are reachable via Tab
- Modals and sheets trap focus (Radix handles this)
- Focus returns to trigger element on modal close
- Skip-to-main-content link as first focusable element
- Focus-visible outlines use `ring-2 ring-ring ring-offset-2` (visible only on keyboard navigation, not mouse clicks)

### ARIA
- `aria-label` on icon-only buttons (e.g., sidebar collapse toggle, block reorder buttons)
- `aria-live="polite"` on toast container, analysis results area, and token counter
- `aria-expanded` on collapsible sections (sidebar, accordion, block details)
- `role="status"` on streaming AI output container
- `role="alert"` on error messages
- `aria-describedby` linking form fields to their error messages and hints

### Keyboard
- Arrow keys navigate within menus, lists, and block stacks
- `Escape` closes modals, sheets, command palette, and dismisses AI suggestions
- `Enter` activates buttons and selects command palette items
- `Space` toggles checkboxes, switches, and accordions
- Drag-and-drop has keyboard alternative (select block → arrow keys to move, Enter to confirm)

### Color and Contrast
- All text meets WCAG AA contrast (4.5:1 for body text, 3:1 for large text)
- Score colors are never the sole indicator — always paired with numeric values and labels
- Block type colors paired with text labels and distinct icons
- `prefers-reduced-motion` disables animations (skeleton pulse, streaming cursor, panel transitions)

### Screen Readers
- Page titles reflect current location (e.g., "Blog Intro Generator - Prompts - PromptVault")
- Loading states announced: "Loading prompts" → "34 prompts loaded"
- Analysis results announced: "Analysis complete. Overall score: 7.8 out of 10"
- Toasts announced via `aria-live`

---

## 13. Component Library (shadcn/ui + Custom)

### From shadcn/ui (install and customize)

| Component | Primary Usage |
|-----------|--------------|
| Button | All actions (primary, secondary, outline, ghost, destructive variants) |
| Input | Text fields throughout forms |
| Textarea | Description fields, prompt text (non-CodeMirror contexts) |
| Select | LLM picker, purpose picker, sort order, block type |
| Switch | Toggles (coach mode, conditional blocks, dark mode) |
| Checkbox | Bulk selection in lists, settings toggles |
| Slider | Token budget, temperature setting |
| Dialog | Confirmations (delete, publish), API key display |
| Sheet | Mobile panels, block inspector on tablet |
| Popover | Filter dropdowns, parameter configuration |
| Tooltip | Icon button labels, field hints, score explanations |
| DropdownMenu | Row context menus, publish actions, user menu |
| Command | Command palette (cmdk) |
| Tabs | Editor panel switcher (mobile), settings sections, learn categories |
| Accordion | FAQ, block config sections, analysis detail expansion |
| Collapsible | Metadata panel collapse, sidebar sections |
| Card | Dashboard stats, prompt list items, technique cards |
| Badge | Version status, LLM label, purpose tag, score, block type |
| Avatar | User profile (header) |
| Separator | Section dividers |
| Table | API key list, audit log, analytics data |
| Skeleton | All loading states |
| Sonner/Toast | All notifications |
| Form | All form containers (with React Hook Form) |
| Resizable | Panel layouts (editor, designer) |

### Custom Components (built on top of shadcn/ui)

| Component | Description |
|-----------|-------------|
| `PromptEditor` | CodeMirror 6 wrapper with custom extensions (parameter highlighting, ambiguity underlines, ghost text, token count gutter). Accepts value, onChange, parameters schema, analysisResult |
| `BlockStack` | Vertical sortable list of `BlockCard` components. dnd kit for reorder. Accepts blocks[], onReorder, onSelect |
| `BlockCard` | Collapsed view of a context block. Shows type badge, name, summary, token count, warning indicator. Click to select/expand |
| `BlockInspector` | Full editing panel for a selected block. CodeMirror for content, type-specific config form, per-block analysis results |
| `TokenBudgetBar` | Segmented progress bar showing token allocation by block type. Props: blocks[], totalBudget |
| `ScoreRadar` | Recharts radar chart for multi-dimensional scores. Accepts scores object (prompt scores, context scores) |
| `ScoreBreakdown` | Vertical list of individual score dimensions with bar visualization, numeric value, and explanation |
| `DiffViewer` | Wrapper around react-diff-viewer-continued. Props: oldValue, newValue, splitView |
| `GuidedBuilder` | Multi-step wizard component. Manages step state, renders step content, live preview panel |
| `MicroLesson` | Dismissible inline education card. Props: trigger, title, body, learnMoreUrl, onDismiss |
| `SkillProfile` | Visual display of user's skill dimensions. Bar chart or radar chart variant. Props: promptSkills, contextSkills |
| `ParameterEditor` | Form for defining prompt parameters. Auto-detects from template text. Shows name, type, required toggle, default value per param |
| `TagInput` | Multi-value input for tags. Chip display, autocomplete from existing tags, keyboard navigation |
| `VersionTimeline` | Vertical timeline of version history entries. Each entry: version badge, change note, score delta, timestamp, actions |
| `CommandPalette` | Wrapper around cmdk that registers all actions, navigation, and search. Context-aware based on current route |
| `AnalysisPanel` | Complete analysis display: radar chart + score breakdown + weaknesses + suggestions + enhance/expert buttons. Handles streaming state |
| `PlaygroundRunner` | Prompt executor with parameter inputs, model selector, settings, and streaming response area |
| `CoachSidebar` | Right-side panel (v2) with live AI suggestions. Three mode states: active, subtle, off |

---

## 14. Animation & Motion Spec

All motion is subtle and purposeful. No decorative animation.

| Interaction | Motion | Duration | Easing |
|-------------|--------|----------|--------|
| Panel resize | Width/height interpolation | Real-time (drag) | None |
| Sidebar expand/collapse | Width from 56px to 220px | 200ms | ease-out-expo |
| Modal open | Fade in (opacity 0→1) + scale (0.95→1) | 200ms | ease-out-expo |
| Modal close | Fade out + scale (1→0.95) | 150ms | ease-in |
| Sheet open (mobile) | Slide up from bottom | 300ms | ease-out-expo |
| Sheet close | Slide down | 200ms | ease-in |
| Toast appear | Slide in from right + fade | 200ms | ease-out |
| Toast dismiss | Slide out right + fade | 150ms | ease-in |
| Block reorder (drag) | Block follows cursor, others shift with 200ms transition | 200ms | ease-out |
| Skeleton pulse | Opacity 0.5 → 1 → 0.5 | 1.5s loop | ease-in-out |
| AI streaming cursor | Blinking cursor at text insertion point | 500ms blink | step |
| Ghost text appear | Fade in (opacity 0→0.4) | 300ms | ease-out |
| Score fill (radar chart) | Radial segments animate from 0 to value | 500ms, staggered by 50ms per axis | ease-out |
| Token budget bar | Segments grow from left to right | 300ms | ease-out |
| Hover on list row | Background opacity 0→0.05 | 100ms | linear |
| Button press | Scale 1→0.98→1 | 100ms | ease-out |
| Tab switch content | Fade + translate (outgoing slides left, incoming slides right) | 200ms | ease-out |

`prefers-reduced-motion`: All animations duration → 0ms. Streaming text appears instantly in chunks rather than token-by-token.

---

## 15. Empty States

Every list and data-driven view has a designed empty state.

| Location | Headline | Description | CTA |
|----------|----------|-------------|-----|
| Dashboard (new user) | "Your vault is ready." | "Start building your prompt library." | 3 example prompts to fork + "Create from scratch" + "Use guided builder" |
| Prompt list | "No prompts yet" | "Store, analyze, and optimize your LLM prompts." | "Create your first prompt" + "Try the guided builder" |
| Blueprint list | "No blueprints yet" | "Design complete context windows for your LLM applications." | "Create your first blueprint" + "What's a blueprint?" link |
| Search results (no match) | "No results for '{query}'" | "Try adjusting your filters or search terms." | "Clear all filters" button |
| Analysis panel (not yet run) | "No analysis yet" | "Analyze your prompt to get scores, feedback, and improvement suggestions." | "Analyze" button |
| Version history (v1 only) | "This is the first version" | "Edit your prompt and save changes to build a version history." | None |
| API keys | "No API keys" | "Create an API key to access PromptVault from your applications." | "Create API key" button |
| Coach sidebar (disabled) | "Coach is off" | "Enable the AI coach for real-time suggestions while you write." | "Turn on" toggle |

---

## 16. Error Handling UX

| Error Type | UI Treatment |
|-----------|--------------|
| **Form validation** | Red border on field + error message below field. Errors appear on blur (not on every keystroke). Submit button stays enabled but shows all errors on click. |
| **Server error (save/create)** | Toast error: "Failed to save. [Retry]". Form stays populated — no data loss. |
| **Network offline** | Persistent banner at top of page: "You're offline. Changes will sync when reconnected." Auto-save queues changes. |
| **Rate limited** | Toast warning: "Rate limit reached. Try again in {X} seconds." Timer countdown on the action button. |
| **Quota exceeded** | Inline card replacing the action: "You've used all 5 free analyses this month. [Upgrade to Pro →]" |
| **AI analysis failed** | Inline error in analysis panel: "Analysis failed. This can happen with very long prompts. [Try again] or [Try with a shorter prompt]" |
| **Permission denied** | Toast error: "You don't have permission for this action." No redirect — user stays where they are. |
| **404 (prompt not found)** | Full-page: "Prompt not found. It may have been deleted or moved. [Go to prompts list →]" |
| **Concurrent edit conflict** | Modal: "This prompt was edited by {user} while you were working. [Keep mine] [Keep theirs] [View diff]" |

---

## 17. Freemium Gating UX

When a user hits a plan limit:

- **Soft limits (approaching):** Subtle banner on relevant page: "You've used 4 of 5 free analyses this month."
- **Hard limits (reached):** The action button becomes disabled. Tooltip explains: "Free plan limit reached." Below the disabled button: "Upgrade to Pro for 100 analyses/month. [$12/mo →]"
- **Feature locks:** Features not available on the current plan show a lock icon. Clicking them opens an upgrade modal with a feature comparison table and CTA.
- **Never block core functionality** — users can always create and edit prompts. Only AI analysis, API access, export, and advanced features are gated.
- **No nag screens** — limits are communicated inline, at the point of interaction, not as interstitial popups.

---

## 18. Phase Build Order (UI/UX)

### Phase 1 — MVP (Weeks 1-8)

**Week 1-2: Foundation**
- Auth pages (Clerk integration)
- App shell (sidebar, header, layout, routing)
- Dashboard (static layout, stat cards)
- Command palette (cmdk, basic navigation actions)
- Theme setup (dark/light, design tokens, globals.css)

**Week 3: Lists + CRUD**
- Prompt list page (search, filter, sort, pagination)
- Prompt editor page (CodeMirror setup, metadata form, parameter detection)
- Blueprint list page
- Create/edit/delete flows with optimistic UI
- Empty states for all list views

**Week 4: Context Designer + Analysis**
- Context Designer: block stack, drag-to-reorder, token budget bar
- Block inspector panel (per-block editing and config)
- AI analysis integration (streaming scores into analysis panel)
- Score radar chart, score breakdown component

**Week 5: Enhancement + Version History**
- Enhance flow (generate improved version, diff view)
- Version history timeline
- Diff viewer (side-by-side)
- Guided prompt builder (wizard)

**Week 6: Billing + Onboarding**
- Settings pages (profile, workspace, API keys, billing)
- Stripe integration (checkout, portal, webhooks)
- Freemium gating UI
- Onboarding flow (3-step wizard)

**Week 7-8: Education + Polish**
- Micro-lesson system (20 triggers, inline banners)
- Knowledge base (technique cards, anti-patterns, glossary)
- Field-level hints throughout forms
- Ambiguity detector underlines in editor
- Token counter in editor footer
- Responsive pass on all screens (tablet + mobile)
- Loading, empty, and error states for all views
- Accessibility audit (axe, keyboard navigation, screen reader)

### Phase 2 — v2 (Weeks 9-14)

- Prompt playground (single run + A/B comparison)
- Real-time prompt coach sidebar
- Skill profile dashboard (visible)
- Personalized recommendations dashboard
- Learning paths (first 2 paths)
- Before/after showcase
- Expert rewrite with annotations
- Prompt linter (configurable rules)
- Test suite runner
- Context simulation (render full context, attention heatmap)
- Version comparison AI insights

### Phase 3 — v3 (Weeks 15-20)

- Community gallery (browse, fork, rate)
- Prompt challenges (scenarios, scoring, expert solutions)
- Advanced learning paths
- Prompt chains / pipelines visual editor
- Team features (invite, roles, shared workspaces)
- Git sync settings
- Usage analytics and heatmaps
- Audit log viewer
- Export (JSON, YAML, CSV, Markdown)
- Webhook configuration
