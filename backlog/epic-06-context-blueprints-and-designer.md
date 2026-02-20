# Epic 06 — Context Blueprints & Designer

**Phase:** 1 (MVP)
**Estimated:** Week 3-4
**Dependencies:** Epic 01, Epic 02, Epic 03, Epic 04, Epic 05 (for CodeMirror and shared patterns)
**References:** PLAN.md §2-3 (Context Blueprint, Context Blocks); UIUX.md §5.7-5.8; TECHNOLOGY.md §5 (dnd kit)

## Goal

Build the context blueprint management and the visual Context Designer — the flagship screen where users compose ordered blocks into a complete LLM context window.

---

## Stories

### 6.1 — Blueprint List Page [P0]

**As a** user
**I want** to see all my blueprints in a searchable list
**So that** I can find and manage my context blueprints

**Acceptance Criteria:**
- [ ] Route: `/blueprints`
- [ ] Structure matches prompt list (Epic 05.1) with blueprint-specific differences:
  - Block count displayed (e.g., "6 blocks")
  - Token budget usage (e.g., "4,200 / 8,000 tokens")
  - Mini block-type indicators: colored dots for each block type present
  - Status badge (draft/active/stable)
- [ ] Same search/filter/sort/pagination pattern as prompt list
- [ ] Same empty/loading/error states
- [ ] Mobile: FAB for "+ New Blueprint", simplified list items

---

### 6.2 — Blueprint Create/Edit — Basic Metadata [P0]

**As a** user
**I want** to create and edit blueprint metadata
**So that** I can set up the blueprint's identity and constraints

**Acceptance Criteria:**
- [ ] Create route: `/blueprints/new`, Edit route: `/blueprints/[slug]`
- [ ] Header: breadcrumb + version badge + status badge + Save button
- [ ] Blueprint metadata fields:
  - Name (text input, required)
  - Slug (auto-generated, editable)
  - Description (textarea)
  - Target LLM (dropdown)
  - Total token budget (number input with common presets: 4K, 8K, 16K, 32K, 100K)
  - App selector (same as prompts)
- [ ] Global parameters section: define parameters available across all blocks

---

### 6.3 — Block Stack Component [P0]

**As a** user
**I want** to see my blueprint's blocks in a vertical stack
**So that** I can visualize the context structure

**Acceptance Criteria:**
- [ ] `BlockStack` component renders blocks in order
- [ ] Each block rendered as a `BlockCard`:
  - Drag handle (`⋮⋮`) on the left
  - Type badge with color coding: SYSTEM (blue), KNOWLEDGE (green), EXAMPLES (purple), TOOLS (orange), HISTORY (gray), TASK (red)
  - Block name (inline-editable)
  - Version badge
  - Summary line (1-line content preview or key config)
  - Token count (right-aligned)
  - Warning indicator (yellow) if issues detected
  - Conditional indicator if block has a condition
  - Action buttons: Edit, reorder arrows, context menu (Duplicate, Delete, View history, Analyze)
- [ ] Clicking a block highlights/selects it
- [ ] "Add Block" button at bottom of stack

---

### 6.4 — Block Drag-to-Reorder [P0]

**As a** user
**I want** to drag blocks to reorder them
**So that** I can control the context structure

**Acceptance Criteria:**
- [ ] `@dnd-kit/core` + `@dnd-kit/sortable` integrated for block reordering
- [ ] Drag handle activates drag mode
- [ ] During drag: block follows cursor, other blocks shift with 200ms transition
- [ ] On drop: new order persisted to database
- [ ] Keyboard-accessible: select block → arrow keys to move → Enter to confirm
- [ ] Touch support for mobile/tablet
- [ ] Optimistic UI: order updates immediately, server confirms in background

---

### 6.5 — Token Budget Bar [P0]

**As a** user
**I want** to see a visual breakdown of token allocation
**So that** I know how my budget is distributed across blocks

**Acceptance Criteria:**
- [ ] `TokenBudgetBar` component at top of block stack
- [ ] Segmented horizontal bar, each segment colored by block type
- [ ] Shows: `Sys:800 Knw:2400 Ex:1200 Hst:400 Tsk:200` labels
- [ ] Total used / total budget percentage
- [ ] Segments proportional to token count
- [ ] Overflow state: bar turns red/destructive when over budget + warning message
- [ ] Animates segments from 0 to value (300ms ease-out) on load
- [ ] Updates live as blocks are added/edited/removed

---

### 6.6 — Add Block Flow [P0]

**As a** user
**I want** to add new blocks to my blueprint
**So that** I can build out the context

**Acceptance Criteria:**
- [ ] "Add Block" button at bottom of block stack
- [ ] Click opens dropdown with block types: System, Knowledge, Examples, Tools, History, Task
- [ ] Brief description under each type explaining its purpose
- [ ] Selecting a type creates a new block at the bottom with sensible defaults:
  - System: empty content, required=true
  - Knowledge: source=static, priority=medium, maxTokens=2000
  - Examples: selectionStrategy=all, maxExamples=3
  - Tools: toolChoice=auto
  - History: maxTurns=10
  - Task: empty content, required=true
- [ ] New block opens in inspector panel for immediate editing
- [ ] Block name auto-generated (e.g., "Knowledge Block 1")

---

### 6.7 — Block Inspector Panel [P0]

**As a** user
**I want** to edit a selected block's content and configuration
**So that** I can configure each part of my context

**Acceptance Criteria:**
- [ ] Inspector panel on the right (~40% width on desktop)
- [ ] **When a block is selected:**
  - Block header: type badge + name (editable) + version
  - Content editor: CodeMirror instance for block template text (with parameter highlighting)
  - Config section (type-specific form fields):
    - **Knowledge:** source dropdown (static/parameter/rag/api), priority dropdown, maxTokens slider, truncation strategy dropdown, grounding instructions textarea
    - **Examples:** pair editor (input/output textarea pairs, add/remove), selection strategy dropdown, maxExamples number
    - **History:** maxTurns number input, summarization threshold, strategy dropdown
    - **Tools:** JSON editor for tool definitions, tool choice dropdown
    - **Task:** output format dropdown, max length, tone selector
    - **System:** no special config (just content)
  - Condition toggle: enable/disable conditional inclusion, condition expression input
- [ ] **When no block is selected:**
  - Blueprint-wide metadata fields
  - Global parameters list
  - Placeholder for blueprint analysis (empty state until analyzed)
- [ ] **Tablet:** Inspector becomes a right-side sheet (slides in, 60% width)
- [ ] **Mobile:** Tap block → full-screen editor for that block

---

### 6.8 — Preview Full Context [P1]

**As a** user
**I want** to preview the assembled context with sample values
**So that** I can see what the LLM will actually receive

**Acceptance Criteria:**
- [ ] "Preview Context" button in the bottom action bar
- [ ] Opens full-screen modal showing assembled context as formatted text
- [ ] Sample parameter values auto-generated (or user can fill in)
- [ ] Parameters replaced with sample values
- [ ] Each block labeled with type and name
- [ ] Total token count displayed
- [ ] Conditional blocks shown/hidden based on sample parameter values
- [ ] Read-only view — not editable

---

### 6.9 — Delete Block [P0]

**As a** user
**I want** to delete a block from my blueprint
**So that** I can remove unnecessary context

**Acceptance Criteria:**
- [ ] Delete option in block context menu
- [ ] Confirmation dialog: "Delete {block name}? This block and its version history will be removed."
- [ ] On confirm: block removed, token budget bar updates
- [ ] Undo via toast (5s window)

---

### 6.10 — Blueprint Save Flow [P0]

**As a** user
**I want** to save my blueprint changes
**So that** my context design is persisted

**Acceptance Criteria:**
- [ ] Save button in the page header
- [ ] Saves all changes: metadata, block order, block content, block configs
- [ ] Auto-save after 3s of inactivity (same pattern as prompt editor)
- [ ] Optimistic UI: changes reflected immediately
- [ ] On error: toast with retry, data not lost
- [ ] Change detection: indicate unsaved changes in tab title and header

---

### 6.11 — Context Designer — Mobile Layout [P0]

**As a** mobile user
**I want** to use the context designer on my phone
**So that** I can manage blueprints on the go

**Acceptance Criteria:**
- [ ] Block stack is full-width, simplified cards (type badge + name + token count)
- [ ] Tap a block → full-screen editor for that block (content + config)
- [ ] Token budget bar is a sticky header
- [ ] Actions via bottom sheet (Add block, Preview, Analyze, Save)
- [ ] No resizable panels on mobile — single column only
