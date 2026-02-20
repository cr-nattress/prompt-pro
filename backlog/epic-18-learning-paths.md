# Epic 18 — Learning Paths & Education v2

**Phase:** 2 (Power Features)
**Estimated:** Week 12-13
**Dependencies:** Epic 12 (Education MVP), Epic 17 (Skill Profiling)
**References:** PLAN.md §3 Phase 2 (Learning Paths, Context Engineering Education); UIUX.md §5.11; PLAN.md §8

## Goal

Build interactive learning paths, expand context engineering education content, and add new technique cards for advanced topics.

---

## Stories

### 18.1 — Learning Path Framework [P0]

**As a** user
**I want** structured learning paths I can follow
**So that** I can systematically improve my prompt engineering skills

**Acceptance Criteria:**
- [ ] Learning Paths section in `/learn`
- [ ] Each path displays: title, description, lesson count, progress indicator (X/Y completed)
- [ ] Path detail page shows ordered list of lessons with completion status
- [ ] Each lesson is a self-contained page with:
  1. Concept explanation (markdown content)
  2. Before/after example (side-by-side)
  3. Hands-on exercise: apply the concept to a prompt (user selects from their vault or uses provided)
  4. System feedback on the exercise (AI analysis against lesson objectives)
  5. Completion badge on passing
- [ ] Progress saved per user
- [ ] 5-10 minute estimated time per lesson
- [ ] Responsive: full-width content on mobile, side-by-side on desktop where applicable

---

### 18.2 — Learning Path: Prompt Foundations [P0]

**As a** beginner
**I want** a foundations learning path
**So that** I learn the basics of prompt engineering

**Acceptance Criteria:**
- [ ] **Path: Prompt Foundations** (5 lessons):
  1. Anatomy of a Good Prompt — structure, clarity, completeness
  2. Being Specific — replacing vague language with concrete instructions
  3. Output Format — specifying what you want back
  4. Tone & Audience — adapting prompts for context
  5. Common Mistakes — the top 5 anti-patterns to avoid
- [ ] Each lesson has at least one before/after example
- [ ] Exercise for each lesson tests the specific concept
- [ ] Completion updates skill profile scores

---

### 18.3 — Learning Path: Intermediate Techniques [P0]

**As an** intermediate user
**I want** a techniques learning path
**So that** I learn advanced prompt engineering patterns

**Acceptance Criteria:**
- [ ] **Path: Intermediate Techniques** (5 lessons):
  1. Few-Shot Prompting — when and how to use examples
  2. Chain-of-Thought — getting the AI to show its work
  3. Step-by-Step Decomposition — breaking complex tasks into parts
  4. Negative Constraints — telling the AI what NOT to do
  5. Edge Cases & Robustness — making prompts handle the unexpected
- [ ] Pre-requisite: Prompt Foundations (or opt to skip)
- [ ] More challenging exercises that require applying multiple concepts

---

### 18.4 — Context Engineering Education [P0]

**As a** user
**I want** to learn about context engineering
**So that** I can design better context blueprints

**Acceptance Criteria:**
- [ ] New micro-lesson triggers for context (6+ triggers):
  - User creates first blueprint → "Context blueprints let you design the complete picture..."
  - User adds knowledge block without grounding → "Knowledge without grounding..."
  - User exceeds token budget → "Token budget management..."
  - User has only 1 block → "A single-block blueprint misses the benefit of context layering..."
  - User doesn't use conditionals → "Conditional blocks let you adapt context..."
  - User's blueprint has redundancy → "Two blocks are saying the same thing..."
- [ ] New technique cards (8):
  - Grounding Instructions
  - Context Layering
  - Token Budget Allocation
  - Structured Context Formatting
  - Conditional Inclusion
  - Knowledge Delineation
  - Negative Context ("what to exclude")
  - Context Windowing Strategies

---

### 18.5 — Learning Path: Context Engineering Foundations [P1]

**As a** user
**I want** a context engineering learning path
**So that** I can master context design

**Acceptance Criteria:**
- [ ] **Path: Context Engineering Foundations** (5 lessons):
  1. What is Context Engineering — beyond prompts, designing the full picture
  2. Context Layers — system, knowledge, examples, tools, history, task
  3. Writing System Instructions — the foundation block
  4. Reference Knowledge & Grounding — connecting knowledge to usage
  5. Token Budget Management — allocating and optimizing context space
- [ ] Exercises involve creating/modifying blueprints
- [ ] Completion updates context engineering skill scores

---

### 18.6 — Prompt Patterns Library [P1]

**As a** user
**I want** a curated library of proven prompt patterns
**So that** I can quickly apply proven techniques

**Acceptance Criteria:**
- [ ] Patterns library section in `/learn` or accessible from editor
- [ ] Patterns (code-editor-style snippets):
  - Chain-of-Thought template
  - Few-Shot with examples template
  - Role assignment template
  - Output formatting (JSON, Markdown, CSV)
  - Self-critique loop template
  - XML-structured sections template
- [ ] Each pattern: description, when to use, when NOT to use, example, "Insert into prompt" button
- [ ] "Insert" opens modal to select target prompt + position, then inserts the pattern
