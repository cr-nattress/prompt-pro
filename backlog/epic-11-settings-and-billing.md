# Epic 11 — Settings & Billing

**Phase:** 1 (MVP)
**Estimated:** Week 6
**Dependencies:** Epic 02 (Auth), Epic 08 (API Keys)
**References:** PLAN.md §10 (Monetization); UIUX.md §5.12, §17; TECHNOLOGY.md §11

## Goal

Build the settings pages and Stripe billing integration, including the freemium gating system that limits features by plan tier.

---

## Stories

### 11.1 — Settings Page Layout [P0]

**As a** user
**I want** a settings page with organized sections
**So that** I can manage my account, workspace, and preferences

**Acceptance Criteria:**
- [ ] Route: `/settings`
- [ ] Layout: left sidebar navigation (settings sections) + content area on the right
- [ ] Sections: Profile, Workspace, API Keys, Billing
- [ ] Active section highlighted in sidebar
- [ ] **Mobile:** sections as stacked list, tap → full-screen page for that section

---

### 11.2 — Profile Settings [P0]

**As a** user
**I want** to manage my profile
**So that** my account information is up to date

**Acceptance Criteria:**
- [ ] Display: name, email, avatar (from Clerk)
- [ ] Edit name (syncs back to Clerk + our database)
- [ ] Theme toggle: Dark / Light / System
- [ ] Theme preference persisted

---

### 11.3 — Workspace Settings [P0]

**As a** user
**I want** to manage my workspace
**So that** I can configure workspace-level settings

**Acceptance Criteria:**
- [ ] Display: workspace name, slug, plan badge, created date
- [ ] Edit workspace name
- [ ] "Danger zone" section (visually distinct, red border):
  - Delete workspace (confirmation dialog, requires typing workspace name)
  - Warns about data loss (all prompts, blueprints, API keys, history)

---

### 11.4 — API Keys Management UI [P0]

**As a** user
**I want** to create and manage API keys from the settings page
**So that** I can set up API access for my apps

**Acceptance Criteria:**
- [ ] API Keys section shows list of existing keys:
  - Each key: label, masked key (`pv_live_xxxxx...xxxxx`), scopes (badges), app scope, last used (relative time), expiration
  - "Revoke" button on each key (confirmation dialog)
- [ ] "+ Create Key" button opens dialog:
  - Label (text input)
  - Scopes (multi-select chips: read, resolve, write, admin)
  - App scope (dropdown: All apps, or specific app)
  - Expiration (None, 30 days, 90 days, 1 year, custom date)
- [ ] After creation: key shown ONCE in a modal with copy button + warning "Save this key — you won't be able to see it again"
- [ ] Toast "API key created" (persistent, with "Copy key" button)
- [ ] Free plan limit: 2 keys (show upgrade prompt when limit reached)

---

### 11.5 — Stripe Integration Setup [P0]

**As a** developer
**I want** Stripe configured for subscription billing
**So that** users can upgrade to paid plans

**Acceptance Criteria:**
- [ ] Stripe account connected
- [ ] Products and prices created in Stripe:
  - Pro: $12/month
  - Team: $30/month
- [ ] `stripe` Node.js SDK installed
- [ ] Stripe webhook endpoint at `/api/webhooks/stripe`
- [ ] Webhook events handled: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Subscription status synced to our database (workspace.plan updated)
- [ ] Stripe customer ID stored on workspace record

---

### 11.6 — Billing Page [P0]

**As a** user
**I want** to see my current plan and manage my subscription
**So that** I can upgrade or change my billing

**Acceptance Criteria:**
- [ ] Current plan card: plan name + price + billing period
- [ ] Usage meters showing current usage vs limits:
  - Prompts: {used} / {limit}
  - API resolves this month: {used} / {limit}
  - Analyses this month: {used} / {limit}
  - API keys: {used} / {limit}
- [ ] Progress bars for each meter (color-coded: green < 60%, yellow 60-85%, red > 85%)
- [ ] **Free users:** plan comparison table + "Upgrade to Pro" and "Upgrade to Team" CTAs
- [ ] **Paid users:** "Manage subscription" button → Stripe Customer Portal (cancel, update payment, change plan)
- [ ] Stripe Checkout integration for upgrades (redirects to Stripe-hosted checkout page)

---

### 11.7 — Freemium Gating System [P0]

**As a** developer
**I want** a centralized plan limit checking system
**So that** features are correctly gated by plan tier

**Acceptance Criteria:**
- [ ] `lib/billing/limits.ts` defines plan limits per tier (matches PLAN.md §10):
  - Workspaces: 1 / 3 / unlimited
  - Apps: 2 / 10 / unlimited
  - Prompts: 25 / unlimited / unlimited
  - API resolves: 500 / 10K / 100K per month
  - Analyses: 5 / 100 / 500 per month
  - API keys: 2 / 10 / unlimited
  - Version history: last 3 / unlimited / unlimited
  - Collections: 3 / unlimited / unlimited
- [ ] `checkLimit(workspaceId, resource)` function returns `{ allowed: boolean, used: number, limit: number }`
- [ ] Usage tracked in database or Redis counters (reset monthly)
- [ ] Server-side enforcement (limits checked before action, not just UI)

---

### 11.8 — Freemium Gating UI [P0]

**As a** user
**I want** clear, non-intrusive feedback when I hit plan limits
**So that** I understand why an action is restricted and how to unlock it

**Acceptance Criteria:**
- [ ] **Soft limits (approaching):** subtle banner on relevant page (e.g., "You've used 4 of 5 free analyses this month")
- [ ] **Hard limits (reached):** action button disabled, tooltip: "Free plan limit reached", inline upgrade prompt below button
- [ ] **Feature locks:** lock icon on unavailable features, click opens upgrade modal with feature comparison + CTA
- [ ] **Never block core CRUD** — creating and editing prompts always works
- [ ] **No nag screens** — limits communicated inline at the point of interaction
- [ ] Upgrade modal shows plan comparison table with current plan highlighted
