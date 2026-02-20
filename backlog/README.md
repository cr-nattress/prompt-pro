# PromptVault — Backlog

## Overview

This backlog contains all epics for building PromptVault, organized into three phases. Each epic is a self-contained unit of work with user stories, acceptance criteria, and technical notes.

## Phase 1 — MVP (Weeks 1-8)

| # | Epic | Est. | Key Deliverables |
|---|------|------|-----------------|
| 01 | [Project Foundation](./epic-01-project-foundation.md) | Week 1 | Next.js scaffold, design tokens, theming, CI |
| 02 | [Authentication & Workspaces](./epic-02-auth-and-workspaces.md) | Week 1-2 | Clerk integration, workspace CRUD, middleware |
| 03 | [Database & Data Layer](./epic-03-database-and-data-layer.md) | Week 1-2 | Neon setup, Drizzle schema, migrations |
| 04 | [App Shell & Navigation](./epic-04-app-shell-and-navigation.md) | Week 2 | Sidebar, header, command palette, responsive layout |
| 05 | [Prompt Management](./epic-05-prompt-management.md) | Week 2-3 | Prompt CRUD, list, editor (CodeMirror), search/filter |
| 06 | [Context Blueprints & Designer](./epic-06-context-blueprints-and-designer.md) | Week 3-4 | Blueprint CRUD, block stack, token budget, inspector |
| 07 | [Version Management](./epic-07-version-management.md) | Week 4 | Versioning, diff view, timeline, promotion |
| 08 | [REST API & Resolve Engine](./epic-08-rest-api-and-resolve-engine.md) | Week 4-5 | Public API, resolve endpoint, API keys, rate limiting |
| 09 | [AI Analysis & Enhancement](./epic-09-ai-analysis-and-enhancement.md) | Week 4-5 | Scoring, suggestions, enhance, ambiguity detector, token counter |
| 10 | [Guided Builder & Onboarding](./epic-10-guided-builder-and-onboarding.md) | Week 5-6 | Wizard builder, 3-step onboarding, empty states |
| 11 | [Settings & Billing](./epic-11-settings-and-billing.md) | Week 6 | Settings pages, Stripe, freemium gating |
| 12 | [Education System MVP](./epic-12-education-system-mvp.md) | Week 7 | Micro-lessons, field hints, knowledge base |
| 13 | [Dashboard](./epic-13-dashboard.md) | Week 7-8 | Stats, recent items, recommendations, empty state |
| 14 | [Responsive, A11y & Polish](./epic-14-responsive-a11y-polish.md) | Week 8 | Responsive pass, a11y audit, loading/error/empty states |

## Phase 2 — Power Features (Weeks 9-14)

| # | Epic | Est. | Key Deliverables |
|---|------|------|-----------------|
| 15 | [Prompt Playground & Testing](./epic-15-playground-and-testing.md) | Week 9-10 | Playground, A/B comparison, test suites |
| 16 | [Real-Time Coach & Smart Suggestions](./epic-16-coach-and-suggestions.md) | Week 10-11 | Coach sidebar, inline autocomplete, prompt linter |
| 17 | [Skill Profiling & Personalization](./epic-17-skill-profiling.md) | Week 11-12 | Visible skill profile, recommendations dashboard |
| 18 | [Learning Paths & Education v2](./epic-18-learning-paths.md) | Week 12-13 | Learning paths, context education, before/after showcase |
| 19 | [Advanced Analysis & Context Features](./epic-19-advanced-analysis.md) | Week 13-14 | Context simulation, compression, model optimization |

## Phase 3 — Platform & Growth (Weeks 15-20)

| # | Epic | Est. | Key Deliverables |
|---|------|------|-----------------|
| 20 | [Community & Social](./epic-20-community-and-social.md) | Week 15-16 | Gallery, challenges, comparative feed |
| 21 | [Team & Collaboration](./epic-21-team-and-collaboration.md) | Week 16-17 | Sharing, roles, comments, annotations |
| 22 | [Integrations & Platform](./epic-22-integrations-and-platform.md) | Week 17-18 | Git sync, webhooks, export, import, prompt chains |
| 23 | [Analytics & Monitoring](./epic-23-analytics-and-monitoring.md) | Week 18-19 | Usage analytics, audit log, drift alerts |
| 24 | [Advanced Education](./epic-24-advanced-education.md) | Week 19-20 | Advanced learning paths, production patterns |

## How to Use This Backlog

1. **Epics are ordered by dependency** — earlier epics provide foundations for later ones
2. **Stories within each epic are ordered by priority** — do them top to bottom
3. **Acceptance criteria are testable** — each can be verified by a human or automated test
4. **Technical notes** provide implementation guidance without dictating exact code
5. **Dependencies** are listed at the top of each epic — don't start an epic until its dependencies are complete
6. **Cross-references** link to PLAN.md, TECHNOLOGY.md, and UIUX.md for full context

## Labels

Stories use these priority labels:
- **P0 — Must Have** — Core to the epic, blocks other work
- **P1 — Should Have** — Important for completeness, but epic is usable without it
- **P2 — Nice to Have** — Polish, can be deferred to a later sprint
