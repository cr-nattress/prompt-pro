# Epic 05 — Prompt Management

**Phase:** 1 (MVP)
**Estimated:** Week 2-3
**Dependencies:** Epic 01, Epic 02, Epic 03, Epic 04
**References:** PLAN.md §3 (Prompt CRUD, Search & Filter); UIUX.md §5.4-5.5; TECHNOLOGY.md §5 (CodeMirror), §6, §7

## Goal

Build the complete prompt management experience — listing, searching, creating, editing, and deleting prompts with the CodeMirror-based editor.

---

## Stories

### 5.1 — Prompt List Page [P0]

**As a** user
**I want** to see all my prompts in a searchable, filterable list
**So that** I can find and manage my prompts

**Acceptance Criteria:**
- [ ] Route: `/prompts`
- [ ] Header: "Prompts ({count})" + "+ New Prompt" button
- [ ] List items display: name (bold, clickable), metadata line (LLM badge, version badge, purpose badge, score if analyzed), description excerpt (1 line truncated), relative timestamp
- [ ] Rows are clickable — navigate to prompt editor
- [ ] Row context menu via `...` button: Duplicate, Analyze, Delete
- [ ] Pagination: 20 items per page, prev/next controls, "Showing 1-20 of {total}"
- [ ] **Loading state:** Skeleton loaders matching row dimensions
- [ ] **Empty state:** "No prompts yet" + description + "Create your first prompt" CTA + "Try the guided builder" link
- [ ] **Error state:** Inline error banner with retry action

---

### 5.2 — Prompt List — Search & Filter [P0]

**As a** user
**I want** to search and filter my prompt list
**So that** I can quickly find specific prompts

**Acceptance Criteria:**
- [ ] Search input with instant filtering (debounced 200ms)
- [ ] Dropdown filters: LLM (multi-select), Purpose (multi-select), Tags (multi-select)
- [ ] Sort options: Last updated, Created, Name, Score — ascending/descending toggle
- [ ] All filter state synced to URL via `nuqs` (shareable URLs, back/forward works)
- [ ] Empty filter results: "No prompts match your filters" + "Clear all filters" button
- [ ] **Mobile:** Filter bar collapses to search input + "Filters" button → bottom sheet with all filter options

---

### 5.3 — Prompt List — Bulk Actions [P2]

**As a** user
**I want** to select multiple prompts and perform bulk actions
**So that** I can manage prompts efficiently

**Acceptance Criteria:**
- [ ] Checkboxes on each row
- [ ] Bulk actions bar appears when any checkboxes selected
- [ ] Actions: Delete selected, Export selected (later epic)
- [ ] "Select all on this page" option
- [ ] Confirmation dialog for destructive bulk actions

---

### 5.4 — Prompt List — Mobile Adaptations [P0]

**As a** mobile user
**I want** a touch-optimized prompt list
**So that** I can browse prompts on my phone

**Acceptance Criteria:**
- [ ] Simplified list items: name + LLM badge + score (description hidden)
- [ ] FAB at bottom-right: "+ New Prompt"
- [ ] Swipe left on a row for quick actions (Analyze, Delete)
- [ ] Touch targets minimum 44px

---

### 5.5 — CodeMirror Prompt Editor Setup [P0]

**As a** developer
**I want** CodeMirror 6 integrated as the prompt text editor
**So that** we have a professional editing experience

**Acceptance Criteria:**
- [ ] CodeMirror 6 installed with core packages
- [ ] `PromptEditor` component created in `components/prompt/`
- [ ] Features enabled: line numbers, word wrap, search/replace
- [ ] Dark and light theme support matching design tokens
- [ ] Dynamically imported (code-split) — not in the initial JS bundle
- [ ] Works on mobile (touch-compatible)

---

### 5.6 — CodeMirror — Parameter Highlighting [P0]

**As a** user
**I want** `{{parameter}}` placeholders highlighted in the editor
**So that** I can distinguish dynamic parts from static text

**Acceptance Criteria:**
- [ ] Custom CodeMirror language mode (or decoration) highlights `{{...}}` syntax
- [ ] Parameters rendered with accent color background and bold text
- [ ] Autocomplete triggers on typing `{{` — shows list of defined parameters
- [ ] Invalid parameters (defined in editor but not in schema) shown with warning style

---

### 5.7 — Prompt Editor Page — Create [P0]

**As a** user
**I want** to create a new prompt
**So that** I can store and manage my LLM prompts

**Acceptance Criteria:**
- [ ] Route: `/prompts/new`
- [ ] **Desktop layout — 2-panel** (analysis panel hidden until first analysis):
  - Left (~60%): CodeMirror editor for prompt text
  - Right (~40%): Metadata form
- [ ] **Editor panel:**
  - CodeMirror instance with parameter highlighting
  - Footer: token count (live), estimated cost per call
- [ ] **Metadata panel form fields:**
  - Title (text input, required)
  - Slug (auto-generated from title, editable, validated `[a-z0-9-]`)
  - LLM target (dropdown: claude-sonnet, claude-opus, gpt-4o, gemini-pro)
  - Purpose (dropdown: writing, support, coding, analysis, creative, other)
  - Tags (tag input with autocomplete from existing tags)
  - Description (textarea, optional)
- [ ] **Parameters section:**
  - Auto-detected from `{{}}` in editor text
  - Each param: name, type dropdown (string/number/boolean/enum), required toggle, default value input
  - "Add parameter" button for manually adding params
- [ ] Save button in top bar — saves prompt template + initial version (v1.0, status: draft)
- [ ] App selector — assign prompt to an app (create app inline if none exist)
- [ ] On save success: toast "Prompt saved", navigate to `/prompts/[slug]`
- [ ] On save error: toast with retry, form stays populated

---

### 5.8 — Prompt Editor Page — Edit [P0]

**As a** user
**I want** to edit an existing prompt
**So that** I can iterate on my prompts

**Acceptance Criteria:**
- [ ] Route: `/prompts/[slug]`
- [ ] Loads existing prompt data into editor and metadata form
- [ ] Header: `← Prompts / {prompt name}` breadcrumb + version badge + status badge + Save button
- [ ] Editing the template text auto-detects new/removed parameters
- [ ] Save creates a new version (auto-incremented) with status `draft`
- [ ] Change note input available on save (optional, shown in a popover or inline field)
- [ ] Auto-save after 3 seconds of inactivity (debounced), visual indicator "Saving..." / "Saved"
- [ ] Panels are resizable via drag handles, sizes persist in localStorage
- [ ] Any panel can be collapsed via toggle button in panel header
- [ ] **Tablet:** Metadata panel becomes collapsible section above editor
- [ ] **Mobile:** Full-screen editor with tab switcher at bottom: [Edit] [Details]

---

### 5.9 — Prompt Editor — Token Counter [P0]

**As a** user
**I want** to see the token count of my prompt in real-time
**So that** I know the cost and can optimize for token efficiency

**Acceptance Criteria:**
- [ ] Token count displayed in editor footer, updates live as user types
- [ ] Shows count for the currently selected LLM tokenizer
- [ ] Estimated cost per API call based on current token count and model pricing
- [ ] Uses `js-tiktoken` for client-side counting (no API call)
- [ ] Tokenizer selector dropdown if user wants to check against different models

---

### 5.10 — Prompt Delete Flow [P0]

**As a** user
**I want** to delete a prompt
**So that** I can remove prompts I no longer need

**Acceptance Criteria:**
- [ ] Delete option in row context menu (list) and editor actions
- [ ] Confirmation dialog: "Delete {prompt name}? This will remove all versions. This action cannot be undone."
- [ ] On confirm: prompt deleted, redirect to `/prompts`, toast "Prompt deleted" with "Undo" action (5s window)
- [ ] Undo restores the prompt
- [ ] Cascades: deleting a prompt deletes all its versions and analyses

---

### 5.11 — Prompt Duplicate [P1]

**As a** user
**I want** to duplicate a prompt
**So that** I can create variations without starting from scratch

**Acceptance Criteria:**
- [ ] Duplicate option in row context menu and editor actions
- [ ] Creates new prompt with name "{original name} (copy)" and slug "{original-slug}-copy"
- [ ] Copies latest version's template text, parameters, and metadata
- [ ] Opens the new prompt in the editor
- [ ] New prompt starts at v1.0 draft

---

### 5.12 — App Management (Inline) [P1]

**As a** user
**I want** to create and manage apps to organize my prompts
**So that** I can group related prompts together

**Acceptance Criteria:**
- [ ] App selector dropdown in prompt editor and blueprint editor
- [ ] "Create new app" option at bottom of dropdown
- [ ] Inline app creation: name input + slug auto-generated → create
- [ ] Apps listed in a simple management page under Settings (or as a section in the sidebar)
- [ ] Each app shows: name, slug, prompt count, blueprint count
- [ ] App CRUD: create, rename, delete (with cascade warning)
