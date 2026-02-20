# Epic 23 — Analytics & Monitoring

**Phase:** 3 (Platform & Growth)
**Estimated:** Week 18-19
**Dependencies:** Epic 08 (API — Resolve Logs), Epic 15 (Playground)
**References:** PLAN.md §3 Phase 3 (Usage Analytics, Drift Alerts, Response Quality Tracking)

## Goal

Build the analytics dashboard — usage heatmaps, resolve analytics, drift detection, and response quality tracking — so teams can understand how their prompts perform in production.

---

## Stories

### 23.1 — Usage Analytics Dashboard [P0]

**As a** user
**I want** to see how my prompts are used via the API
**So that** I understand which prompts matter most

**Acceptance Criteria:**
- [ ] Route: `/analytics`
- [ ] Added to sidebar navigation
- [ ] Dashboard views:
  - **Resolve volume:** line chart showing resolves over time (daily/weekly/monthly)
  - **Most resolved prompts:** ranked list with resolve counts
  - **Resolve by app:** breakdown by consuming application
  - **Resolve by version:** which versions are in active use
  - **Common parameters:** most frequently used parameter values
- [ ] Date range selector (last 7 days, 30 days, 90 days, custom)
- [ ] Filter by app, prompt, blueprint
- [ ] Data sourced from `resolveLogs` table
- [ ] Charts built with Recharts

---

### 23.2 — Usage Heatmaps [P1]

**As a** team admin
**I want** visual heatmaps of prompt usage patterns
**So that** I can identify peaks and optimize

**Acceptance Criteria:**
- [ ] Heatmap visualization: day-of-week × hour-of-day showing resolve volume
- [ ] Color intensity represents volume
- [ ] Hover shows exact count for that cell
- [ ] Filter by prompt/app
- [ ] Helps identify usage patterns and peak hours

---

### 23.3 — Resolve Latency Tracking [P1]

**As a** developer
**I want** to see API response time trends
**So that** I can monitor performance

**Acceptance Criteria:**
- [ ] P50, P95, P99 latency metrics displayed
- [ ] Latency trend line chart over time
- [ ] Breakdown by prompt (identify slow resolves)
- [ ] Alert indicators when latency exceeds threshold
- [ ] Data from `resolveLogs.latencyMs`

---

### 23.4 — Response Quality Tracking [P1]

**As a** user
**I want** to track prompt output quality over time
**So that** I can detect degradation

**Acceptance Criteria:**
- [ ] Quality metrics from playground usage:
  - User ratings (thumbs up/down from A/B comparisons)
  - Test suite pass rates over time
  - Average analysis scores over time
- [ ] Quality trend line chart per prompt
- [ ] Alerts when quality drops (score decreases across versions)
- [ ] Quality dashboard on prompt detail page

---

### 23.5 — Drift Alerts [P2]

**As a** user
**I want** to be alerted when model updates change my prompt's behavior
**So that** I can re-tune prompts proactively

**Acceptance Criteria:**
- [ ] Scheduled job (Vercel Cron) runs periodically
- [ ] For prompts with test suites: re-runs test suite against latest model version
- [ ] Compares outputs to baseline via embedding similarity
- [ ] If similarity drops below threshold: creates drift alert
- [ ] Drift alert appears on dashboard and prompt detail page
- [ ] Alert includes: which prompt, when detected, how much drift, "Re-test" action
- [ ] Email notification option for drift alerts

---

### 23.6 — Analytics Export [P2]

**As a** team admin
**I want** to export analytics data
**So that** I can create custom reports

**Acceptance Criteria:**
- [ ] Export resolve logs as CSV
- [ ] Export usage metrics as CSV
- [ ] Date range and filter applied before export
- [ ] Team plan only
