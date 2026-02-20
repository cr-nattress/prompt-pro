# Epic 14 — Responsive, Accessibility & Polish

**Phase:** 1 (MVP)
**Estimated:** Week 8
**Dependencies:** All Phase 1 epics (01-13)
**References:** UIUX.md §4, §11, §12, §14, §15, §16; TECHNOLOGY.md §17

## Goal

Final polish pass across all MVP screens: ensure responsive layouts work correctly at all breakpoints, meet accessibility standards, and all states (loading, empty, error) are implemented consistently.

---

## Stories

### 14.1 — Responsive Audit — Desktop [P0]

**As a** desktop user
**I want** all screens to render correctly at 1024px+
**So that** the full experience works on my laptop/monitor

**Acceptance Criteria:**
- [ ] All pages verified at 1024px, 1280px, 1440px, 1920px
- [ ] Resizable panels work correctly (sidebar, editor panels, designer panels)
- [ ] No horizontal scrolling on any page
- [ ] Typography scale and spacing consistent
- [ ] Modals/dialogs render as centered overlays

---

### 14.2 — Responsive Audit — Tablet [P0]

**As a** tablet user
**I want** all screens adapted for 768-1023px
**So that** I can use PromptVault on my tablet

**Acceptance Criteria:**
- [ ] Sidebar switches to overlay mode
- [ ] Prompt editor: metadata panel becomes collapsible section, analysis becomes bottom sheet
- [ ] Context designer: inspector becomes right-side sheet
- [ ] Dashboard: 2-column stat cards
- [ ] List pages: slightly simplified rows (fewer columns)
- [ ] Diff view: side-by-side still works (narrower)
- [ ] Guided builder: side-by-side (narrower)
- [ ] Settings: sidebar navigation narrower but still present
- [ ] All modals render correctly

---

### 14.3 — Responsive Audit — Mobile [P0]

**As a** mobile user
**I want** all screens optimized for < 768px
**So that** I can use PromptVault on my phone

**Acceptance Criteria:**
- [ ] Bottom tab bar renders and navigates correctly
- [ ] Prompt editor: full-screen editor with tab switcher (Edit/Details/Analysis)
- [ ] Context designer: block stack full-width, tap block → full-screen editor
- [ ] Dashboard: single column stack
- [ ] List pages: card-style rows, FAB for create actions
- [ ] Diff view: unified diff (single column)
- [ ] Guided builder: stacked layout (form above, preview collapsed/below)
- [ ] Command palette: wider, same centered modal
- [ ] All modals become full-screen bottom sheets
- [ ] Knowledge base: horizontal scrollable tabs instead of sidebar
- [ ] Settings: list → tap → full-screen section
- [ ] Touch targets minimum 44px throughout

---

### 14.4 — Loading States Audit [P0]

**As a** user
**I want** consistent loading states across all views
**So that** I always know the app is working

**Acceptance Criteria:**
- [ ] Every data-driven component has a skeleton loading state
- [ ] Skeletons match the dimensions of content they replace
- [ ] `animate-pulse` on `bg-muted` rectangles
- [ ] No centered spinner on blank page — always show page structure with skeletons
- [ ] Streaming AI content shows cursor animation at insertion point
- [ ] Loading state announced to screen readers ("Loading prompts")

---

### 14.5 — Error States Audit [P0]

**As a** user
**I want** consistent error handling across all views
**So that** I understand what went wrong and can recover

**Acceptance Criteria:**
- [ ] All error types handled per UIUX.md §16:
  - Form validation: red border + error message below field (on blur)
  - Server errors: toast with retry
  - Network offline: persistent top banner
  - Rate limited: toast warning with countdown
  - Quota exceeded: inline card replacing the action with upgrade CTA
  - AI analysis failed: inline error in panel with retry
  - Permission denied: toast error
  - 404: full-page with navigation back
- [ ] No data loss on errors — forms stay populated
- [ ] Error messages are user-friendly (no technical jargon, no error codes displayed)

---

### 14.6 — Empty States Audit [P0]

**As a** user
**I want** all empty states designed and implemented
**So that** blank pages guide me to the next action

**Acceptance Criteria:**
- [ ] All empty states from UIUX.md §15 implemented:
  - Dashboard (new user), Prompt list, Blueprint list, Search results (no match), Analysis panel (not yet run), Version history (v1 only), API keys, Coach sidebar (disabled)
- [ ] Each empty state: headline + description + primary CTA
- [ ] Teaching empty states include example content to fork or explore
- [ ] Empty filter results have a "Clear all filters" button

---

### 14.7 — Accessibility Audit — Focus Management [P0]

**As a** keyboard user
**I want** focus managed correctly throughout the app
**So that** I can navigate without a mouse

**Acceptance Criteria:**
- [ ] All interactive elements reachable via Tab
- [ ] Focus order follows visual order
- [ ] Modals and sheets trap focus (via Radix)
- [ ] Focus returns to trigger element on modal close
- [ ] Skip-to-main-content link as first focusable element
- [ ] Focus-visible outlines: `ring-2 ring-ring ring-offset-2` (keyboard only, not mouse)

---

### 14.8 — Accessibility Audit — ARIA & Screen Readers [P0]

**As a** screen reader user
**I want** proper ARIA attributes and announcements
**So that** I can use PromptVault with assistive technology

**Acceptance Criteria:**
- [ ] `aria-label` on all icon-only buttons
- [ ] `aria-live="polite"` on toast container, analysis results, token counter
- [ ] `aria-expanded` on collapsible sections
- [ ] `role="status"` on streaming AI output
- [ ] `role="alert"` on error messages
- [ ] `aria-describedby` linking form fields to errors/hints
- [ ] Page titles reflect current location ("Blog Intro Generator - Prompts - PromptVault")
- [ ] Loading/completion states announced

---

### 14.9 — Accessibility Audit — Color & Contrast [P0]

**As a** user with visual impairments
**I want** sufficient color contrast and non-color indicators
**So that** I can read and understand all content

**Acceptance Criteria:**
- [ ] All text meets WCAG AA contrast ratios (4.5:1 body, 3:1 large text)
- [ ] Scores never rely on color alone — always paired with numeric values and labels
- [ ] Block type colors paired with text labels and distinct icons
- [ ] `prefers-reduced-motion` respected — disables animations (skeleton pulse, streaming cursor, panel transitions)

---

### 14.10 — Install eslint-plugin-jsx-a11y [P1]

**As a** developer
**I want** static a11y analysis in the linter
**So that** accessibility issues are caught during development

**Acceptance Criteria:**
- [ ] `eslint-plugin-jsx-a11y` installed (supplementing Biome if needed)
- [ ] Configured conservatively (recommended ruleset, not strict)
- [ ] No existing violations in codebase
- [ ] Runs as part of the pre-commit hook

---

### 14.11 — Animation & Motion Polish [P1]

**As a** user
**I want** subtle, consistent animations throughout the app
**So that** interactions feel polished and responsive

**Acceptance Criteria:**
- [ ] All animations from UIUX.md §14 implemented:
  - Sidebar expand/collapse: 200ms ease-out-expo
  - Modal open/close: fade + scale
  - Sheet slide up/down
  - Toast appear/dismiss
  - Skeleton pulse
  - Ghost text fade-in
  - Score radar chart fill animation
  - Token budget bar grow
  - Hover/press states
  - Tab switch content fade + translate
- [ ] `prefers-reduced-motion`: all durations → 0ms
- [ ] No decorative animations — all motion is purposeful

---

### 14.12 — Playwright E2E Tests for Critical Flows [P1]

**As a** developer
**I want** e2e tests for the top 3 user flows
**So that** regressions are caught automatically

**Acceptance Criteria:**
- [ ] **Flow 1 — Create prompt:** Login → Navigate to prompts → Create new → Fill form → Save → Verify in list
- [ ] **Flow 2 — Analyze prompt:** Open prompt → Click Analyze → Verify scores appear → Click Enhance → Verify diff view
- [ ] **Flow 3 — Create blueprint:** Navigate to blueprints → Create new → Add blocks → Reorder → Save → Verify
- [ ] Tests run at desktop, tablet, and mobile viewports
- [ ] Tests pass consistently in CI
