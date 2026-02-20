# Epic 08 — REST API & Resolve Engine

**Phase:** 1 (MVP)
**Estimated:** Week 4-5
**Dependencies:** Epic 03 (Database), Epic 07 (Versions)
**References:** PLAN.md §5 (API Design), §6 (SDK); TECHNOLOGY.md §12 (Upstash Redis)

## Goal

Build the public REST API (`/api/v1/*`) and the resolve engine — the key endpoint that makes PromptVault useful for consuming applications.

---

## Stories

### 8.1 — API Key Management [P0]

**As a** user
**I want** to create and manage scoped API keys
**So that** my applications can authenticate with the API

**Acceptance Criteria:**
- [ ] `POST /api/v1/api-keys` — create a new API key
  - Request: `{ label, scopes: ["read", "resolve", "write", "admin"], appId?: string, expiresAt?: string }`
  - Response: `{ id, key, label, scopes, appId, expiresAt, createdAt }` (key shown only once)
  - Key format: `pv_live_xxx...` for production, `pv_test_xxx...` for test
  - Key stored as hash (`crypto.subtle.digest`) — plain text never persisted
- [ ] `DELETE /api/v1/api-keys/:id` — revoke a key
- [ ] `GET /api/v1/api-keys` — list all keys (shows label, scopes, lastUsedAt, but NOT the key itself)
- [ ] Free plan: max 2 keys. Pro: 10. Team: unlimited.

---

### 8.2 — API Authentication Middleware [P0]

**As a** developer
**I want** API requests authenticated via `Authorization: Bearer <key>`
**So that** only authorized apps can access the API

**Acceptance Criteria:**
- [ ] Middleware extracts API key from `Authorization` header
- [ ] Key hash compared against stored hashes
- [ ] Request rejected with `401 Unauthorized` if key is invalid
- [ ] Request rejected with `403 Forbidden` if key lacks required scope for the endpoint
- [ ] Expired keys rejected with `401`
- [ ] `lastUsedAt` updated on each successful request
- [ ] Response includes standard error format: `{ error: { code, message, details } }`

---

### 8.3 — Rate Limiting [P0]

**As a** developer
**I want** API endpoints rate-limited per API key
**So that** no single consumer can overwhelm the service

**Acceptance Criteria:**
- [ ] Upstash Redis (`@upstash/ratelimit`) integrated
- [ ] Rate limits per API key using sliding window algorithm:
  - Free: 500 resolves/month, 10 req/min burst
  - Pro: 10,000 resolves/month, 60 req/min burst
  - Team: 100,000 resolves/month, 300 req/min burst
- [ ] Rate limit exceeded returns `429 Too Many Requests` with `Retry-After` header
- [ ] Rate limit headers on every response: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

### 8.4 — Prompt CRUD API Endpoints [P0]

**As a** developer
**I want** REST endpoints for managing prompts via API
**So that** external tools can programmatically manage prompts

**Acceptance Criteria:**
- [ ] All endpoints at `/api/v1/apps/:app/prompts/...`
- [ ] `GET /api/v1/apps/:app/prompts` — list prompts (pagination, filters)
- [ ] `POST /api/v1/apps/:app/prompts` — create prompt
- [ ] `GET /api/v1/apps/:app/prompts/:slug` — get prompt (includes latest version)
- [ ] `PUT /api/v1/apps/:app/prompts/:slug` — update prompt metadata
- [ ] `DELETE /api/v1/apps/:app/prompts/:slug` — delete prompt
- [ ] `POST /api/v1/apps/:app/prompts/:slug/versions` — publish new version
- [ ] `GET /api/v1/apps/:app/prompts/:slug/versions` — list versions
- [ ] `PATCH /api/v1/apps/:app/prompts/:slug/versions/:v` — promote version
- [ ] All endpoints require `write` scope (except GET which requires `read`)
- [ ] Request validation with Zod — invalid requests return `400` with field-level errors
- [ ] Consistent JSON response format

---

### 8.5 — Blueprint CRUD API Endpoints [P0]

**As a** developer
**I want** REST endpoints for managing blueprints via API
**So that** blueprints can be managed programmatically

**Acceptance Criteria:**
- [ ] All endpoints at `/api/v1/apps/:app/blueprints/...`
- [ ] Same CRUD pattern as prompts (list, create, get, update, delete)
- [ ] Block management endpoints:
  - `POST /api/v1/apps/:app/blueprints/:slug/blocks` — add block
  - `PUT /api/v1/apps/:app/blueprints/:slug/blocks/:id` — update block
  - `DELETE /api/v1/apps/:app/blueprints/:slug/blocks/:id` — delete block
  - `PATCH /api/v1/apps/:app/blueprints/:slug/blocks/order` — reorder blocks
- [ ] Blueprint version endpoints (same pattern as prompts)
- [ ] Proper scope enforcement

---

### 8.6 — Resolve Endpoint [P0]

**As a** developer
**I want** a resolve endpoint that fetches and parameterizes prompts/blueprints
**So that** consuming apps can get resolved prompts in a single API call

**Acceptance Criteria:**
- [ ] `POST /api/v1/resolve`
- [ ] Request format:
  ```json
  {
    "ref": "workspace/app/prompt-key@version",
    "parameters": { "key": "value" },
    "options": { "format": "string|messages", "includeMetadata": true }
  }
  ```
- [ ] Version references: `@latest` (newest active), `@stable` (production), `@v2.1` (pinned)
- [ ] Response format:
  ```json
  {
    "resolved": "...",
    "version": "2.1.0",
    "unresolved_params": ["user_query"],
    "prompt_id": "p_abc123",
    "llm": "claude-sonnet",
    "metadata": { "totalTokens": 4850 }
  }
  ```
- [ ] Template resolution: `{{variable}}` replaced with provided parameter values
- [ ] Partial resolution: unresolved params stay as `{{placeholder}}` with `unresolved_params` in response
- [ ] Parameter validation against `parameterSchema` — required params missing returns `400`
- [ ] For blueprints: assembles all blocks in order, resolves all parameters, evaluates conditions
- [ ] Blueprint response includes `metadata.tokenBreakdown` (per block) and `blocksIncluded`/`blocksExcluded` lists
- [ ] Requires `resolve` scope on API key
- [ ] `ResolveLog` entry created for every resolve call

---

### 8.7 — Resolve Caching [P1]

**As a** developer
**I want** resolve responses cached for performance
**So that** repeated resolves are fast and efficient

**Acceptance Criteria:**
- [ ] `Cache-Control` header on resolve responses (e.g., `max-age=60`)
- [ ] `ETag` header based on version + parameter hash
- [ ] `If-None-Match` support returns `304 Not Modified`
- [ ] Upstash Redis cache for frequently resolved prompts
- [ ] Cache invalidated on version promotion

---

### 8.8 — Workspace & App Management API [P1]

**As a** developer
**I want** API endpoints for workspace and app management
**So that** organizational structure can be managed via API

**Acceptance Criteria:**
- [ ] `GET /api/v1/workspaces` — list user's workspaces
- [ ] `POST /api/v1/workspaces` — create workspace
- [ ] `GET /api/v1/workspaces/:slug/apps` — list apps
- [ ] `POST /api/v1/workspaces/:slug/apps` — create app
- [ ] Requires `admin` scope

---

### 8.9 — API Error Handling [P0]

**As a** developer
**I want** consistent, informative API error responses
**So that** debugging API issues is straightforward

**Acceptance Criteria:**
- [ ] All errors return: `{ error: { code: "string", message: "string", details?: any } }`
- [ ] Standard HTTP status codes: 400 (validation), 401 (auth), 403 (scope), 404 (not found), 429 (rate limit), 500 (server error)
- [ ] Validation errors include field-level details
- [ ] No stack traces in production responses
- [ ] Request ID header (`X-Request-Id`) on every response for debugging
