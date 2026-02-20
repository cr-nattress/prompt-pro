# Epic 22 — Integrations & Platform

**Phase:** 3 (Platform & Growth)
**Estimated:** Week 17-18
**Dependencies:** Epic 08 (REST API), Epic 07 (Versions)
**References:** PLAN.md §3 Phase 3 (Git Sync, Export, Import from Conversation, Prompt Chains, Webhooks)

## Goal

Build platform integrations — Git sync, export/import, prompt chains, and webhooks — that make PromptVault a production-grade tool for engineering teams.

---

## Stories

### 22.1 — Export [P0]

**As a** user
**I want** to export my prompts and blueprints
**So that** I have local copies and can use them in other tools

**Acceptance Criteria:**
- [ ] Export action on individual prompts and blueprints
- [ ] Bulk export from list page (select multiple → Export)
- [ ] Export formats: JSON, YAML, Markdown, CSV
- [ ] JSON/YAML includes: full metadata, parameters, all versions (or latest only option)
- [ ] Markdown format: human-readable document suitable for Git storage
- [ ] CSV format: spreadsheet-friendly (one row per prompt, columns for fields)
- [ ] Pro/Team plan only (free plan shows upgrade prompt)

---

### 22.2 — Import [P1]

**As a** user
**I want** to import prompts from files
**So that** I can migrate existing prompts into PromptVault

**Acceptance Criteria:**
- [ ] Import action on prompts list page
- [ ] Supported formats: JSON, YAML (matching export format)
- [ ] Drag-and-drop file upload or file picker
- [ ] Preview imported items before confirming
- [ ] Conflict handling: skip duplicates, overwrite, or create copies
- [ ] Progress indicator for bulk imports

---

### 22.3 — Import from Conversation [P1]

**As a** user
**I want** to paste a ChatGPT/Claude conversation and extract the effective prompt
**So that** I can save prompts discovered through conversation

**Acceptance Criteria:**
- [ ] "Import from conversation" action
- [ ] Paste full conversation text into a textarea
- [ ] AI analyzes the conversation and:
  - Identifies the effective prompt(s) that produced good results
  - Strips back-and-forth, distills what worked
  - Suggests a clean, parameterized version
- [ ] Preview the extracted prompt(s) before saving
- [ ] Save to vault as new prompt(s)

---

### 22.4 — Git Sync [P1]

**As a** developer
**I want** to sync my prompts with a Git repository
**So that** prompts are version-controlled alongside code

**Acceptance Criteria:**
- [ ] Git Sync settings section in workspace settings
- [ ] Connect a GitHub repository (via GitHub App or OAuth)
- [ ] Configure sync directory (default: `/prompts`)
- [ ] Sync format: YAML or JSON files, one per prompt/blueprint
- [ ] **Push:** changes in PromptVault → commit to repo
- [ ] **Pull:** changes in repo → update in PromptVault (webhook on push)
- [ ] Bidirectional sync with conflict detection
- [ ] Git history supplements PromptVault version history
- [ ] Pro/Team plan only

---

### 22.5 — Webhooks [P0]

**As a** developer
**I want** webhook notifications when prompt versions are promoted
**So that** my apps can react to prompt updates

**Acceptance Criteria:**
- [ ] Webhook configuration in workspace settings
- [ ] Create webhook: URL, events to subscribe to, secret for signature verification
- [ ] Events:
  - `prompt.version.promoted` — a version was promoted (to active or stable)
  - `blueprint.version.promoted` — same for blueprints
  - `prompt.created`, `prompt.deleted`
  - `blueprint.created`, `blueprint.deleted`
- [ ] Webhook payload includes: event type, resource data, version info, timestamp
- [ ] HMAC signature in `X-Webhook-Signature` header
- [ ] Delivery logs: recent webhook deliveries with status (success/failure), response code, retry count
- [ ] Retry on failure (3 attempts with exponential backoff)
- [ ] Pro/Team plan only

---

### 22.6 — Prompt Chains / Pipelines [P2]

**As a** power user
**I want** to chain prompts into multi-step workflows
**So that** the output of one prompt feeds the next

**Acceptance Criteria:**
- [ ] Visual pipeline editor: nodes are prompts/blueprints, edges define data flow
- [ ] Each step references a prompt from the vault
- [ ] Output of step N maps to parameters of step N+1
- [ ] Pipeline definition: ordered steps with parameter mappings
- [ ] "Run pipeline" executes all steps sequentially
- [ ] Pipeline results view: output of each step, total tokens, total cost
- [ ] Save pipelines as named, versioned entities
- [ ] Basic only — no conditional branching in v1 (linear chains only)

---

### 22.7 — Audit Log [P0]

**As a** team admin
**I want** a log of all significant actions in my workspace
**So that** I can track who did what for security and compliance

**Acceptance Criteria:**
- [ ] Audit log page in Settings (Team plan) or a dedicated section
- [ ] Every significant action logged: resolve, create, edit, delete, version promote, API key create/revoke, team member changes
- [ ] Log entry: who, what, when, details (resource name, version, etc.)
- [ ] Filter by: user, action type, resource, date range
- [ ] Search within logs
- [ ] Retention: Free=7 days, Pro=90 days, Team=1 year
- [ ] Export audit log as CSV
