# Epic 24 — Advanced Education

**Phase:** 3 (Platform & Growth)
**Estimated:** Week 19-20
**Dependencies:** Epic 18 (Learning Paths v2), Epic 17 (Skill Profiling)
**References:** PLAN.md §3 Phase 3 (Advanced Learning Paths); PLAN.md §8 (Learning Paths 3-7)

## Goal

Complete the education system with advanced learning paths, model guides, and the full "prompt engineering academy" experience that differentiates PromptVault from simple prompt storage tools.

---

## Stories

### 24.1 — Learning Path: Advanced Patterns [P0]

**As an** advanced user
**I want** to learn advanced prompt engineering patterns
**So that** I can handle complex, production-grade scenarios

**Acceptance Criteria:**
- [ ] **Path: Advanced Patterns** (5 lessons):
  1. Self-Critique Loops — prompting the LLM to evaluate and improve its own output
  2. Multi-Turn Design — designing prompts for conversational flows
  3. RAG Optimization — writing prompts that work with retrieved context
  4. Prompt Chaining — decomposing complex tasks into connected prompts
  5. Model-Specific Optimization — adapting prompts for different LLMs
- [ ] Pre-requisite: Intermediate Techniques
- [ ] Exercises involve multi-step scenarios
- [ ] Expert-level before/after examples

---

### 24.2 — Learning Path: Production Prompt Engineering [P0]

**As a** developer
**I want** to learn production-grade prompt engineering
**So that** my prompts are reliable, testable, and maintainable

**Acceptance Criteria:**
- [ ] **Path: Production Prompt Engineering** (5 lessons):
  1. Consistency at Scale — making prompts produce reliable output across thousands of calls
  2. Parameterization — designing flexible templates with well-defined variables
  3. Testing & Validation — building test suites, regression testing
  4. Token Optimization — reducing costs without sacrificing quality
  5. Monitoring & Alerting — tracking quality, detecting drift
- [ ] Pre-requisite: Advanced Patterns
- [ ] Exercises use the playground and test suite features
- [ ] Practical focus on real production scenarios

---

### 24.3 — Learning Path: Advanced Context Architecture [P1]

**As a** context engineer
**I want** to master advanced context design
**So that** I can build sophisticated context blueprints

**Acceptance Criteria:**
- [ ] **Path: Advanced Context Architecture** (5 lessons):
  1. Token Budget Management — allocating tokens across competing priorities
  2. Conditional Context — adapting context based on runtime parameters
  3. Knowledge Structuring — organizing reference material for maximum impact
  4. Context Compression — saying more with fewer tokens
  5. Multi-Source Context — combining static, dynamic, and retrieved context
- [ ] Pre-requisite: Context Engineering Foundations
- [ ] Exercises involve building complex blueprints

---

### 24.4 — Learning Path: Dynamic Context for Production [P1]

**As a** developer building production AI systems
**I want** to learn dynamic context engineering
**So that** my context blueprints handle real-world complexity

**Acceptance Criteria:**
- [ ] **Path: Dynamic Context for Production** (5 lessons):
  1. RAG Integration — connecting retrieval to context blocks
  2. History Management — summarization, windowing, prioritization
  3. Tool Definitions — structuring tool-use context for reliable function calling
  4. Context Pipelines — assembling context from multiple sources at runtime
  5. Drift Detection & Maintenance — monitoring context effectiveness over time
- [ ] Pre-requisite: Advanced Context Architecture
- [ ] Most advanced path — targets senior engineers
- [ ] Exercises connect to resolve engine and analytics

---

### 24.5 — Model Guides [P0]

**As a** user
**I want** living comparison guides for different LLMs
**So that** I can choose the right model and optimize for it

**Acceptance Criteria:**
- [ ] Model Guides section in Knowledge Base
- [ ] Guides for: Claude (Sonnet, Opus, Haiku), GPT-4o, Gemini Pro
- [ ] Each guide:
  - Strengths and weaknesses
  - Preferred prompt structure
  - Supported features (function calling, JSON mode, system messages)
  - Token limits and pricing
  - Best practices specific to this model
  - Anti-patterns that affect this model more than others
- [ ] Comparison table across all models
- [ ] Updated periodically as models evolve
- [ ] Cross-linked from analysis results (when model-specific advice is given)

---

### 24.6 — Skill-Based Content Unlocking [P2]

**As a** user
**I want** advanced content unlocked as my skills improve
**So that** I don't get overwhelmed but always have something to learn next

**Acceptance Criteria:**
- [ ] Learning paths marked with required skill level
- [ ] Paths for higher skill levels show as "locked" with requirements
- [ ] Micro-lessons adapt depth based on skill profile (beginners get basics, advanced users get nuance)
- [ ] "Ready for the next level" notification when skill threshold reached
- [ ] Knowledge base articles tagged with difficulty level

---

### 24.7 — Completion Badges & Certificates [P2]

**As a** user
**I want** badges for completing learning paths and challenges
**So that** my learning achievements are recognized

**Acceptance Criteria:**
- [ ] Badge awarded on learning path completion
- [ ] Challenge completion XP and badges
- [ ] Badge display on profile and skill dashboard
- [ ] Badge types: path completion (e.g., "Prompt Foundations Graduate"), challenge achievement (e.g., "Challenge Champion"), milestone (e.g., "100 Prompts Created")
- [ ] Shareable badge links (for LinkedIn, portfolio)
