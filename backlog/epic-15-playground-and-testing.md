# Epic 15 — Prompt Playground & Testing

**Phase:** 2 (Power Features)
**Estimated:** Week 9-10
**Dependencies:** Epic 05 (Prompt Editor), Epic 08 (Resolve Engine), Epic 09 (AI Analysis)
**References:** PLAN.md §3 Phase 2 (Playground, A/B Comparison, Test Suites, Regression Detection); UIUX.md §5.10

## Goal

Build the prompt playground where users can test prompts against LLMs without leaving the app, including A/B comparison and test suites. This closes the edit-test loop.

---

## Stories

### 15.1 — Playground Page [P0]

**As a** user
**I want** to test my prompts against an LLM
**So that** I can see how they perform with real input

**Acceptance Criteria:**
- [ ] Route: `/playground`
- [ ] Added to sidebar navigation (previously disabled/hidden)
- [ ] Layout (see UIUX.md §5.10):
  - Prompt selector: dropdown to pick a saved prompt/blueprint, or "Paste raw prompt" mode
  - Parameters form: auto-generated from prompt's parameter schema
  - Model selector: Claude Sonnet, Claude Opus, GPT-4o, Gemini Pro
  - Settings: temperature slider, max tokens input
  - "Run" button
  - Response area: streams AI response token-by-token
- [ ] Response footer: token count, latency, estimated cost
- [ ] Multiple runs shown in scrollable history (most recent first)
- [ ] **Mobile:** single column, response area expands to near-full screen when streaming

---

### 15.2 — Playground — Blueprint Support [P0]

**As a** user
**I want** to test full blueprints in the playground
**So that** I can see the assembled context in action

**Acceptance Criteria:**
- [ ] Prompt selector includes blueprints
- [ ] When blueprint selected, parameters merge from all blocks
- [ ] "View assembled context" toggle shows the resolved context
- [ ] Response uses the assembled context as the full prompt

---

### 15.3 — Playground — Test from Editor [P1]

**As a** user
**I want** to jump from the editor to the playground with my current prompt
**So that** I can test without manual setup

**Acceptance Criteria:**
- [ ] "Test Run" button in prompt editor header
- [ ] "Test Run" button in context designer action bar
- [ ] Opens playground with current prompt/blueprint pre-loaded
- [ ] Parameters pre-populated with any defaults defined

---

### 15.4 — A/B Comparison Mode [P0]

**As a** user
**I want** to compare two prompt versions side-by-side
**So that** I can determine which version performs better

**Acceptance Criteria:**
- [ ] "A/B Compare" button in playground
- [ ] Split response area into two columns
- [ ] Each column: version selector (or different model) + response area
- [ ] Same parameters applied to both versions
- [ ] Run both simultaneously
- [ ] "Which is better?" thumbs up/down on each response
- [ ] Rating stored for future analytics
- [ ] **Mobile:** stacked (version A on top, B below), swipe to compare

---

### 15.5 — Test Suite Definition [P1]

**As a** user
**I want** to define test cases for my prompts
**So that** I can systematically verify prompt behavior

**Acceptance Criteria:**
- [ ] Test suite editor accessible from prompt editor ("Tests" tab/section)
- [ ] Each test case defines:
  - Name / description
  - Parameter inputs (JSON or form)
  - Expected output characteristics (contains, does not contain, matches regex, JSON schema, max length)
- [ ] Save test suite linked to prompt
- [ ] CRUD for test cases (add, edit, delete, reorder)

---

### 15.6 — Test Suite Runner [P1]

**As a** user
**I want** to run my test suite and see results
**So that** I can validate my prompt against defined expectations

**Acceptance Criteria:**
- [ ] "Run tests" button on test suite
- [ ] Executes prompt against each test case
- [ ] Results: pass/fail per test case with actual output
- [ ] Summary: X/Y tests passed, overall pass/fail status
- [ ] Failed tests show expected vs actual comparison
- [ ] Results stored in database for historical tracking

---

### 15.7 — Regression Detection [P2]

**As a** user
**I want** automatic regression testing when I create a new version
**So that** I catch performance drops before promoting

**Acceptance Criteria:**
- [ ] On new version creation, if test suite exists, auto-run tests
- [ ] Compare results with previous version's test run
- [ ] Flag regressions (tests that previously passed but now fail)
- [ ] Warning shown in version promotion dialog: "2 test cases regressed"
- [ ] User can still promote despite regressions (with acknowledgment)
