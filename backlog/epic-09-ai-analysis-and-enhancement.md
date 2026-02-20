# Epic 09 — AI Analysis & Enhancement

**Phase:** 1 (MVP)
**Estimated:** Week 4-5
**Dependencies:** Epic 05 (Prompt Editor), Epic 06 (Context Designer)
**References:** PLAN.md §7 (AI Analysis Engine), §3 (Analysis, Ambiguity Detector, Token Counter); UIUX.md §5.5 (Analysis Panel), §6; TECHNOLOGY.md §10

## Goal

Integrate the Claude API to power prompt analysis, scoring, enhancement, and the ambiguity detector. This is where PromptVault becomes intelligent.

---

## Stories

### 9.1 — AI Integration Setup [P0]

**As a** developer
**I want** the Vercel AI SDK configured with Claude
**So that** we can make AI-powered calls from the backend

**Acceptance Criteria:**
- [ ] `ai` (Vercel AI SDK) and `@ai-sdk/anthropic` installed
- [ ] `lib/ai/` module exports configured providers
- [ ] Server-side only — no API key exposure to client
- [ ] Claude model abstracted (easy to switch between Sonnet/Opus/Haiku)
- [ ] Streaming support configured (`streamText`, `streamObject`)
- [ ] Error handling for rate limits, API failures, timeout

---

### 9.2 — Prompt Analysis Engine [P0]

**As a** user
**I want** to analyze my prompt and get multi-dimensional scores
**So that** I know where my prompt is strong and where it needs improvement

**Acceptance Criteria:**
- [ ] "Analyze" button in the prompt editor (and analysis panel)
- [ ] Server Action or API route calls Claude with a meta-prompt:
  - Sends user's prompt text, target LLM, and purpose
  - Requests structured JSON response with scores and feedback
- [ ] Response parsed into `Analysis` record:
  - **Prompt Scores (1-10 each):** clarity, specificity, completeness, structure, robustness, efficiency
  - **Weaknesses:** array of identified issues with descriptions
  - **Suggestions:** array of improvement recommendations with action descriptions
- [ ] Results stream into the analysis panel token-by-token:
  - Overall score appears first
  - Individual dimensions fill in progressively
  - Weaknesses populate last
- [ ] Analysis saved to database (linked to prompt version)
- [ ] Free plan: 5 analyses/month. Pro: 100. Team: 500.
- [ ] Quota check before API call — show inline upgrade prompt when exhausted

---

### 9.3 — Analysis Panel UI [P0]

**As a** user
**I want** to see analysis results in a clear, visual panel
**So that** I can understand my prompt's strengths and weaknesses

**Acceptance Criteria:**
- [ ] Analysis panel (right side of editor, ~25% width)
- [ ] **Before first analysis:** empty state with "Analyze your prompt to get scores and suggestions" + "Analyze" CTA
- [ ] **After analysis:**
  - `ScoreRadar` — radar chart (Recharts) with 6 axes
  - `ScoreBreakdown` — list of each dimension: name, numeric score, 1-line explanation
  - Weaknesses list: each item has description + "Fix" action button
  - "Enhance" button (see 9.4)
  - "Expert View" button (phase 2 — disabled/hidden for MVP)
- [ ] **During analysis:** streaming state with cursor animation, sections filling progressively
- [ ] Score color coding: green (8+), yellow (5-7), red (<5)
- [ ] Panel is resizable and collapsible
- [ ] Recharts loaded dynamically (code-split)

---

### 9.4 — One-Click Enhance [P0]

**As a** user
**I want** to generate an improved version of my prompt with one click
**So that** I can quickly apply AI suggestions

**Acceptance Criteria:**
- [ ] "Enhance" button in analysis panel
- [ ] Calls Claude API with the prompt + identified weaknesses + instructions to improve
- [ ] Enhanced prompt text streams in real-time
- [ ] Opens diff view: original (left) vs enhanced (right)
- [ ] Word-level highlighting of changes
- [ ] "Apply" button: replaces editor content with enhanced version, saves as new version with change note "AI-enhanced"
- [ ] "Discard" button: closes diff, keeps original
- [ ] Enhanced text stored in `Analysis.enhancedPromptText`

---

### 9.5 — Context-Aware Blueprint Analysis [P0]

**As a** user
**I want** to analyze my entire blueprint (not just individual prompts)
**So that** I get feedback on context design, not just prompt quality

**Acceptance Criteria:**
- [ ] "Analyze Blueprint" button in context designer
- [ ] Analysis includes prompt scores AND context scores:
  - **Context Scores (1-10):** sufficiency, relevance, grounding, coherence, placement, budgetEfficiency, adaptability
- [ ] Additional context-specific feedback:
  - Token budget allocation analysis
  - Information placement analysis (lost-in-the-middle detection)
  - Redundancy/contradiction detection across blocks
  - Context sufficiency check
  - Grounding gap analysis (knowledge without usage instructions)
- [ ] Per-block targeted feedback (which block needs attention)
- [ ] Results displayed in inspector panel (when no block selected)
- [ ] Warning badges on individual blocks if issues detected

---

### 9.6 — Ambiguity Detector [P1]

**As a** user
**I want** vague phrases flagged directly in my prompt text
**So that** I can make my instructions more specific

**Acceptance Criteria:**
- [ ] Deterministic rule engine flags common ambiguous phrases:
  - "a few", "recently", "short", "long", "appropriate", "etc.", "good", "nice", "various", "some", "adequate", "relevant", "proper", "suitable"
- [ ] Flagged phrases get squiggly yellow underlines in CodeMirror
- [ ] Hover over underline shows: the issue + suggested replacement
- [ ] Click underline: applies the suggested replacement
- [ ] Runs automatically on editor content changes (debounced)
- [ ] Can be disabled in editor settings

**Technical Notes:**
- Use CodeMirror decorations for underlines
- Deterministic rules handle common cases; Claude fallback for edge cases (P2)

---

### 9.7 — Suggestion Quick Actions [P1]

**As a** user
**I want** analysis suggestions to have one-click fix actions
**So that** I can apply improvements without manual editing

**Acceptance Criteria:**
- [ ] Each suggestion in the analysis panel has a "Fix" or action button
- [ ] Action types:
  - "Add constraints" → inserts a constraint section template at cursor
  - "Add output format" → inserts format instruction with selector (JSON/Markdown/CSV)
  - "Add few-shot examples" → inserts example section placeholder
  - "Be more specific" → highlights the vague section
- [ ] All actions are reversible via `Cmd+Z` or version history
- [ ] Applied suggestions update in the analysis (re-analyze prompt to see new score)

---

### 9.8 — Analysis API Endpoint [P1]

**As a** developer
**I want** analysis available via the REST API
**So that** external tools can trigger analysis programmatically

**Acceptance Criteria:**
- [ ] `POST /api/v1/apps/:app/prompts/:slug/analyze` — analyze a prompt
- [ ] `POST /api/v1/apps/:app/prompts/:slug/enhance` — generate enhanced version
- [ ] `POST /api/v1/apps/:app/blueprints/:slug/analyze` — analyze a blueprint
- [ ] Requires `write` scope
- [ ] Returns same structured data as the UI analysis
- [ ] Counts against monthly analysis quota
