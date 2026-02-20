# Epic 12 — Education System MVP

**Phase:** 1 (MVP)
**Estimated:** Week 7
**Dependencies:** Epic 05 (Editor), Epic 09 (Analysis)
**References:** PLAN.md §3 (Education — Basic, Knowledge Base — Initial), §8 (Prompt Intelligence Engine); UIUX.md §5.11, §6.5

## Goal

Implement the foundational education layer — field-level hints, contextual micro-lessons, and the knowledge base — so that every surface of the app teaches users to write better prompts.

---

## Stories

### 12.1 — Field-Level Hints [P0]

**As a** beginner user
**I want** helpful tooltips on form fields explaining their purpose
**So that** I understand what each field does and why it matters

**Acceptance Criteria:**
- [ ] Tooltip (info icon + hover/click) on key form fields across the app:
  - Prompt editor: Purpose, LLM target, Tags, Parameters, Template Text
  - Blueprint editor: Token Budget, Block Type, Grounding Instructions, Conditional, Priority
  - Each hint: 1-2 sentences explaining the field's purpose and impact
- [ ] Hints are concise and actionable, not generic ("Setting the LLM target helps the analysis engine give model-specific feedback")
- [ ] "Learn more" link on each hint → relevant knowledge base page
- [ ] Implemented via shadcn/ui Tooltip component
- [ ] Not shown if user has dismissed all hints (settings toggle)

---

### 12.2 — Micro-Lesson System [P0]

**As a** user
**I want** contextual tips that appear when relevant
**So that** I learn prompt engineering naturally through usage

**Acceptance Criteria:**
- [ ] `MicroLesson` component: dismissible inline card with icon + title + 2-4 sentence body + "Learn more" link + dismiss (X) button
- [ ] Micro-lesson trigger system:
  - Tracks which lessons have been shown/dismissed (per user, stored in database)
  - Evaluates trigger conditions on page load or user action
  - Shows maximum 1 lesson per page view
  - Never repeats a dismissed lesson
- [ ] 20 hand-crafted trigger conditions (examples):
  - User saves prompt without output format → "Prompts with defined output formats produce 40% more consistent results"
  - User creates prompt with no examples → "Few-shot prompting can dramatically improve output quality"
  - User writes prompt with >2000 tokens → "Long prompts aren't always better — specificity matters more than length"
  - User's prompt gets low specificity score → "Vague words like 'good' or 'appropriate' leave too much room for interpretation"
  - User creates first blueprint → "Context blueprints let you design the full picture the LLM sees"
  - User saves knowledge block without grounding → "Knowledge without grounding instructions is like reference books without a syllabus"
- [ ] Lessons appear as:
  - Inline banners in dashboard
  - Tooltips with depth in editor (field labels)
  - Margin notes in analysis panel
  - Bottom sheets on mobile

---

### 12.3 — Skill Profiling — Silent Tracking [P1]

**As the** system
**I want** to track user behavior to build a skill profile
**So that** recommendations and education can be personalized

**Acceptance Criteria:**
- [ ] Deterministic rule engine observes user actions and updates skill scores
- [ ] **Prompt Engineering skills (1-5 each):**
  - Structure: does user use sections, XML tags, clear formatting?
  - Techniques: does user employ few-shot, CoT, role assignment?
  - Specificity: are prompts specific or vague?
  - Complexity: does user handle multi-step tasks, edge cases?
  - Model awareness: does user adapt prompts for different LLMs?
- [ ] **Context Engineering skills (1-5 each):**
  - Context design: quality of blueprint structure
  - Grounding: use of grounding instructions
  - Token management: budget efficiency
  - Information architecture: block organization
  - Dynamic context: use of conditionals, parameters
- [ ] Scores update on every save/edit (not every keystroke)
- [ ] Skill profile stored in `user.skillProfile` JSONB field
- [ ] Profile is NOT displayed to user in MVP (visible in Phase 2)
- [ ] Drives recommendation prioritization and micro-lesson depth

---

### 12.4 — Knowledge Base — Structure & Navigation [P0]

**As a** user
**I want** a knowledge base with prompt engineering resources
**So that** I can learn techniques and avoid common mistakes

**Acceptance Criteria:**
- [ ] Route: `/learn`
- [ ] Layout: left sidebar with category navigation (desktop), horizontal tabs (mobile)
- [ ] Categories: Techniques, Anti-Patterns, Glossary
- [ ] Search within knowledge base (searches titles and content)
- [ ] Cards view: grid of cards per category, each showing title + 1-line summary
- [ ] Responsive: single column on mobile, 2-3 columns on desktop

---

### 12.5 — Knowledge Base — Technique Cards [P0]

**As a** user
**I want** detailed technique cards for prompt engineering patterns
**So that** I can learn and apply proven techniques

**Acceptance Criteria:**
- [ ] Initial technique cards (minimum 8):
  - Few-Shot Prompting
  - Chain-of-Thought (CoT)
  - Role/Persona Assignment
  - XML Tag Structuring
  - Output Format Specification
  - Negative Constraints ("Do NOT...")
  - Step-by-Step Decomposition
  - Self-Critique / Reflection
- [ ] Each card detail page includes:
  - Title + 1-sentence summary
  - "When to use" section (bulleted list)
  - "When NOT to use" section (bulleted list)
  - Minimal example (before/after)
  - Advanced example
  - Model compatibility notes (which LLMs benefit most)
- [ ] Content rendered via `react-markdown`
- [ ] Cross-linked from analysis results (when analysis says "Try few-shot" → links to the technique card)

---

### 12.6 — Knowledge Base — Anti-Pattern Encyclopedia [P0]

**As a** user
**I want** a catalog of common prompt engineering mistakes
**So that** I can recognize and avoid bad patterns

**Acceptance Criteria:**
- [ ] Initial anti-patterns (minimum 10, from PLAN.md):
  - The Kitchen Sink (cramming everything)
  - The Vague Directive (being too general)
  - The Assumption Trap (assuming LLM knows context)
  - The Format Pray (hoping for specific format without specifying)
  - The Context Dump (unstructured context)
  - The Groundless Reference (knowledge without grounding)
  - The Infinite History (too much conversation history)
  - The Contradictory Layers (conflicting instructions)
  - The Missing Link (referencing undefined things)
  - One Priority Fits All (no prioritization)
- [ ] Each anti-pattern page:
  - Named pattern with descriptive icon/emoji
  - What it looks like (bad example)
  - Why it's a problem
  - How to fix it (good example)
  - Related technique cards (cross-links)

---

### 12.7 — Knowledge Base — Glossary [P1]

**As a** beginner user
**I want** a glossary of prompt engineering terms
**So that** I can understand technical vocabulary

**Acceptance Criteria:**
- [ ] Alphabetical list of terms
- [ ] Initial terms (minimum 20): temperature, tokens, system prompt, context window, few-shot, zero-shot, chain-of-thought, RAG, hallucination, grounding, embedding, prompt injection, persona, parameter, template, tokenizer, fine-tuning, inference, completion, structured output
- [ ] Each entry: term, 1-3 sentence definition, link to related technique/anti-pattern where applicable
- [ ] Quick-search filter at top
