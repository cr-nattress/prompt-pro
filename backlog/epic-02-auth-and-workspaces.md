# Epic 02 — Authentication & Workspaces

**Phase:** 1 (MVP)
**Estimated:** Week 1-2
**Dependencies:** Epic 01 (Project Foundation)
**References:** PLAN.md §3 (Auth), §4 (Workspace/User tables); TECHNOLOGY.md §8; UIUX.md §5.1-5.2

## Goal

Implement authentication with Clerk, automatic workspace creation, and route protection so users can sign up, log in, and access their private workspace.

---

## Stories

### 2.1 — Integrate Clerk Auth Provider [P0]

**As a** user
**I want** to sign up and log in with email/password or Google OAuth
**So that** my data is private and secure

**Acceptance Criteria:**
- [ ] Clerk installed and `<ClerkProvider>` wraps the app in root layout
- [ ] Sign-up page at `/signup` with email/password + Google OAuth + GitHub OAuth
- [ ] Login page at `/login` with same providers
- [ ] Password reset flow at `/forgot-password`
- [ ] Clerk components styled via CSS variables to match design tokens (dark mode compatible)
- [ ] Auth pages use centered card layout — no sidebar, no navigation (see UIUX.md §5.1)
- [ ] `max-w-sm` card, centered horizontally and vertically, identical on all breakpoints

**Technical Notes:**
- Use Clerk's pre-built `<SignIn>` and `<SignUp>` components, customized via appearance prop
- Auth pages live under `app/(auth)/` route group (no dashboard layout)

---

### 2.2 — Protect Routes with Middleware [P0]

**As a** developer
**I want** authenticated routes protected by middleware
**So that** unauthenticated users are redirected to login

**Acceptance Criteria:**
- [ ] Next.js middleware using `clerkMiddleware()` protects all routes under `(dashboard)`
- [ ] Public routes: `/`, `/login`, `/signup`, `/forgot-password`, `/api/v1/*` (API uses key auth)
- [ ] Unauthenticated access to protected routes redirects to `/login`
- [ ] After login, user is redirected to their previous intended destination (or `/dashboard`)

---

### 2.3 — Create Workspace on Signup [P0]

**As a** new user
**I want** a workspace automatically created when I sign up
**So that** I can start using the app immediately without setup

**Acceptance Criteria:**
- [ ] Clerk webhook (`user.created`) triggers workspace creation in database
- [ ] Workspace slug generated from email domain (e.g., `chris-nattress`) — editable later
- [ ] Workspace name defaults to `{firstName}'s Workspace`
- [ ] User record created in database linked to Clerk user ID
- [ ] Free plan assigned by default

**Technical Notes:**
- Use Clerk webhooks to sync user data to our database
- Workspace + User records created in a single transaction

---

### 2.4 — Workspace Switcher [P1]

**As a** user with multiple workspaces
**I want** to switch between workspaces from the header
**So that** I can manage prompts for different projects

**Acceptance Criteria:**
- [ ] Workspace name displayed in the top bar
- [ ] Dropdown menu (or popover) lists all user's workspaces
- [ ] Selecting a workspace switches context — all data (prompts, blueprints, API keys) scopes to selected workspace
- [ ] Selected workspace persisted in session/cookie
- [ ] Free plan limited to 1 workspace (additional workspaces show upgrade prompt)

---

### 2.5 — User Profile Menu [P1]

**As a** user
**I want** a profile menu in the header
**So that** I can access my profile, settings, and sign out

**Acceptance Criteria:**
- [ ] Avatar (from Clerk) displayed in top-right corner of header
- [ ] Click opens dropdown: Profile, Settings, Theme toggle (Dark/Light/System), Sign out
- [ ] Sign out clears session and redirects to `/login`
- [ ] Theme toggle updates immediately and persists preference

---

### 2.6 — Auth Helper Utilities [P0]

**As a** developer
**I want** helper functions for accessing the current user and workspace
**So that** any server component or API route can easily get auth context

**Acceptance Criteria:**
- [ ] `lib/auth/` exports `getCurrentUser()` — returns user record from DB
- [ ] `lib/auth/` exports `getCurrentWorkspace()` — returns active workspace
- [ ] `lib/auth/` exports `requireAuth()` — throws if not authenticated (for API routes)
- [ ] All helpers work in Server Components, Server Actions, and Route Handlers
- [ ] TypeScript types for User and Workspace exported from `types/`
