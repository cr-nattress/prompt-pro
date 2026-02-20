# Epic 20 — Community & Social

**Phase:** 3 (Platform & Growth)
**Estimated:** Week 15-16
**Dependencies:** Epic 05 (Prompts), Epic 11 (Billing), Epic 17 (Skill Profiling)
**References:** PLAN.md §3 Phase 3 (Community Prompt Gallery, Prompt Challenges, Comparative Learning Feed, Public Templates)

## Goal

Build the community layer — a public gallery for sharing prompts, challenge/practice system for learning, and a comparative learning feed. This is the network-effects growth engine.

---

## Stories

### 20.1 — Community Prompt Gallery [P0]

**As a** user
**I want** to browse publicly shared prompts
**So that** I can discover and fork prompts for my own use

**Acceptance Criteria:**
- [ ] Route: `/gallery` (public, but fork requires auth)
- [ ] Added to sidebar navigation
- [ ] Browse prompts published to the gallery by other users
- [ ] Filter by: category/purpose, LLM, score, popularity (forks), recency
- [ ] Search within gallery
- [ ] Each gallery item shows: title, author, purpose, LLM, score, fork count, description preview
- [ ] Detail view: full prompt text (read-only), analysis scores, parameters, usage instructions
- [ ] "Fork" button: copies prompt to user's vault and opens editor
- [ ] "Rate" action: 1-5 stars (logged-in users only)
- [ ] Pagination or infinite scroll

---

### 20.2 — Publish to Gallery [P0]

**As a** user
**I want** to share my prompts publicly
**So that** others can benefit from my work

**Acceptance Criteria:**
- [ ] "Publish to Gallery" action on any prompt (from editor or list context menu)
- [ ] Before publishing, user fills in:
  - Category (required)
  - Description/usage notes (required)
  - License acknowledgment (prompts published are CC-BY)
- [ ] Only `stable` versions can be published
- [ ] User can unpublish at any time
- [ ] Published prompts show author name (or "Anonymous" option)
- [ ] Updates to the published prompt auto-update the gallery listing (new stable version)

---

### 20.3 — Prompt Challenges [P0]

**As a** user
**I want** practice challenges to improve my prompt engineering
**So that** I can learn through hands-on exercises

**Acceptance Criteria:**
- [ ] Route: `/learn/challenges`
- [ ] Challenge structure:
  - Scenario description (e.g., "Build a customer support response prompt for a SaaS product")
  - Requirements/constraints
  - User writes their best prompt in an embedded editor
  - "Submit" → system scores the prompt against challenge criteria
  - Results: score breakdown, strengths, gaps
  - "Show expert solution" → expert-crafted prompt with annotations
- [ ] Challenge categories: customer support, content creation, data analysis, coding, creative writing
- [ ] Challenge difficulty: beginner, intermediate, advanced
- [ ] Weekly featured challenge (curated)
- [ ] XP and completion badges toward skill profile

---

### 20.4 — Challenge Leaderboard [P2]

**As a** competitive user
**I want** to see how my challenge scores compare to others
**So that** I'm motivated to improve

**Acceptance Criteria:**
- [ ] Per-challenge leaderboard: top scores (anonymized by default)
- [ ] Overall leaderboard: total XP, challenges completed
- [ ] User can opt-in to show their name on leaderboards
- [ ] "Your rank" indicator

---

### 20.5 — Comparative Learning Feed [P2]

**As a** user
**I want** a curated feed of prompt transformations and community examples
**So that** I can learn by seeing what works

**Acceptance Criteria:**
- [ ] Feed on dashboard or in Learn section
- [ ] Content types: curated transformations (before/after), community highlights (top-rated gallery prompts), challenge showcases
- [ ] Each entry: visual before/after, explanation of techniques applied
- [ ] Refreshes weekly or on-demand
- [ ] "Try this pattern" link to apply the technique to own prompts

---

### 20.6 — Prompt Templates (Starters) [P1]

**As a** user
**I want** pre-built starter prompts I can fork
**So that** I don't have to start from scratch

**Acceptance Criteria:**
- [ ] Curated templates distinct from community gallery (official, high quality)
- [ ] Templates organized by use case: writing, support, coding, analysis, creative, education
- [ ] Each template: purpose, target LLM, pre-filled content, parameters defined
- [ ] "Use this template" button forks to user's vault
- [ ] Templates referenced from onboarding empty states (replaces hand-crafted examples)
