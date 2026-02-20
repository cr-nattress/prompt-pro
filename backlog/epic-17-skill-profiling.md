# Epic 17 — Skill Profiling & Personalization

**Phase:** 2 (Power Features)
**Estimated:** Week 11-12
**Dependencies:** Epic 12 (Education MVP — silent tracking)
**References:** PLAN.md §3 Phase 2 (Visible Skill Profile, Personalized Recommendations); UIUX.md §5 (Dashboard); PLAN.md §8

## Goal

Make the user's skill profile visible, build the personalized recommendations dashboard, and add weekly progress tracking.

---

## Stories

### 17.1 — Skill Profile Dashboard [P0]

**As a** user
**I want** to see my prompt and context engineering skill levels
**So that** I understand my strengths and growth areas

**Acceptance Criteria:**
- [ ] Skill profile section accessible from dashboard and/or settings
- [ ] `SkillProfile` component displays:
  - **Prompt Engineering Skills (1-5 each):** structure, techniques, specificity, complexity, model awareness
  - **Context Engineering Skills (1-5 each):** context design, grounding, token management, information architecture, dynamic context
- [ ] Visualization: radar chart variant (Recharts) or horizontal bar chart
- [ ] Overall level label (e.g., "Intermediate Prompt Engineer")
- [ ] "Next growth area" recommendation: identifies the lowest skill and suggests how to improve
- [ ] Skill levels update after each save/analyze action (previously silent, now visible)

---

### 17.2 — Personalized Recommendations Dashboard [P0]

**As a** user
**I want** a "Your Prompt Health" summary with actionable recommendations
**So that** I know what to improve next and can take action

**Acceptance Criteria:**
- [ ] Dashboard section (enhanced from Epic 13.4):
  - "Your Prompt Health" summary card: average prompt score, average context score, total prompts analyzed
  - Top 3 personalized recommendations ranked by impact
  - Each recommendation: title, description, action button, estimated impact
- [ ] Recommendation types (prioritized by skill profile):
  - "Improve your weakest prompt" (links to editor with analysis)
  - "Add examples to high-use prompts" (links to technique card + editor)
  - "Try chain-of-thought for complex tasks" (links to learning path)
  - "Your blueprints lack grounding — add instructions" (links to specific blueprint)
  - "Complete Prompt Foundations learning path" (links to learning path)
- [ ] Recommendations refresh on page load (deterministic prioritization based on skill profile + prompt data)

---

### 17.3 — Weekly Progress Tracking [P1]

**As a** user
**I want** to see how my skills have improved over time
**So that** I stay motivated and track my learning

**Acceptance Criteria:**
- [ ] Weekly snapshot of skill scores stored in database
- [ ] Dashboard card: "This week's progress"
  - Skills that improved (with delta)
  - Total prompts created/edited this week
  - Analyses run this week
  - Prompts improved (score increased) this week
- [ ] Simple trend visualization (sparklines or small bar chart)
- [ ] Historical view: last 8 weeks of skill progression

---

### 17.4 — "How Would an Expert Write This?" [P1]

**As a** user
**I want** to see an expert-level rewrite of my prompt
**So that** I learn by example

**Acceptance Criteria:**
- [ ] "Expert View" button in analysis panel (previously hidden/disabled)
- [ ] Calls Claude API with: user's prompt + instruction to rewrite as an expert + annotate each change
- [ ] Response streams in showing:
  - Expert rewrite of the prompt
  - Inline annotations explaining WHY each change was made
  - Techniques applied (links to knowledge base technique cards)
- [ ] Side-by-side: user's version (left) vs expert version (right)
- [ ] "Apply expert version" button to adopt the rewrite

---

### 17.5 — Before/After Showcase [P2]

**As a** user
**I want** to see examples of prompt transformations
**So that** I can learn from real improvements

**Acceptance Criteria:**
- [ ] Curated feed of prompt transformations (initially hand-crafted, later community-sourced)
- [ ] Each entry: mediocre prompt → problems identified → techniques applied → improved version → comparison of both outputs
- [ ] Accessible from Learn section or dashboard
- [ ] Categories: customer support, content, data analysis, coding, creative writing
- [ ] "Try this pattern on your prompts" link
