# Epic 16 — Real-Time Coach & Smart Suggestions

**Phase:** 2 (Power Features)
**Estimated:** Week 10-11
**Dependencies:** Epic 05 (Prompt Editor), Epic 09 (AI Analysis)
**References:** PLAN.md §3 Phase 2 (Smart Autocomplete, Prompt Linter, Real-Time Coach); UIUX.md §6.2, §6.3; TECHNOLOGY.md §10

## Goal

Add real-time AI assistance to the editor — inline autocomplete (ghost text), the prompt linter, and the coach sidebar that provides live strategic guidance.

---

## Stories

### 16.1 — Inline Ghost Text Suggestions [P0]

**As a** user
**I want** AI suggestions to appear inline as I type
**So that** I can write prompts faster with better quality

**Acceptance Criteria:**
- [ ] After 2 seconds of typing inactivity, AI generates a completion suggestion
- [ ] Suggestion appears as dimmed/muted text after cursor position (ghost text)
- [ ] `Tab` to accept the suggestion (text becomes real)
- [ ] Keep typing to dismiss the suggestion
- [ ] `Esc` to explicitly dismiss
- [ ] Never appears while user is actively typing
- [ ] Uses Claude Haiku for speed and cost efficiency
- [ ] Implemented via `useCompletion()` from Vercel AI SDK
- [ ] Configurable: on/off toggle in editor settings
- [ ] Ghost text fade-in animation: 300ms ease-out

**Technical Notes:**
- Use CodeMirror decorations for ghost text rendering
- Debounce at 2000ms after last keystroke

---

### 16.2 — Prompt Linter [P0]

**As a** user
**I want** configurable rules that check my prompt on save
**So that** I catch common issues before publishing

**Acceptance Criteria:**
- [ ] Linter runs on save (not on every keystroke)
- [ ] Configurable rules (enable/disable per workspace or app):
  - Must include output format
  - Must define role/persona
  - Must include examples (for prompts tagged as few-shot)
  - Max token limit (configurable threshold)
  - No ambiguous quantifiers
  - Must have at least one constraint
- [ ] Violations shown as warnings in the editor (yellow squiggly underlines)
- [ ] Linter results panel or section in analysis panel
- [ ] Each violation: rule name, description, location in text, quick-fix if applicable
- [ ] Violations don't block save (warnings, not errors)

---

### 16.3 — Linter Configuration UI [P1]

**As a** user
**I want** to configure which linter rules are active
**So that** the linter matches my workflow and preferences

**Acceptance Criteria:**
- [ ] Linter settings in workspace settings or editor settings
- [ ] Toggle each rule on/off
- [ ] Configurable thresholds (e.g., max token limit value)
- [ ] Presets: "Strict" (all rules), "Relaxed" (key rules only), "Off"
- [ ] Settings scoped to workspace (apply to all prompts) or per-app override

---

### 16.4 — Real-Time Prompt Coach Sidebar [P0]

**As a** user
**I want** a sidebar with live AI suggestions while I write
**So that** I get expert guidance without leaving the editor

**Acceptance Criteria:**
- [ ] `CoachSidebar` component renders as a right panel in the editor
- [ ] Three modes: **Active** (detailed suggestions), **Subtle** (brief nudges), **Off**
- [ ] Mode toggle in sidebar header + keyboard shortcut (`Cmd+Shift+C`)
- [ ] Coach analyzes the prompt on pause (debounced ~3s) and provides:
  - Missing elements (no output format, no role, etc.)
  - Technique suggestions ("Consider adding few-shot examples here")
  - Complexity warnings ("This prompt asks for too many things at once")
  - Anti-pattern detection ("This looks like a Vague Directive")
  - Model fit checks ("This XML structure works better with Claude than GPT")
- [ ] **Active mode:** full cards with explanations and action buttons
- [ ] **Subtle mode:** short one-liners in the margin
- [ ] Suggestions update as the user edits (not on every keystroke)
- [ ] Each suggestion: icon + title + brief description + action button (if applicable)
- [ ] Suggestions dismissible individually
- [ ] Uses `streamText()` with Claude Sonnet for quality

---

### 16.5 — Coach — Model-Specific Tips [P1]

**As a** user
**I want** the coach to give model-specific advice
**So that** my prompts are optimized for the target LLM

**Acceptance Criteria:**
- [ ] When target LLM is set, coach provides model-specific tips:
  - Claude: suggest XML tags, prefer explicit instructions
  - GPT: suggest system messages, JSON mode availability
  - Gemini: suggest explicit formatting, safety settings awareness
- [ ] "This prompt is optimized for {model}" or "Consider adjusting for {model}" indicators
- [ ] Auto-detect if prompt uses patterns not optimal for the selected model

---

### 16.6 — Prompt Compression [P2]

**As a** user
**I want** to compress my prompt to use fewer tokens
**So that** I can save costs while preserving meaning

**Acceptance Criteria:**
- [ ] "Compress" action in editor toolbar or analysis panel
- [ ] AI analyzes prompt and removes redundancy, simplifies phrasing
- [ ] Before/after comparison: token count, estimated cost savings
- [ ] Diff view showing what was changed
- [ ] "Apply" to accept compression, "Discard" to keep original
- [ ] New version created with change note "Compressed (saved N tokens)"

---

### 16.7 — Output Format Enforcer [P2]

**As a** user
**I want** suggestions for enforcing output format compliance
**So that** my LLM responses reliably follow the specified format

**Acceptance Criteria:**
- [ ] Detects when prompt specifies JSON/Markdown/CSV output format
- [ ] Suggests additions for reliable compliance:
  - Schema definitions
  - "Respond ONLY with valid JSON" instructions
  - Example output
- [ ] One-click insert for each suggestion
