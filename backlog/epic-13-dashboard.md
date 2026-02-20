# Epic 13 — Dashboard

**Phase:** 1 (MVP)
**Estimated:** Week 7-8
**Dependencies:** Epic 03 (Database), Epic 04 (App Shell), Epic 05 (Prompts), Epic 06 (Blueprints), Epic 09 (Analysis)
**References:** UIUX.md §5.3; PLAN.md §3 (Dashboard)

## Goal

Build the dashboard — the user's home screen showing stats, recent items, and personalized recommendations.

---

## Stories

### 13.1 — Dashboard Layout [P0]

**As a** user
**I want** a dashboard that gives me an overview of my vault
**So that** I can see what's important at a glance

**Acceptance Criteria:**
- [ ] Route: `/dashboard`
- [ ] Greeting: "Good morning/afternoon/evening, {firstName}"
- [ ] Single column scrollable layout
- [ ] Sections: Stats cards → Recent items → Recommendations → Micro-lesson banner
- [ ] Server-rendered for fast first paint (React Server Component)

---

### 13.2 — Stat Cards [P0]

**As a** user
**I want** to see key metrics about my vault
**So that** I have a quick pulse on my prompt library

**Acceptance Criteria:**
- [ ] 4 stat cards in a responsive grid:
  - Total Prompts (count)
  - Total Blueprints (count)
  - Average Score (across all analyzed prompts, 1 decimal)
  - Resolves this Month (count from resolve logs)
- [ ] Each card: large number + label
- [ ] **Desktop:** 4-column grid
- [ ] **Tablet:** 2x2 grid
- [ ] **Mobile:** single column stack
- [ ] Loading state: skeleton with correct dimensions

---

### 13.3 — Recent Items [P0]

**As a** user
**I want** to see my recently edited prompts and blueprints
**So that** I can quickly resume work

**Acceptance Criteria:**
- [ ] "Recent" section with "View All" link
- [ ] Table-like list showing last 5 items (prompts and blueprints mixed, sorted by updatedAt)
- [ ] Columns: Name (clickable), LLM badge, Version, Score (if analyzed)
- [ ] Click navigates to the editor
- [ ] **Mobile:** simplified to name + score only

---

### 13.4 — Recommendations Section [P1]

**As a** user
**I want** personalized recommendations based on my prompts
**So that** I know what to improve next

**Acceptance Criteria:**
- [ ] "Recommendations" section below recent items
- [ ] Card stack showing up to 3 recommendations
- [ ] Each card: icon + title + 1-line description + action button
- [ ] Recommendation types:
  - Prompts with low scores that could be improved
  - Prompts used frequently (high resolves) but never analyzed
  - Prompts missing common best practices (no output format, no examples)
  - Knowledge blocks without grounding instructions
- [ ] Action buttons navigate to the relevant prompt/blueprint editor
- [ ] Recommendations driven by deterministic rules (not AI calls)
- [ ] Section hidden if no recommendations available

---

### 13.5 — Dashboard Micro-Lesson Banner [P1]

**As a** user
**I want** a contextual learning tip on my dashboard
**So that** I learn something useful each time I visit

**Acceptance Criteria:**
- [ ] Full-width card at bottom of dashboard
- [ ] Subtle background color (`bg-accent/10`)
- [ ] Shows one micro-lesson based on trigger conditions
- [ ] Dismissible via X
- [ ] "Learn more" expands inline or links to knowledge base
- [ ] Only one lesson shown at a time
- [ ] Uses the micro-lesson system from Epic 12

---

### 13.6 — Dashboard Empty State [P0]

**As a** new user post-onboarding
**I want** a helpful empty state instead of a blank dashboard
**So that** I know what to do next

**Acceptance Criteria:**
- [ ] Shows when user has 0-1 prompts (onboarding prompt may exist)
- [ ] "Your vault is ready" headline + "Start building your prompt library" description
- [ ] 3 example prompt cards: Customer Support, Code Reviewer, Blog Writer
- [ ] Each card: prompt name, purpose, "Fork" button
- [ ] Forking copies the example to user's vault and opens editor
- [ ] Additional CTAs: "Create from scratch", "Use guided builder"
- [ ] Matches UIUX.md §5.3 empty state wireframe
