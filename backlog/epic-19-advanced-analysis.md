# Epic 19 — Advanced Analysis & Context Features

**Phase:** 2 (Power Features)
**Estimated:** Week 13-14
**Dependencies:** Epic 06 (Context Designer), Epic 09 (AI Analysis), Epic 15 (Playground)
**References:** PLAN.md §3 Phase 2 (Context Simulation, Model-Specific Optimization, Few-Shot Generator, Version Comparison Insights)

## Goal

Add advanced analysis capabilities — context simulation, model-specific optimization, few-shot example generation, and AI-annotated version comparison.

---

## Stories

### 19.1 — Context Simulation: "What Does the Model See?" [P0]

**As a** user
**I want** to see the full assembled context as the LLM would see it
**So that** I can verify the context is correct before sending to production

**Acceptance Criteria:**
- [ ] "Render Context" button in context designer
- [ ] Opens full-screen modal showing:
  - Complete assembled context with sample parameter values filled in
  - Each block labeled with type badge and name
  - Conditional blocks shown/hidden based on sample parameter values
  - Total token count breakdown
- [ ] Parameter value inputs at the top for customizing the preview
- [ ] Syntax highlighting for the rendered context

---

### 19.2 — Attention Heatmap Overlay [P2]

**As a** user
**I want** to see where the model pays attention in my context
**So that** I can identify the "lost in the middle" problem

**Acceptance Criteria:**
- [ ] Toggle overlay on context preview
- [ ] Visualizes approximate attention distribution (heatmap colors on text)
- [ ] Red = high attention (beginning and end), blue = low attention (middle)
- [ ] Educates users about the lost-in-the-middle phenomenon
- [ ] "What's Missing?" diagnostic: identifies gaps between task and context

---

### 19.3 — Model-Specific Optimization [P0]

**As a** user
**I want** to adapt my prompt for a specific LLM
**So that** I get the best results from each model

**Acceptance Criteria:**
- [ ] "Optimize for {model}" action in editor or analysis panel
- [ ] Target model selector (if different from current LLM setting)
- [ ] AI restructures the prompt for the target model:
  - Claude: add XML tags, explicit system instructions
  - GPT: restructure for system/user message split, JSON mode hints
  - Open-source: add explicit formatting, simplify instructions
- [ ] Shows diff between current and optimized version
- [ ] "Apply" to save as new version, "Discard" to keep original

---

### 19.4 — Few-Shot Example Generator [P0]

**As a** user
**I want** to auto-generate few-shot examples for my prompt
**So that** I can add examples without writing them manually

**Acceptance Criteria:**
- [ ] "Generate examples" action in editor toolbar
- [ ] AI generates 3 example pairs based on prompt purpose and parameter schema
- [ ] Examples displayed for review in a modal:
  - Each pair: input → expected output
  - User can edit, delete, or add more examples
  - "Add to prompt" button inserts examples into the prompt text
- [ ] Examples formatted according to prompt structure (XML tags, markdown, plain text)

---

### 19.5 — Version Comparison AI Insights [P1]

**As a** user
**I want** AI annotations on version diffs
**So that** I understand what changed and whether it's an improvement

**Acceptance Criteria:**
- [ ] When viewing a diff between two versions:
  - AI-generated annotation below the diff
  - Explains what changed in plain language
  - Assesses whether changes are likely positive or negative
  - Notes score changes between versions
- [ ] Example: "This change added an explicit output format (JSON with 3 fields). This is likely an improvement — specificity score increased from 5/10 to 7/10."
- [ ] Generated on-demand (not automatically for every diff view)
- [ ] "Explain changes" button triggers the analysis

---

### 19.6 — Prompt Patterns Autocomplete [P2]

**As a** user
**I want** pattern suggestions as I type in the editor
**So that** I can quickly insert proven patterns

**Acceptance Criteria:**
- [ ] Editor detects partial pattern indicators (e.g., "Step 1:", "Example:", "You are a")
- [ ] Suggests relevant patterns from the patterns library
- [ ] Suggestion appears in command palette style (not ghost text)
- [ ] Select to insert the full pattern template
- [ ] Different from ghost text (Epic 16.1) — pattern-based, not AI-generated
