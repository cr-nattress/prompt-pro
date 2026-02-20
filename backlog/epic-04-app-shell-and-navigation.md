# Epic 04 — App Shell & Navigation

**Phase:** 1 (MVP)
**Estimated:** Week 2
**Dependencies:** Epic 01 (Project Foundation), Epic 02 (Auth)
**References:** UIUX.md §3, §7, §8, §14; TECHNOLOGY.md §4, §5 (cmdk)

## Goal

Build the authenticated app shell — sidebar, header, command palette, and responsive layout — that frames all content pages.

---

## Stories

### 4.1 — Dashboard Layout Shell [P0]

**As a** user
**I want** a consistent app layout with sidebar and header
**So that** I can navigate between all sections of the app

**Acceptance Criteria:**
- [ ] `app/(dashboard)/layout.tsx` renders:
  - Left sidebar (navigation)
  - Top header bar
  - Main content area (children)
- [ ] Layout uses `react-resizable-panels` for sidebar + content split on desktop
- [ ] Main content area takes remaining width after sidebar
- [ ] Clean visual appearance matching UIUX.md §3 wireframes

---

### 4.2 — Sidebar Navigation [P0]

**As a** user
**I want** a sidebar with navigation links
**So that** I can access all app sections

**Acceptance Criteria:**
- [ ] **Desktop (1024px+):** Sidebar renders at 56px width (icon-only collapsed). Hover or click to expand to 220px with labels.
- [ ] Collapsed/expanded preference persisted in localStorage
- [ ] Navigation items: Dashboard, Prompts, Blueprints, Playground (v2 — disabled/hidden for MVP), Learn, Settings
- [ ] Active route highlighted with accent background
- [ ] Icons from Lucide for each nav item
- [ ] Settings pinned to bottom of sidebar
- [ ] **Tablet (768-1023px):** Sidebar hidden by default, opens as overlay on hamburger button tap
- [ ] **Mobile (< 768px):** Sidebar replaced by bottom tab bar with 5 items: Dashboard, Prompts, Blueprints, Learn, Settings

**Technical Notes:**
- Use Zustand store for sidebar open/collapsed state
- Bottom tab bar is a separate component, conditionally rendered based on viewport

---

### 4.3 — Top Header Bar [P0]

**As a** user
**I want** a minimal header bar with workspace switcher, search trigger, and profile
**So that** I can access global actions from any page

**Acceptance Criteria:**
- [ ] Header renders on all authenticated pages
- [ ] Left: logo/wordmark + workspace name (clickable → workspace switcher from Epic 02)
- [ ] Center/right: search trigger button showing `Cmd+K` shortcut hint
- [ ] Right: user avatar → profile dropdown (from Epic 02)
- [ ] No breadcrumbs unless 3+ levels deep in navigation hierarchy
- [ ] Header is minimal — not crowded

---

### 4.4 — Command Palette [P0]

**As a** user
**I want** a `Cmd+K` command palette for quick navigation and actions
**So that** I can access anything in the app with keyboard

**Acceptance Criteria:**
- [ ] `cmdk` (via shadcn/ui Command component) integrated
- [ ] Triggered by `Cmd+K` (Mac) / `Ctrl+K` (Windows)
- [ ] Also accessible via search icon in header
- [ ] Sections: Recent items, Actions, Navigation
- [ ] **Navigation items:** Dashboard, Prompts, Blueprints, Learn, Settings
- [ ] **Action items:** New Prompt, New Blueprint, Open Settings
- [ ] Fuzzy search across all items
- [ ] Keyboard navigation: up/down arrows, Enter to select, Esc to close
- [ ] Centered modal overlay (`max-w-lg`) with backdrop
- [ ] On mobile: triggered by tapping search icon or dedicated button
- [ ] Context-aware: shows different actions based on current page (to be extended in later epics)

**Technical Notes:**
- Register actions via a hook so each page/feature can add its own commands
- Use `cmdk` directly from shadcn/ui's Command component

---

### 4.5 — Keyboard Shortcuts System [P1]

**As a** power user
**I want** global keyboard shortcuts for common actions
**So that** I can navigate and act without touching the mouse

**Acceptance Criteria:**
- [ ] Global shortcut listener registered at the app shell level
- [ ] Implemented shortcuts:
  - `Cmd+K` — Command palette
  - `Cmd+N` — New prompt
  - `Cmd+Shift+N` — New blueprint
  - `Cmd+S` — Save (when in editor)
  - `Cmd+,` — Settings
  - `Cmd+\` — Toggle sidebar
  - `G` then `D` — Go to Dashboard
  - `G` then `P` — Go to Prompts
  - `G` then `B` — Go to Blueprints
  - `G` then `L` — Go to Learn
  - `Esc` — Close modals/panels
- [ ] Shortcuts displayed in command palette next to their actions
- [ ] Shortcuts displayed in tooltips
- [ ] Shortcuts disabled when user is focused inside a text input or editor

**Technical Notes:**
- Two-key sequences (`G` then `D`) use a timeout (500ms) to detect the second key

---

### 4.6 — Theme Toggle [P1]

**As a** user
**I want** to switch between dark mode, light mode, and system preference
**So that** I can use the app in my preferred visual style

**Acceptance Criteria:**
- [ ] Theme toggle accessible from profile dropdown and settings
- [ ] Three options: Dark (default), Light, System
- [ ] Theme applies immediately without page reload
- [ ] Persisted in localStorage and cookie (for server-side rendering match)
- [ ] `next-themes` package handles theme management
- [ ] `.dark` class toggled on `<html>` element
- [ ] No flash of incorrect theme on page load

---

### 4.7 — Mobile Bottom Tab Bar [P0]

**As a** mobile user
**I want** a bottom tab bar for primary navigation
**So that** I can navigate with my thumb

**Acceptance Criteria:**
- [ ] Fixed bottom tab bar on mobile (< 768px)
- [ ] 5 tabs: Dashboard, Prompts, Blueprints, Learn, Settings
- [ ] Active tab highlighted with accent color
- [ ] Icons + labels for each tab
- [ ] Touch targets minimum 44px
- [ ] Tab bar hides when keyboard is open (for text input)
- [ ] Tab bar renders above any bottom sheets

---

### 4.8 — Toast Notification System [P0]

**As a** user
**I want** non-intrusive toast notifications for actions and errors
**So that** I'm informed without interrupting my workflow

**Acceptance Criteria:**
- [ ] Sonner (via shadcn/ui) configured as toast provider
- [ ] Position: bottom-right on desktop, bottom-center on mobile
- [ ] Toast variants configured: success, error, warning, info
- [ ] Auto-dismiss: success (3s), info (3s), warning (5s), error (persistent with dismiss)
- [ ] Toasts support action buttons (e.g., "Retry", "Undo", "View")
- [ ] `aria-live` on toast container for screen reader announcements
- [ ] `useToast()` hook or `toast()` function available app-wide
