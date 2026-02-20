# Epic 21 — Team & Collaboration

**Phase:** 3 (Platform & Growth)
**Estimated:** Week 16-17
**Dependencies:** Epic 02 (Auth/Workspaces), Epic 11 (Billing — Team plan)
**References:** PLAN.md §3 Phase 3 (Team Sharing, Folders/Collections, Prompt Comments); UIUX.md §5.12 (Team Members settings)

## Goal

Build team collaboration features — workspace invitations, role-based access, shared collections, and inline commenting on prompts.

---

## Stories

### 21.1 — Team Members Management [P0]

**As a** team admin
**I want** to invite team members to my workspace
**So that** my team can collaborate on prompts

**Acceptance Criteria:**
- [ ] Team Members section in Settings (Team plan only)
- [ ] Invite by email — sends invitation link
- [ ] Invitation flow: recipient signs up/logs in → joins workspace
- [ ] Role assignment: Admin, Editor, Viewer
  - **Admin:** full access, manage members, billing
  - **Editor:** create/edit/delete prompts and blueprints, run analysis
  - **Viewer:** read-only access to prompts and blueprints
- [ ] Member list: name, email, role, joined date, last active
- [ ] Change role, remove member actions (admin only)
- [ ] Team plan limit: 10 members
- [ ] Clerk Organizations integration for multi-workspace

---

### 21.2 — Role-Based Access Control [P0]

**As a** developer
**I want** server-side role enforcement
**So that** permissions are correctly applied

**Acceptance Criteria:**
- [ ] All mutations check user role before executing
- [ ] Viewer cannot: create, edit, delete, analyze, enhance, publish versions
- [ ] Viewer can: view prompts, blueprints, analysis results, version history
- [ ] Editor cannot: manage team members, change billing, delete workspace
- [ ] UI adapts to role: action buttons hidden or disabled for insufficient permissions
- [ ] API endpoints enforce roles (not just UI)

---

### 21.3 — Folders / Collections [P0]

**As a** user
**I want** to organize prompts and blueprints into folders
**So that** I can manage large numbers of items

**Acceptance Criteria:**
- [ ] Create folders with name and optional description
- [ ] Drag prompts/blueprints into folders
- [ ] Folder view in sidebar or as filter on list pages
- [ ] Nested folders (1 level deep maximum for simplicity)
- [ ] Bulk move items between folders
- [ ] "All items" view shows everything regardless of folder
- [ ] Free plan: 3 collections. Pro/Team: unlimited.

---

### 21.4 — Prompt Comments & Annotations [P1]

**As a** team member
**I want** to leave comments on specific parts of a prompt
**So that** we can capture institutional knowledge and review feedback

**Acceptance Criteria:**
- [ ] Inline comments on specific text selections in the editor (Google Docs-style)
- [ ] Comment thread: original comment + replies
- [ ] Resolve/unresolve comments
- [ ] Comments visible in a sidebar/panel alongside the editor
- [ ] Comment count badge on prompt list items
- [ ] Notifications for comment mentions (@user)
- [ ] Comments persisted across versions (anchored to text, migrated on edit where possible)

---

### 21.5 — Prompt Changelog & Rationale [P1]

**As a** team member
**I want** to document why each version change was made
**So that** institutional knowledge is captured

**Acceptance Criteria:**
- [ ] Enhanced version history with documented reasoning
- [ ] Each version entry can have a rationale (longer text than change note)
- [ ] Timeline view shows rationale inline
- [ ] "Why was this changed?" question answered by the version history
- [ ] Filter versions by author in team context

---

### 21.6 — Activity Feed [P2]

**As a** team admin
**I want** an activity feed of recent changes
**So that** I know what my team is working on

**Acceptance Criteria:**
- [ ] Activity feed on dashboard (team workspaces)
- [ ] Shows: who did what, when (e.g., "Chris edited Customer Reply Agent v2.3 - 2 hours ago")
- [ ] Filter by member, action type, resource
- [ ] Click to navigate to the relevant resource
