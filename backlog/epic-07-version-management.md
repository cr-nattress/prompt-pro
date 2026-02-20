# Epic 07 — Version Management

**Phase:** 1 (MVP)
**Estimated:** Week 4
**Dependencies:** Epic 05 (Prompts), Epic 06 (Blueprints)
**References:** PLAN.md §3 (Version Management); UIUX.md §5.9; TECHNOLOGY.md §5 (diff viewer)

## Goal

Implement the version lifecycle system — creating versions, viewing history, comparing diffs, and promoting versions through the draft → active → stable → deprecated pipeline.

---

## Stories

### 7.1 — Version Creation on Save [P0]

**As a** user
**I want** each save to create a new version
**So that** I have a complete history of changes

**Acceptance Criteria:**
- [ ] Saving a prompt creates a new `PromptVersion` with auto-incremented semver
- [ ] Minor version increments on content changes (v1.0 → v1.1 → v1.2)
- [ ] Major version increment available as explicit action (v1.x → v2.0)
- [ ] New versions default to `draft` status
- [ ] Change note: optional text input shown on save (via popover or inline field)
- [ ] Same versioning for blocks (ContextBlockVersion) and blueprints (BlueprintVersion)
- [ ] Blueprint version snapshot captures the specific version of each block at save time

---

### 7.2 — Version History Timeline [P0]

**As a** user
**I want** to see the version history of a prompt or blueprint
**So that** I can track how it evolved

**Acceptance Criteria:**
- [ ] Route: `/prompts/[slug]/versions` and `/blueprints/[slug]/versions`
- [ ] Also accessible as a panel/tab within the editor
- [ ] `VersionTimeline` component renders entries newest-first:
  - Version badge with status color (gray=draft, blue=active, green=stable, red=deprecated)
  - Change note text
  - Relative timestamp ("2 hours ago")
  - Score delta if analyzed (green for improvement, red for regression, e.g., "+0.6")
  - "Compare" button to select for diff
- [ ] Free plan: shows last 3 versions only (with upgrade prompt for older)
- [ ] Pro/Team: unlimited version history

---

### 7.3 — Diff View [P0]

**As a** user
**I want** to compare two versions side-by-side
**So that** I can see exactly what changed

**Acceptance Criteria:**
- [ ] `DiffViewer` component wraps `react-diff-viewer-continued`
- [ ] Side-by-side (split) mode on desktop
- [ ] Unified diff mode on mobile (< 768px)
- [ ] Word-level highlighting: green for additions, red for deletions
- [ ] Version labels above each panel (e.g., "v2.0 (before)" / "v2.1 (after)")
- [ ] Diff viewer loaded dynamically (code-split)
- [ ] Dark mode support

---

### 7.4 — Version Promotion [P0]

**As a** user
**I want** to promote a version from draft → active → stable
**So that** my consuming apps can target the right version

**Acceptance Criteria:**
- [ ] "Publish" dropdown in the editor header with promotion options:
  - Promote to Active
  - Promote to Stable
- [ ] Confirmation dialog explains implications:
  - Active: "This version will be returned for `@latest` references"
  - Stable: "This version will be returned for `@stable` references. Production apps using `@stable` will receive this version."
- [ ] Only one version can be `stable` at a time (previous stable auto-changes to `active`)
- [ ] Only one version can be `active` at a time (previous active stays `active` or moves to stable)
- [ ] Deprecation: manual action from context menu on a version (adds strikethrough display)
- [ ] Status changes logged for audit trail

---

### 7.5 — Restore Previous Version [P1]

**As a** user
**I want** to restore a previous version
**So that** I can revert changes that didn't work out

**Acceptance Criteria:**
- [ ] "Restore" action on each version in the timeline
- [ ] Restoring creates a NEW version with the old content (never overwrites history)
- [ ] Change note auto-populated: "Restored from v{X.Y}"
- [ ] New version starts as `draft`
- [ ] Confirmation dialog: "Restore v{X.Y}? This will create a new draft version with the content from v{X.Y}."

---

### 7.6 — Version Badge Display [P0]

**As a** user
**I want** to see the current version and status throughout the UI
**So that** I always know which version I'm working with

**Acceptance Criteria:**
- [ ] Version badge (`v2.1`) + status badge (`draft`) displayed in:
  - Prompt/blueprint editor header
  - Prompt/blueprint list items
  - Breadcrumb area
- [ ] Status badges use consistent color coding (see UIUX.md §10):
  - Draft: gray outline badge
  - Active: blue solid badge
  - Stable: green solid badge
  - Deprecated: red text with strikethrough
