# PromptVault — Product & Technical Plan

## 1. Product Vision

**PromptVault** is an API-first context engineering platform — a "secrets manager for prompts." Users and applications can store, version, parameterize, analyze, and optimize LLM prompts and full context blueprints. The app also serves as an active prompt engineering coach, teaching users to write better prompts and design better contexts through every interaction.

**Core value proposition:** Decouple prompts and context from application code. Update prompt wording in PromptVault, promote it to stable, and every consuming app picks up the change — no redeployment needed.

**Target users:**
- Individual developers building LLM-powered apps
- Teams managing prompts across multiple services
- Non-technical users who want to write better prompts
- Organizations running prompts at scale in production

---

## 2. Core Concepts

### Prompt as Template
Prompts are parameterized templates with `{{variables}}`, not static text. Apps fetch a prompt by key, pass parameters, and receive a resolved string ready for the LLM.

### Context Blueprint
The upgraded core unit. Instead of a single prompt, users design a **Context Blueprint** — a complete specification of everything the LLM receives, composed of ordered **Context Blocks** (system instructions, knowledge, examples, tools, history, task).

### Addressing Model
Every prompt/blueprint is addressable via: `workspace / app / prompt-key @ version`

Examples:
- `acme/customer-bot/greeting@latest`
- `acme/customer-bot/greeting@v2.1`
- `acme/summarizer/extract-action-items@stable`
- `personal/writing/blog-intro@latest`

Version tags: `@latest` (newest), `@stable` (promoted production version), `@v2.1` (pinned exact version).

### Prompt Intelligence Engine
A unified system that observes user behavior, profiles their skill level, and delivers personalized education, recommendations, and analysis — embedded into every surface of the app.

---

## 3. Feature Breakdown by Phase

### Phase 1 — MVP (Weeks 1-8)

#### Authentication & Accounts
- Sign up / login / password reset
- Email + OAuth (Google)
- Workspace creation on signup

#### Prompt/Blueprint CRUD
- Create, read, update, delete prompts and context blueprints
- Prompt fields: title, slug, LLM target, version, purpose, description, promptText, tags, parameterSchema, createdAt, updatedAt
- Context Blueprint fields: name, slug, description, targetLlm, totalTokenBudget, blockOrder, globalParameters

#### Context Block Types
- System, Knowledge, Examples, Tools, History, Task
- Each block has: content (template text), parameters, config (type-specific), position, conditional inclusion

#### Parameterized Templates
- `{{variable}}` syntax in prompt/block content
- JSON Schema for parameter definitions (types, required, defaults, enums)
- Parameter validation on resolve

#### Version Management
- Semver versioning on prompts, blocks, and blueprints
- Status lifecycle: `draft` -> `active` -> `stable` -> `deprecated`
- Version history with change notes
- Blueprint versions as snapshots of specific block versions

#### API — Core Endpoints
- **Auth:** signup, login, API key management (create/revoke, scoped)
- **Prompt CRUD:** GET/POST/PUT/DELETE for apps and prompts
- **Version management:** publish, list, promote versions
- **Resolve endpoint:** `POST /api/v1/resolve` — fetch + parameterize + return resolved prompt/blueprint
- Partial resolution support (unresolved params stay as placeholders)
- Response formats: single string or structured messages array

#### Search & Filter
- By title, LLM, purpose, tags, date, workspace, app

#### Dashboard
- Overview of all saved prompts/blueprints
- Quick stats (count, recent edits, most used)

#### AI Analysis Engine — Basic
- Multi-dimensional scoring: clarity (1-10), specificity (1-10), completeness, structure, robustness, efficiency
- Identified weaknesses and suggestions for improvement
- One-click enhance: auto-generate improved version, saved as new version
- Side-by-side diff: compare original vs enhanced
- Meta-prompt approach: send user prompt to Claude API with structured analysis instructions, parse JSON response

#### Context-Aware Analysis — Basic
- Token budget allocation analysis
- Information placement analysis (lost-in-the-middle detection)
- Redundancy/contradiction detection across blocks
- Context sufficiency check (does context support the task?)
- Grounding gap analysis (knowledge without usage instructions)
- Per-block targeted feedback

#### Context Quality Scoring
- Prompt scores: clarity, specificity, completeness, structure, robustness, efficiency
- Context scores: sufficiency, relevance, grounding, coherence, placement, budget efficiency, adaptability
- Radar chart visualization

#### Token Counter & Cost Estimator
- Token count across different tokenizers (Claude, GPT-4, Gemini)
- Cost per call estimate based on current API pricing
- Token savings suggestions

#### Ambiguity Detector
- Flag vague phrases ("a few", "recently", "short", "appropriate", "etc.")
- Suggest concrete replacements

#### Guided Prompt Builder (Wizard Mode)
- Step-by-step builder: role/persona, task, input format, output format, constraints, tone
- Assembles structured prompt from answers
- Key differentiator for non-technical users

#### Context Designer (Visual Editor)
- Vertical stack of blocks — add, reorder, configure, version independently
- Live token budget bar showing allocation per block
- Per-block actions: edit, analyze, history, reorder
- "Preview Full Context" — render assembled context with sample parameters
- Conditional block indicators and warnings (e.g., no grounding instructions)

#### Onboarding Flow
- 3-minute interactive tour: create first prompt with guided builder, run analysis, apply suggestion
- Empty states that teach: show example prompts to fork

#### Education — Basic
- Field-level hints on the prompt form (tooltips explaining each field)
- Analysis result explanations with "Why does this matter?" expandables
- 20 hand-crafted micro-lesson triggers (contextual, dismissible, non-repeating)
- Basic skill profiling (observed behavior, not displayed to user yet)

#### Knowledge Base — Initial
- Technique cards: few-shot, chain-of-thought, role prompting, XML tags, etc.
- Anti-pattern encyclopedia: "The Kitchen Sink", "The Vague Directive", "The Assumption Trap", "The Format Pray", "The Context Dump", "The Groundless Reference", "The Infinite History", "The Contradictory Layers", "The Missing Link", "One Priority Fits All"
- Glossary of terms (temperature, tokens, system prompt, RAG, etc.)
- Cross-linked from analysis results

---

### Phase 2 — Power Features (Weeks 9-14)

#### Prompt Playground
- Test prompts against one or more LLMs without leaving the app
- Fill in parameters, pick model, run, see response inline
- Closes the edit-test loop

#### A/B Comparison
- Run two prompt versions side-by-side against same input
- User rates which is better
- Builds dataset of prompt performance over time

#### Test Suites
- Define test cases: parameter inputs + expected output characteristics
- Run prompt against all test cases, report pass/fail
- Unit testing for prompts

#### Regression Detection
- On new version, auto-run previous version's test suite
- Flag regressions before promotion

#### Prompt Patterns Library
- Curated library of proven patterns (CoT, few-shot, role assignment, output formatting, self-critique, XML sections)
- Each pattern: description, when to use, when NOT to use, example, one-click insert
- Code-editor-style snippets

#### Model-Specific Optimization
- Adapt a prompt for a specific LLM (Claude prefers XML tags, GPT prefers system messages, open-source needs explicit formatting)
- Restructure prompt for target model

#### Smart Autocomplete / Suggestions
- Real-time margin suggestions as user writes
- Example: "Summarize this document" -> suggest specifying length, format, audience, priorities

#### Prompt Linter
- Configurable rules: must include output format, must define role, max token limit, must include examples for few-shot, no ambiguous quantifiers
- Enable/disable per workspace or app
- Runs on save

#### Prompt Compression
- Reduce tokens while preserving meaning and effectiveness
- Before/after token count and estimated savings

#### Few-Shot Example Generator
- Given purpose and parameter schema, auto-generate few-shot examples
- User reviews, edits, includes

#### Output Format Enforcer
- If user specifies JSON/Markdown/CSV, suggest additions for reliable format compliance
- Schema definitions, "respond ONLY with valid JSON", example outputs

#### Real-Time Prompt Coach (Sidebar)
- Watches as user types, provides live strategic guidance
- Missing elements, technique suggestions, complexity warnings, anti-pattern detection, model fit checks
- Three modes: Active, Subtle, Off

#### Visible Skill Profile Dashboard
- Display user's Prompt Engineering Skills: structure, techniques, specificity, complexity, model awareness (1-5 each)
- Display Context Engineering Skills: context design, grounding, token management, information architecture, dynamic context (1-5 each)
- Overall level and next growth area recommendations

#### Personalized Recommendations Dashboard
- "Your Prompt Health" summary (average scores, strengths, opportunities)
- Top 3 personalized recommendations with action buttons
- Weekly progress tracking

#### Before/After Showcase
- Curated feed of prompt transformations
- Mediocre prompt -> problems identified -> techniques applied -> improved version -> both outputs

#### "How Would an Expert Write This?"
- On any saved prompt, generate expert-level rewrite with inline annotations
- Explains WHY each change was made

#### Learning Paths — First Two
- **Prompt Foundations** (beginners): anatomy of a good prompt, being specific, output format, tone/audience, common mistakes
- **Intermediate Techniques**: few-shot, chain-of-thought, step-by-step decomposition, negative constraints, edge cases

#### Context Engineering Education
- New micro-lesson triggers for context (6+ triggers defined)
- Learning Path: **Context Engineering Foundations** (context layers, system instructions, reference knowledge, grounding)
- New technique cards: grounding instructions, context layering, token budget allocation, structured context formatting, conditional inclusion, knowledge delineation, negative context, context windowing strategies

#### Context Simulation & Preview
- "Render Context" — assemble full context as LLM would see it with sample values
- "What Does the Model See?" — attention heatmap overlay
- "What's Missing?" — diagnostic for gaps between task and provided context

#### Version Comparison Insights
- Annotated diffs showing what changed and whether it's improvement or regression

---

### Phase 3 — Platform & Growth (Weeks 15-20)

#### Folders / Collections
- Group prompts/blueprints into projects or workflows

#### Prompt Templates (Public)
- Pre-built starter prompts users can fork

#### Export
- Download prompts/blueprints as JSON, Markdown, CSV, YAML

#### Team Sharing
- Share prompts with collaborators within a workspace

#### Usage Analytics & Heatmaps
- Track most-resolved prompts, common parameters, versions in use
- Usage heatmaps for teams

#### API Access for Pro Users
- REST API with scoped API keys for external integrations

#### Community Prompt Gallery
- Optionally publish prompts to public gallery by use case
- Fork, rate, adapt
- Network effect / discovery engine

#### Prompt Chains / Pipelines
- Multi-step workflows: output of one prompt feeds parameters of another
- Each step references a prompt from the vault

#### Import from Conversation
- Paste ChatGPT/Claude conversation, extract effective prompt
- Strip back-and-forth, distill what worked

#### Git Sync
- Bidirectional sync with Git repository
- Prompts as YAML/JSON in `/prompts` directory
- Works with code review and deployment workflows

#### Prompt Challenges & Practice
- Weekly or on-demand scenarios
- User writes best prompt, system scores it, shows expert solution
- XP and badges toward skill profile
- Categories: customer support, content, data analysis, coding, creative writing

#### Comparative Learning Feed
- Curated transformations and community examples

#### Advanced Learning Paths
- **Advanced Patterns**: self-critique loops, multi-turn design, RAG optimization, prompt chaining, model-specific optimization
- **Production Prompt Engineering**: consistency at scale, parameterization, testing, token optimization, monitoring
- **Advanced Context Architecture**: token budget management, conditional context, knowledge structuring, context compression
- **Dynamic Context for Production**: RAG integration, history management, tool definitions, context pipelines, drift detection

#### Drift Alerts
- Detect when model updates cause output changes (via embedding comparison)
- Alert user that prompt may need re-tuning

#### Response Quality Tracking
- Track quality metrics over time from playground usage
- Average scores, failure rates, failure modes, trends per prompt

#### Prompt Comments & Annotations
- Inline comments on specific parts of a prompt (Google Docs style)
- Capture institutional knowledge ("This section causes hallucination on edge cases")

#### Prompt Changelog & Rationale
- Timeline view of version history with documented reasoning

#### Webhooks
- Notify apps when a prompt version is promoted to stable

#### Audit Log
- Every resolve, edit, version change logged with who/when/what

---

## 4. Data Model

### Workspace
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| slug | string | unique |
| name | string | |
| ownerId | UUID | FK -> User |
| plan | enum | free, pro, team |
| createdAt | timestamp | |

### User
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| email | string | unique |
| name | string | |
| passwordHash | string | |
| plan | enum | |
| skillProfile | JSON | prompt + context skill scores |
| createdAt | timestamp | |

### App
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| workspaceId | UUID | FK -> Workspace |
| slug | string | unique within workspace |
| name | string | |
| description | string | |
| defaultLlm | string | |
| defaultParams | JSON | |

### PromptTemplate
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| appId | UUID | FK -> App |
| workspaceId | UUID | FK -> Workspace |
| slug | string | unique within app |
| name | string | |
| purpose | string | category/use case |
| description | string | |
| tags | string[] | |
| parameterSchema | JSON | JSON Schema defining expected variables |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### PromptVersion
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| promptTemplateId | UUID | FK -> PromptTemplate |
| version | string | semver (e.g., "2.1.0") |
| templateText | string | prompt with `{{placeholders}}` |
| llm | string | target model |
| changeNote | string | |
| status | enum | draft, active, stable, deprecated |
| analysisResult | JSON | scores, suggestions |
| createdAt | timestamp | |

### ContextBlueprint
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| appId | UUID | FK -> App |
| workspaceId | UUID | FK -> Workspace |
| slug | string | unique within app |
| name | string | |
| description | string | |
| targetLlm | string | |
| totalTokenBudget | integer | |
| blockOrder | UUID[] | ordered list of block IDs |
| globalParameters | JSON | JSON Schema for cross-block params |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### ContextBlock
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| blueprintId | UUID | FK -> ContextBlueprint |
| type | enum | system, knowledge, examples, tools, history, task |
| slug | string | unique within blueprint |
| name | string | |
| description | string | |
| content | string | template text with `{{params}}` |
| parameters | JSON | JSON Schema for block-specific params |
| config | JSON | type-specific settings (see below) |
| position | integer | order within blueprint |
| isRequired | boolean | |
| isConditional | boolean | |
| condition | string | e.g., `"only include if {{plan_tier}} == 'enterprise'"` |
| createdAt | timestamp | |
| updatedAt | timestamp | |

#### Config by block type:

**Knowledge blocks:**
- `source`: static | parameter | rag | api
- `priority`: critical | high | medium | low
- `maxTokens`: number
- `truncationStrategy`: end | summarize | relevance_filter
- `groundingInstructions`: string

**Examples blocks:**
- `selectionStrategy`: all | most_relevant | random_n
- `maxExamples`: number

**History blocks:**
- `maxTurns`: number
- `summarizationThreshold`: number
- `summarizationPromptId`: FK (another blueprint)

**Tools blocks:**
- `toolDefinitions`: JSON[]
- `toolChoice`: auto | required | specific

### ContextBlockVersion
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| blockId | UUID | FK -> ContextBlock |
| version | string | |
| content | string | |
| config | JSON | |
| changeNote | string | |
| status | enum | draft, active, stable |
| analysisResult | JSON | |
| createdAt | timestamp | |

### BlueprintVersion
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| blueprintId | UUID | FK -> ContextBlueprint |
| version | string | |
| blockVersionSnapshot | JSON | maps each block to a specific version |
| status | enum | draft, active, stable |
| changeNote | string | |
| createdAt | timestamp | |

### APIKey
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| workspaceId | UUID | FK -> Workspace |
| keyHash | string | |
| label | string | |
| scopes | string[] | read, resolve, write, admin |
| appId | UUID | FK -> App, nullable (null = all apps) |
| expiresAt | timestamp | nullable |
| lastUsedAt | timestamp | |
| createdAt | timestamp | |

### Analysis
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| promptId | UUID | FK, nullable |
| blueprintId | UUID | FK, nullable |
| promptVersionId | UUID | FK, nullable |
| clarityScore | integer | 1-10 |
| specificityScore | integer | 1-10 |
| completenessScore | integer | 1-10 |
| structureScore | integer | 1-10 |
| robustnessScore | integer | 1-10 |
| efficiencyScore | integer | 1-10 |
| sufficiencyScore | integer | 1-10, context |
| relevanceScore | integer | 1-10, context |
| groundingScore | integer | 1-10, context |
| coherenceScore | integer | 1-10, context |
| placementScore | integer | 1-10, context |
| budgetEfficiencyScore | integer | 1-10, context |
| adaptabilityScore | integer | 1-10, context |
| weaknesses | string[] | |
| suggestions | string[] | |
| enhancedPromptText | string | |
| createdAt | timestamp | |

### ResolveLog
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| promptVersionId | UUID | FK, nullable |
| blueprintVersionId | UUID | FK, nullable |
| apiKeyId | UUID | FK |
| resolvedAt | timestamp | |
| parametersUsedHash | string | redacted hash |
| latencyMs | integer | |

---

## 5. API Design

All endpoints are prefixed with `/api/v1`. The REST API is the primary interface; the UI is one consumer of it.

### Auth & Keys
```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/api-keys                    -> create scoped API key
DELETE /api/v1/api-keys/:id
```

### Prompt Management (CRUD)
```
GET    /api/v1/apps/:app/prompts
POST   /api/v1/apps/:app/prompts
GET    /api/v1/apps/:app/prompts/:slug
PUT    /api/v1/apps/:app/prompts/:slug
DELETE /api/v1/apps/:app/prompts/:slug

POST   /api/v1/apps/:app/prompts/:slug/versions       -> publish new version
GET    /api/v1/apps/:app/prompts/:slug/versions        -> list all versions
PATCH  /api/v1/apps/:app/prompts/:slug/versions/:v     -> promote to stable
```

### Blueprint Management (CRUD)
```
GET    /api/v1/apps/:app/blueprints
POST   /api/v1/apps/:app/blueprints
GET    /api/v1/apps/:app/blueprints/:slug
PUT    /api/v1/apps/:app/blueprints/:slug
DELETE /api/v1/apps/:app/blueprints/:slug

POST   /api/v1/apps/:app/blueprints/:slug/blocks       -> add block
PUT    /api/v1/apps/:app/blueprints/:slug/blocks/:id    -> update block
DELETE /api/v1/apps/:app/blueprints/:slug/blocks/:id    -> remove block
PATCH  /api/v1/apps/:app/blueprints/:slug/blocks/order  -> reorder blocks

POST   /api/v1/apps/:app/blueprints/:slug/versions      -> publish version
GET    /api/v1/apps/:app/blueprints/:slug/versions       -> list versions
PATCH  /api/v1/apps/:app/blueprints/:slug/versions/:v    -> promote
```

### Resolve (The Key Endpoint)
```
POST /api/v1/resolve
```

**Request:**
```json
{
  "ref": "acme/customer-bot/greeting@stable",
  "parameters": {
    "user_name": "Sarah",
    "plan_tier": "pro"
  },
  "options": {
    "format": "string" | "messages",
    "includeMetadata": true
  }
}
```

**Response:**
```json
{
  "resolved": "...",
  "version": "2.1.0",
  "unresolved_params": ["user_query"],
  "prompt_id": "p_abc123",
  "llm": "claude-sonnet-4-5-20250514",
  "metadata": {
    "totalTokens": 4850,
    "tokenBreakdown": { ... },
    "blocksIncluded": [...],
    "blocksExcluded": [...]
  }
}
```

Supports partial resolution — unresolved params stay as `{{placeholders}}` for the app to fill at call time.

### Analysis & Enhancement
```
POST /api/v1/apps/:app/prompts/:slug/analyze
POST /api/v1/apps/:app/prompts/:slug/enhance
POST /api/v1/apps/:app/blueprints/:slug/analyze
```

### Workspace & App Management
```
GET    /api/v1/workspaces
POST   /api/v1/workspaces
GET    /api/v1/workspaces/:slug/apps
POST   /api/v1/workspaces/:slug/apps
```

### Caching
- Resolve responses include `Cache-Control` and `ETag` headers
- Apps can cache prompts locally and refresh efficiently

---

## 6. SDK / Client Libraries

Lightweight SDKs for common languages, making the app feel like a secrets manager.

### Node.js
```javascript
import { PromptVault } from '@promptvault/sdk';

const vault = new PromptVault({
  apiKey: process.env.PROMPTVAULT_API_KEY,
  workspace: 'acme'
});

const prompt = await vault.resolve('customer-bot/greeting@stable', {
  user_name: 'Sarah',
  plan_tier: 'pro'
});

// prompt.text, prompt.llm, prompt.version
```

### Python
```python
from promptvault import PromptVault

vault = PromptVault(api_key=os.environ["PROMPTVAULT_API_KEY"], workspace="acme")

prompt = vault.resolve("summarizer/extract-action-items@stable", {
    "document_type": "meeting_notes",
    "output_format": "bullet_list"
})

# prompt.text, prompt.llm, prompt.version
```

---

## 7. AI Analysis Engine

### How It Works
When a user clicks "Analyze," the backend calls the Claude API with a meta-prompt:

> "You are a prompt engineering expert. Analyze the following prompt intended for {llm}. Rate it on clarity (1-10), specificity (1-10), completeness, structure, robustness, and efficiency. Identify weaknesses and suggest improvements. Then provide an enhanced version. Return your response as structured JSON."

The structured response is parsed and stored in the database, keeping the UX clean and data queryable.

### Analysis Dimensions

**Prompt Scores:**
- Clarity — is the instruction unambiguous?
- Specificity — are details concrete, not vague?
- Completeness — are all necessary instructions present?
- Structure — is it well-organized?
- Robustness — will it handle edge cases?
- Efficiency — concise or bloated?

**Context Scores (for blueprints):**
- Sufficiency — does context contain everything needed?
- Relevance — is everything included actually useful?
- Grounding — are there instructions for using reference material?
- Coherence — do all blocks work together without contradiction?
- Placement — is critical info positioned where the model attends?
- Budget Efficiency — how well is the token budget allocated?
- Adaptability — does context handle edge cases and conditionals?

### Deterministic vs. LLM-Powered
- Skill profiling and recommendation prioritization: **deterministic rules** (keeps costs predictable)
- Analysis, enhancement, and scoring: **LLM API calls**

---

## 8. Prompt Intelligence Engine (Education & Recommendations)

### Adaptive Skill Profiling
Silently tracks user behavior across dimensions:

**Prompt Engineering:** structure, techniques, specificity, complexity, model awareness (1-5 each)
**Context Engineering:** context design, grounding, token management, information architecture, dynamic context (1-5 each)

Updates on every save/edit. Drives all recommendations and education content.

### Contextual Micro-Lessons
2-4 sentence insights triggered by specific user behavior. Dismissible, non-repeating, progressively advanced. Each has an optional "Learn more" expansion.

### Real-Time Prompt Coach
Sidebar panel with live suggestions: missing elements, technique suggestions, complexity warnings, anti-pattern detection, model fit checks. Three modes: Active, Subtle, Off.

### Interactive Learning Paths
1. Prompt Foundations (beginner)
2. Intermediate Techniques
3. Advanced Patterns
4. Production Prompt Engineering
5. Context Engineering Foundations
6. Advanced Context Architecture
7. Dynamic Context for Production

Each lesson: 5-10 min, concept explanation, before/after example, apply to own prompt, system feedback, badge on completion.

### Prompt Challenges
Scenario-based exercises. User writes prompt, system scores it, runs it, highlights strengths/gaps, shows expert solution with annotations. XP and badges.

### Personalized Recommendations Dashboard
- "Your Prompt Health" summary
- Top 3 ranked recommendations with action buttons
- Weekly progress tracking

### Knowledge Base
- **Technique Cards:** one page per technique with when to use, when NOT, examples, model compatibility, one-click insert
- **Model Guides:** living comparison of LLM differences
- **Anti-Pattern Encyclopedia:** named mistakes with explanations and fixes
- **Glossary:** quick definitions of terms
- All cross-linked from analysis results

---

## 9. Recommended Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js (App Router) + Tailwind CSS | Fast, SEO-friendly, great DX |
| Auth | NextAuth.js (Auth.js) or Clerk | Easy OAuth + email auth |
| Database | PostgreSQL (via Supabase or Neon) | Relational, great for structured data |
| ORM | Prisma or Drizzle | Type-safe DB queries |
| AI Analysis | Anthropic Claude API | Powers analysis/enhancement engine |
| Hosting | Vercel or Netlify | Seamless Next.js deploys |
| Payments | Stripe | Freemium/pro tier billing |
| File Storage | S3 / Cloudflare R2 (optional) | For attachments if added later |

---

## 10. Monetization — Freemium Model

| Feature | Free | Pro ($12/mo) | Team ($30/mo) |
|---------|------|-------------|---------------|
| Workspaces | 1 | 3 | Unlimited |
| Apps | 2 | 10 | Unlimited |
| Prompts | 25 | Unlimited | Unlimited |
| API resolves | 500/mo | 10,000/mo | 100,000/mo |
| AI analyses | 5/mo | 100/mo | 500/mo |
| API keys | 2 | 10 | Unlimited |
| Version history | Last 3 | Unlimited | Unlimited |
| Audit log | 7 days | 90 days | 1 year |
| Export | No | Yes | Yes |
| Collections/Folders | 3 | Unlimited | Unlimited |
| Webhooks | No | Yes | Yes |
| Team members | 1 | 1 | 10 |
| API access | No | Yes | Yes |

---

## 11. Build Timeline

| Phase | Scope | Duration |
|-------|-------|----------|
| Week 1-2 | Auth, DB schema, prompt/blueprint CRUD, basic UI | 2 weeks |
| Week 3 | Dashboard, search/filter, tags, context designer UI | 1 week |
| Week 4 | AI analysis integration, version history, token counter | 1 week |
| Week 5 | Enhance/diff view, guided builder, ambiguity detector | 1 week |
| Week 6 | Stripe billing, freemium gates, onboarding flow | 1 week |
| Week 7-8 | Micro-lessons, knowledge base, field hints, testing, deploy | 1-2 weeks |
| **MVP Total** | | **~6-8 weeks** |
| Week 9-11 | Playground, A/B comparison, test suites, prompt coach | 3 weeks |
| Week 12-14 | Skill profiles, recommendations, learning paths, linter | 3 weeks |
| **V2 Total** | | **~6 weeks** |
| Week 15-17 | Community gallery, challenges, export, git sync | 3 weeks |
| Week 18-20 | Prompt chains, drift alerts, advanced learning, webhooks | 3 weeks |
| **V3 Total** | | **~6 weeks** |

---

## 12. Secrets-Manager-Style Features

These patterns make the app feel like a vault for production use:

- **Scoped API keys** — restrict to specific apps or read-only
- **Environment promotion** — draft -> active -> stable -> deprecated lifecycle
- **Audit log** — every resolve, edit, version change logged
- **Caching headers** — Cache-Control + ETag on resolve responses
- **Webhooks** — notify apps when versions are promoted
- **Import/Export** — bulk JSON/YAML, enabling Git-based version control
- **Partial resolution** — resolve some params, leave others for runtime

---

## 13. Architecture Overview

```
+----------------+     +----------------+     +----------------+
|   Web UI       |     |   Your App     |     |   CI/CD        |
|   (manage)     |     |   (consume)    |     |   (deploy)     |
+-------+--------+     +-------+--------+     +-------+--------+
        |                      |                      |
        |    REST API + SDK    |                      |
        v                      v                      v
+----------------------------------------------------------+
|                    PromptVault API                        |
|                                                          |
|  +----------+  +----------+  +----------+  +-----------+ |
|  | Auth &   |  | Prompt & |  | Resolve  |  |    AI     | |
|  | Keys     |  | Blueprint|  | Engine   |  | Analysis  | |
|  |          |  | CRUD     |  |          |  | & Coach   | |
|  +----------+  +----------+  +----------+  +-----------+ |
|                                                          |
|  +----------------------------------------------------+  |
|  |  Prompt Intelligence Engine                        |  |
|  |  Skill Profiler | Pattern Detector | Content Select|  |
|  |  -> Recommendation Prioritizer                     |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +----------------------------------------------------+  |
|  |              PostgreSQL                             |  |
|  |  Workspaces -> Apps -> Blueprints -> Blocks         |  |
|  |                    -> Templates  -> Versions        |  |
|  +----------------------------------------------------+  |
+----------------------------------------------------------+
```

---

## 14. Key Design Principles

1. **API-first** — the UI is one consumer of the API; apps and SDKs are equal citizens
2. **Everything is versionable** — prompts, blocks, and blueprints all have independent version histories
3. **Parameterization over hardcoding** — prompts are templates, not static text
4. **Context is a first-class concern** — not just prompt text, but the full context window is designed and analyzed
5. **Education is embedded, not bolted on** — every surface teaches; nothing is forced
6. **Progressive disclosure** — beginners get guided, intermediates get nudged, experts get data
7. **Deterministic where possible** — use rules for profiling/recommendations, LLM calls only for analysis/enhancement
8. **Decoupled from application code** — update prompts without redeploying apps

---

## 15. Suggested First Steps

1. **Set up the repo** — Next.js + Prisma + Supabase scaffold
2. **Build the database schema** — implement the data model above
3. **Auth + basic CRUD** — get the core loop working (create/edit/list prompts)
4. **Resolve endpoint** — the key API that makes the product useful for apps
5. **Context Designer UI** — the visual editor for building blueprints
6. **AI analysis integration** — connect to Claude API for scoring and enhancement
7. **Ship MVP early** — launch with Phase 1, iterate based on feedback
