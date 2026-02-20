# Epic 10 — Guided Builder & Onboarding

**Phase:** 1 (MVP)
**Estimated:** Week 5-6
**Dependencies:** Epic 05 (Prompt Editor), Epic 09 (Analysis)
**References:** PLAN.md §3 (Guided Prompt Builder, Onboarding); UIUX.md §5.2, §5.6

## Goal

Build the guided prompt builder wizard (key differentiator for non-technical users) and the onboarding flow that teaches new users the core loop.

---

## Stories

### 10.1 — Guided Builder — Wizard Component [P0]

**As a** non-technical user
**I want** a step-by-step wizard to build my prompt
**So that** I can create a well-structured prompt without knowing prompt engineering

**Acceptance Criteria:**
- [ ] Route: `/prompts/new?mode=guided` (or modal overlay)
- [ ] `GuidedBuilder` component manages multi-step wizard state
- [ ] Step indicator at top (progress dots, current step highlighted)
- [ ] Large centered UI, one question per step
- [ ] Back/Next navigation buttons
- [ ] Keyboard: Enter advances, Esc cancels
- [ ] Step data persisted in local state (not lost on back navigation)

---

### 10.2 — Guided Builder — Steps [P0]

**As a** user
**I want** to answer 6 clear questions to build my prompt
**So that** the wizard assembles a structured prompt from my answers

**Acceptance Criteria:**
- [ ] **Step 1 — Role:** "What role should the AI take?" — Text input + common role chips (Expert writer, Data analyst, Customer support agent, Code reviewer)
- [ ] **Step 2 — Task:** "What task should the AI perform?" — Textarea with tip about specificity
- [ ] **Step 3 — Input:** "What will you provide as input?" — Chips: Free text, Document/article, Data/CSV, Code, Conversation. Defines parameter structure
- [ ] **Step 4 — Output:** "What format should the response be in?" — Chips: Prose, Bullet list, JSON, Table, Code. Additional: max length, specific structure
- [ ] **Step 5 — Constraints:** "Any rules or constraints?" — Textarea + constraint chips: Stay factual, Don't use jargon, Be concise, Include sources. Tone selector: Professional, Friendly, Academic, Casual
- [ ] **Step 6 — Review:** Full assembled prompt in CodeMirror (editable). "Save" and "Save & Analyze" buttons
- [ ] Each step has a contextual education tip (short, relevant, dismissible)

---

### 10.3 — Guided Builder — Live Preview [P0]

**As a** user
**I want** to see my prompt being assembled in real-time
**So that** I understand how each answer affects the final prompt

**Acceptance Criteria:**
- [ ] Live preview panel on the right side (desktop) or collapsible section (mobile/tablet)
- [ ] Preview updates as user fills in each step
- [ ] Shows formatted prompt text with sections highlighted by step
- [ ] Parameters auto-detected from input step answers
- [ ] Preview uses monospace font (CodeMirror or pre-formatted text)

---

### 10.4 — Guided Builder — Save & Analyze [P0]

**As a** user
**I want** to save my wizard-built prompt and optionally analyze it immediately
**So that** I get the full PromptVault experience from the start

**Acceptance Criteria:**
- [ ] "Save" button on review step: saves prompt with auto-generated title/slug, navigates to editor
- [ ] "Save & Analyze" button: saves prompt, navigates to editor, auto-triggers analysis
- [ ] Prompt metadata (LLM, purpose, tags) inferred from wizard answers where possible
- [ ] User can override inferred metadata on the review step

---

### 10.5 — Onboarding Flow — Step 1: Welcome [P0]

**As a** new user
**I want** a welcoming first experience
**So that** I understand what PromptVault does and set up my workspace

**Acceptance Criteria:**
- [ ] Route: `/onboarding` (shown only once per user, tracked via user record flag)
- [ ] Full-screen layout, no sidebar. Step indicator at top (3 dots).
- [ ] Step 1 content:
  - "Welcome to PromptVault" headline
  - Workspace name input (pre-filled from account)
  - "What will you use PromptVault for?" — multi-select chips: Personal projects, Work/Team, Learning prompt engineering, API/SDK integration
  - Continue button
- [ ] After first-ever login, redirect to `/onboarding` (middleware or redirect)
- [ ] Subsequent logins go straight to `/dashboard`

---

### 10.6 — Onboarding Flow — Step 2: First Prompt [P0]

**As a** new user
**I want** to create my first prompt with guidance
**So that** I experience the core value immediately

**Acceptance Criteria:**
- [ ] Abbreviated guided builder: 3 fields only (role, task, output format)
- [ ] Live preview of assembled prompt (right side on desktop, below on mobile)
- [ ] "This is your first prompt!" encouragement text
- [ ] Save & Continue button — saves the prompt to the user's workspace

---

### 10.7 — Onboarding Flow — Step 3: First Analysis [P0]

**As a** new user
**I want** to run my first analysis and see the power of PromptVault
**So that** I understand the value of AI-powered analysis

**Acceptance Criteria:**
- [ ] Shows the prompt created in Step 2
- [ ] Big "Analyze" button
- [ ] Scores stream in with brief explanations
- [ ] "Apply top suggestion" button → saves improved version
- [ ] "Go to Dashboard" CTA to complete onboarding
- [ ] On complete: user record updated (onboarding complete flag), redirect to `/dashboard`

---

### 10.8 — Teaching Empty States [P0]

**As a** new user
**I want** empty states that help me get started
**So that** I'm never stuck looking at a blank page

**Acceptance Criteria:**
- [ ] Dashboard empty state: "Your vault is ready" + 3 example prompt cards (Customer Support, Code Reviewer, Blog Writer) with "Fork" buttons + "Create from scratch" + "Use guided builder"
- [ ] Prompt list empty state: "No prompts yet" + description + CTAs
- [ ] Blueprint list empty state: "No blueprints yet" + description + "What's a blueprint?" link
- [ ] Forking an example: copies it to user's vault, opens in editor
- [ ] Example prompts cover different use cases to inspire
- [ ] All empty states follow UIUX.md §15 spec
