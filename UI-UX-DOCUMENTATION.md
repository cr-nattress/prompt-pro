```md
# Claude Code Prompt — Add AI-Friendly Comments, Metadata, and UI/UX Documentation (React + Node + TypeScript)

You are an expert senior engineer + UX-minded architect. Your job is to upgrade this repo so an AI agent (and humans) can reliably understand, modify, and validate UI/UX changes without guessing.

## Non-Negotiables
- Do not change product behavior unless explicitly required to add states/tests/docs.
- Prefer additive changes. If you must refactor, keep diffs small and mechanical.
- No “documentation theater”: every doc/metadata addition must be actionable and referenced by code, stories, tests, or CI.
- Follow existing repo conventions (package manager, formatting, lint rules). Do not introduce new frameworks unless necessary.
- If Storybook/Playwright/Chromatic already exist, extend them. If not, add the minimal scaffolding.

---

## Step 0 — Repo Recon (Required)
1. Inspect repo structure and list:
   - frontend apps/packages (React)
   - backend services (Node)
   - shared packages (types, UI libs, utils)
   - current tooling: ESLint, Prettier, Stylelint, Storybook, Playwright/Cypress, Testing Library/Jest/Vitest, etc.
2. Identify:
   - key user flows / routes (top 5)
   - top 10 reusable UI components
   - styling system (Tailwind / CSS Modules / styled-components / MUI / etc.)
   - design tokens (if any)
3. Output a brief plan (bullets) of what you will implement and where.

Then implement the plan.

---

## Goal
Implement AI-readable “signals” across code comments, component metadata, Storybook, docs, and guardrails—especially for UI/UX work.

This includes:
- Component intent comments + UX constraints
- Standardized JSDoc blocks for components and props
- Per-component metadata (“design contracts”)
- A docs structure for design + UX patterns + AI guidelines
- Storybook stories that cover UI states (default/loading/empty/error/long text/mobile)
- Accessibility guardrails (eslint jsx-a11y, a11y notes, focus rules)
- Visual regression / snapshot strategy (if feasible with existing toolchain)
- A PR/DoD checklist for UI changes
- “Known landmines” doc for tricky UI mechanics

---

## Deliverables (Create/Update)
### A) Documentation (add under `docs/`)
Create these files (or merge into existing docs structure if it exists):
1. `docs/ai/ai-guidelines.md`
   - How to propose UI changes
   - Required validations: storybook + tests + a11y + snapshots
   - How to update docs alongside code
2. `docs/ai/ux-checklist.md`
   - Responsive, a11y, empty/loading/error states, i18n considerations, perf basics
3. `docs/ai/definition-of-done.md`
   - A concise DoD for UI/UX changes with checkboxes
4. `docs/design/tokens.md`
   - Spacing scale, typography scale, colors, radii, elevation (use existing tokens if present)
5. `docs/design/components.md`
   - Canonical usage for Button/Input/Modal/Toast/Table/etc. (use what exists)
6. `docs/design/patterns.md`
   - Empty states, loading states, error states, pagination/filtering patterns
7. `docs/design/content.md`
   - Microcopy tone rules + error message templates
8. `docs/ui-landmines.md`
   - z-index/layers, modals/portals, focus traps, scroll locking, virtualization, SSR hydration issues (whatever applies)

Also update `README.md` (or create a short section) linking to these docs.

### B) Code Comment & Metadata Standard
Implement a standard “design contract” block for React components:
- Add a JSDoc header at the top of each major component file (at least for top 10 shared components and top 5 pages/routes).
- Include fields:
  - INTENT (1–2 lines)
  - UX_CONSTRAINTS (bullets)
  - STATES (loading/empty/error/success)
  - A11Y (keyboard/focus/aria expectations)
  - RESPONSIVE (breakpoints/layout rules)
  - ANALYTICS (events fired, if any)
  - PITFALLS (things likely to break)

Example format (adapt as needed):
/**
 * INTENT: ...
 * UX_CONSTRAINTS:
 * - ...
 * STATES:
 * - loading: ...
 * A11Y:
 * - ...
 * RESPONSIVE:
 * - ...
 * ANALYTICS:
 * - ...
 * PITFALLS:
 * - ...
 */

Also add prop-level JSDoc for key props that encode UX meaning (e.g., `variant`, `density`, `tone`, `primaryAction`).

### C) Storybook (Preferred)
If Storybook exists:
- For the top 10 reusable UI components, ensure stories cover:
  - default
  - loading
  - empty (if applicable)
  - error (if applicable)
  - disabled
  - long text / overflow
  - small viewport (mobile) layout
  - focus/keyboard state (documented; use play tests if already used)
- Add story descriptions that reference the “design contract” expectations.

If Storybook does not exist:
- Add minimal Storybook setup for the frontend package(s).
- Add stories for at least 5 key shared components first, then expand as time allows.

### D) Testing + UX Guardrails
- Add/extend tests for at least the top 3 flows and top 5 components:
  - a11y basics (aria attributes, focus order where relevant)
  - state coverage (loading/empty/error)
  - responsive layout rules if testable (or documented in stories)
- Add `eslint-plugin-jsx-a11y` if not present and configure conservatively.
- If Playwright exists, add at least one “golden path” e2e test per top flow.

### E) Repo Metadata / Contribution Guardrails
- Update or create `CONTRIBUTING.md`:
  - UI PR checklist (must include: story updates, state coverage, a11y check, screenshots/visual diffs if available)
- Add a `docs/` index in the main README.
- Add “no UI without a story” guidance where reasonable (if Storybook exists).

### F) Optional: Visual Regression
If the repo already uses Chromatic or snapshotting:
- Extend it to cover the new stories.
If it doesn’t:
- Do NOT force a paid service.
- Prefer free/local options (Playwright screenshot tests) if Playwright is already present.

---

## Scope Guidance: What to Touch
- Prioritize:
  1) shared design system components
  2) high-traffic pages/routes
  3) common interaction components: Button/Input/Modal/Toast/Dropdown/Table/Card
- Avoid sweeping rewrites.
- Do not re-style the entire app. Your mission is “signals + guardrails,” not redesign.

---

## Output Requirements
When you’re done, provide:
1. A list of files added/changed (grouped by docs/code/stories/tests/config).
2. A brief “How to use this” section for future contributors and AI agents.
3. Any tradeoffs or follow-ups you recommend.

Now proceed. Start with Step 0 (Repo Recon), then implement.
```
