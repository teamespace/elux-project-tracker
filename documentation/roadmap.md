# Elux Project Tracker — Revamp Roadmap

**Project:** Elux Project Tracker Full Revamp  
**Company:** Elux — AI-native product design agency, Indonesia  
**Date:** June 2026  
**Status:** Phase 0 — Documentation

---

## Table of Contents

1. [Overview and Principles](#overview-and-principles)
2. [Phase 0 — Documentation](#phase-0--documentation)
3. [Phase 1 — Design Foundation](#phase-1--design-foundation)
4. [Phase 2 — Frontend with Dummy Data](#phase-2--frontend-with-dummy-data)
5. [Phase 3 — Backend Migration](#phase-3--backend-migration)
6. [Phase 4 — New Features](#phase-4--new-features)
7. [Phase 5 — Polish and Deploy](#phase-5--polish-and-deploy)
8. [Phase 6 — AI Assistant](#phase-6--ai-assistant)
9. [Migration Strategy](#migration-strategy)
10. [Database Migration Plan](#database-migration-plan)
11. [Risk Mitigation](#risk-mitigation)
12. [Definition of Done](#definition-of-done)

---

## Overview and Principles

### What This Is

This is a full revamp of an existing internal tool, not a greenfield project. The current system (Next.js + PocketBase) is running in production and used by the Elux team daily. The revamp introduces a new stack, fixes multiple security vulnerabilities identified in the audit, and adds a set of features that the current system cannot support cleanly.

The approach is parallel build with a hard cutover — the existing system stays live and untouched until the new system is ready to take over completely.

### Stack Change Summary

| Layer | Current | New |
|---|---|---|
| Framework | Next.js (App Router) | Nuxt 4 |
| Hosting | (existing) | Cloudflare Pages |
| Database | PocketBase (pb.eluxemang.top) | Cloudflare D1 (SQLite) |
| API layer | PocketBase REST, called from browser | Cloudflare Workers (server-side only) |
| Auth | JWT in localStorage | Nuxt Auth Utils + HttpOnly cookies |
| UI library | (current) | Nuxt UI v3 + Tailwind v4 |
| Icons | (current) | Phosphor Icons |

### Core Principles

**Revamp-first, not greenfield.** Feature parity with the current tracker comes before new features. Users should not lose workflows they already depend on.

**Security by default.** Every architectural decision must fix — not carry forward — the vulnerabilities found in the audit. There is no phased security fix; security is baked into Phase 1.

**Server-side first.** All data access goes through Cloudflare Workers. No direct client-to-database calls. The browser receives only what the current user is allowed to see.

**Incremental complexity.** Phases are ordered so that each phase has a stable, testable output before the next begins. A phase does not start until its predecessor's success criteria are met.

**Deferred is deferred.** Vendor Portal, Messaging, and Gantt are explicitly out of scope for this revamp. No design, no scaffolding, no placeholder routes. They go in a future roadmap.

---

## Phase 0 — Documentation

### Goal

Produce the documents that every subsequent phase depends on: this roadmap, the security architecture doc, schema design, and component/design decisions. No code is written in Phase 0.

### Deliverables

- `roadmap.md` — this document
- `security.md` — auth architecture, RBAC matrix, API security, checklists
- `schema.md` — D1 schema definitions, mapped from PocketBase collections
- `design-tokens.md` — color, typography, spacing decisions for Nuxt UI v3 + Tailwind v4
- `feature-spec.md` — each feature with acceptance criteria and role-based behavior
- `api-spec.md` — all server route definitions (path, method, required role, request/response shape)

### Success Criteria

- All six documents reviewed and signed off by the team lead
- Schema covers every entity in the current PocketBase instance
- API spec covers every operation currently used by the frontend
- No open questions that would block Phase 1 from starting

### Estimated Effort

**S** — documentation sprint, no implementation

### Dependencies

None. This is the root phase.

### Key Decisions

- Confirm Cloudflare D1 as the database (vs. Turso, Neon, or keeping PocketBase with a proxy layer)
- Confirm Nuxt Auth Utils as the auth library (vs. Auth.js, custom JWT)
- Decide on monorepo structure (single Nuxt app + Workers in one repo, or separate repos)
- Decide on environment strategy (dev/staging/prod on Cloudflare Pages preview branches)

---

## Phase 1 — Design Foundation

### Goal

Stand up a working Nuxt 4 application with the full design system, layout shell, and authentication flow. No real data. No feature pages beyond a placeholder dashboard. By the end of this phase, any developer on the team can open the app, log in with a test account, and see the authenticated shell with navigation working.

### Deliverables

- Nuxt 4 project initialized with TypeScript, Nuxt UI v3, Tailwind v4, Phosphor Icons
- Cloudflare Pages deployment pipeline (GitHub Actions → Pages preview + production)
- Design tokens implemented: color palette, spacing scale, typography, border radius, shadows
- Global layout: top navigation, sidebar, responsive breakpoints
- Auth flow: login page → server-side session creation → redirect to dashboard → logout
- HttpOnly cookie session (no localStorage anywhere in the codebase)
- Role-aware layout: navigation items differ by role
- Nuxt server middleware that protects all `/app/*` routes (unauthenticated → redirect to login)
- Basic error pages: 401, 403, 404, 500
- Storybook or equivalent component playground for UI primitives (optional but recommended)
- `.env` structure documented with all required Cloudflare bindings

### Success Criteria

- App deploys to Cloudflare Pages from main branch automatically
- Login with test credentials works; session persists across page refresh
- Logout clears the session cookie server-side
- Navigating to a protected route while unauthenticated redirects to login
- No JWT or auth token appears in localStorage, sessionStorage, or any JS-accessible cookie
- Admin, Manager, Member, and Intern test accounts show different navigation items
- Lighthouse accessibility score ≥ 80 on the login page

### Estimated Effort

**M**

### Dependencies

- Phase 0 complete (design tokens doc, security architecture doc)
- Cloudflare account with D1 and Workers enabled
- Domain or Pages subdomain assigned

### Key Decisions

- Cookie domain and SameSite policy (Strict vs. Lax — see security.md)
- Session store: D1-backed sessions vs. signed JWT in HttpOnly cookie (stateless)
- Sidebar navigation structure finalized (affects every subsequent phase)
- Component naming conventions locked in before Phase 2 builds on top of them

---

## Phase 2 — Frontend with Dummy Data

### Goal

Build every page and interaction in the application using hardcoded or mock data. No real API calls. By the end of this phase, the entire user-facing product is navigable, interactive, and reviewable by stakeholders — it just does not persist anything.

This phase is where UX decisions get made and validated cheaply, before the backend is wired up.

### Deliverables

**Core pages:**

- Dashboard (helicopter view): KPI cards, recent activity strip, quick-add task, team health indicators
- Goals: list view, goal detail, progress tracking UI, link to epics
- Epics: list view, epic detail with side panel, progress bar, linked tasks count
- Board / Kanban: columns by status, drag-and-drop card movement, swimlane by assignee or epic
- My Work: filtered task list for the current user
- My Day: today's tasks, overdue, upcoming — focused personal view
- Team Workload: capacity grid by team member and week
- Global Search: command palette (Cmd+K) with results across tasks, epics, goals, docs
- Task Detail: full modal or drawer with all fields, comments, attachments placeholder, activity log
- Docs Hub: list of doc pages, rich text viewer

**New feature UI (dummy data only):**

- Risk indicators: red/amber/green badge on epics and tasks with tooltip
- Activity feed: per-entity feed and global feed on dashboard
- Epic side panel: slides in from right, shows epic details without leaving the page
- Changelog: per-entity change history list
- Task dependencies: blocked-by / blocking indicators on task cards and detail
- Templates: template picker modal for new tasks and epics
- Time tracking: start/stop timer on task detail, logged time display

**Role-based UI enforcement:**

- Admin sees all actions everywhere
- Manager sees create/edit on epics and goals; cannot delete users
- Member sees only their own tasks in My Work; no edit on others' tasks
- Intern sees read-only views; no create/edit/delete buttons rendered at all
- All conditional rendering uses a composable `usePermissions()` that reads from the session — not from a local boolean

**RBAC enforcement must be in the mock layer too.** Switching the mock user role should visually change what buttons are available.

### Success Criteria

- All pages listed above are navigable with no broken links or console errors
- Drag-and-drop on Kanban works (task card moves columns, state reflected in mock store)
- Command palette opens with Cmd+K and returns mock results
- Switching mock role hides/shows action buttons correctly per the RBAC matrix
- Task detail drawer opens and closes without layout shift
- All pages pass Lighthouse accessibility ≥ 80
- Mobile layout (375px) is usable for My Work and My Day pages at minimum
- No hardcoded role check using string comparison (`if user.role === 'admin'`) — all checks go through `usePermissions()`

### Estimated Effort

**XL** — this is the largest phase in terms of surface area

### Dependencies

- Phase 1 complete (layout shell, design tokens, auth shell)

### Key Decisions

- State management approach (Pinia stores per feature vs. a single app store)
- Whether drag-and-drop uses a library (vue-draggable-plus) or native HTML5 drag API
- Task detail: full page route vs. drawer/modal (affects URL structure and deep linking)
- How mock data is structured so it can be swapped out cleanly in Phase 3 (repository pattern recommended)

---

## Phase 3 — Backend Migration

### Goal

Replace all mock data with real data from Cloudflare D1, accessed exclusively through Cloudflare Workers server routes. The frontend code should require minimal changes — ideally only swapping mock repository implementations for real ones.

This phase also includes the one-time data migration from PocketBase to D1.

### Deliverables

**Cloudflare Workers / Nuxt server routes:**

- Auth routes: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`
- User routes: `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/:id` (Admin only)
- Task routes: full CRUD with role enforcement at the server layer
- Epic routes: full CRUD with role enforcement
- Goal routes: full CRUD with role enforcement
- Comment routes: create, list per entity
- Docs routes: list, get, create, update
- Team routes: list members, get workload data
- Search route: `GET /api/search?q=` (server-side query across D1 tables)
- All routes: input validation (zod), pagination enforced (default 20, max 100), no perPage=1000

**D1 schema and migrations:**

- All tables defined in `/db/schema.sql`
- Wrangler migration files for initial schema
- Seed data script for development

**Data migration from PocketBase:**

- One-time migration script (Node.js) that reads from PocketBase REST API and writes to D1
- Run against staging D1 first, verified, then run against production D1
- See [Database Migration Plan](#database-migration-plan) for details

**Security hardening:**

- All routes protected by server middleware (role check before handler runs)
- Rate limiting enabled on auth routes via Cloudflare
- CSRF token on all mutating routes
- Response filtering: sensitive fields (password hashes, internal IDs) stripped before response

### Success Criteria

- Every page that worked with mock data works identically with real data
- Creating a task in the app writes a row to D1
- Role enforcement is server-side: sending a DELETE request as a Member returns 403 even if done via curl
- `perPage=1000` parameter in any API call is rejected or capped server-side
- Auth token is not present in any browser-accessible storage (verified with DevTools)
- PocketBase is no longer called from the browser at all
- Data migration script completes without errors on a PocketBase staging snapshot
- All server routes have integration tests (Vitest + Miniflare)

### Estimated Effort

**XL**

### Dependencies

- Phase 2 complete (repository pattern in place, all pages working with mock data)
- D1 database provisioned and schema finalized
- PocketBase instance accessible for migration script
- Cloudflare Workers production binding configured

### Key Decisions

- Session storage strategy finalized (stateless signed cookie vs. D1 session table — decision affects scalability and logout behavior)
- Whether to use Drizzle ORM over D1 or raw SQL (Drizzle recommended for type safety)
- Pagination cursor strategy: offset-based (simpler) vs. cursor-based (better for large datasets)
- Whether to keep PocketBase running in read-only mode during the migration window as a fallback

---

## Phase 4 — New Features

### Goal

Wire up all new features that were built as UI in Phase 2 but need backend support. All features in this phase are additive — they do not change existing data models, only extend them.

### Deliverables

**Risk indicators:**
- `risk_level` field on epics and tasks (`low` / `medium` / `high` / `critical`)
- Server route to update risk level (Manager+ only)
- Automatic risk escalation rule: if a task is overdue by more than 3 days and has no update, risk level is set to `high` automatically (Worker cron job)

**Activity feed:**
- `activity_log` table in D1: entity_type, entity_id, actor_id, action, diff (JSON), created_at
- Server-side logging on every mutating route
- `GET /api/activity?entity_type=&entity_id=` endpoint
- `GET /api/activity/global` endpoint for dashboard feed (last 50 events, current user's visible entities only)

**Epic side panel:**
- No new backend work — panel reads from existing epic and task routes
- Epic quick-edit (title, status, risk level) from within the panel, PATCH route

**Changelog:**
- Changelog view is a filtered activity feed per entity
- No separate table needed

**Task dependencies:**
- `task_dependencies` join table: task_id, depends_on_task_id
- `GET /api/tasks/:id/dependencies` and `POST /api/tasks/:id/dependencies`
- Circular dependency check server-side before insert
- Blocked indicator on Kanban cards when a dependency is unresolved

**Templates:**
- `templates` table: name, type (task/epic), default_fields (JSON), created_by, is_shared
- Manager+ can create and share templates
- `GET /api/templates`, `POST /api/templates`, `DELETE /api/templates/:id`
- Template picker in task/epic create modal applies default field values

**Time tracking:**
- `time_entries` table: task_id, user_id, started_at, ended_at, duration_seconds, note
- `POST /api/tasks/:id/time/start`, `POST /api/tasks/:id/time/stop`
- `GET /api/tasks/:id/time` — list entries for a task
- Only the entry owner or Admin can delete a time entry
- Total logged time displayed on task detail and Team Workload

### Success Criteria

- Risk level updates persist and propagate to Kanban cards and epic views
- Activity feed on the dashboard shows real events in chronological order
- Circular task dependency is rejected with a clear error message
- A template applied to a new task pre-fills the correct fields
- Time tracking start/stop persists entries; stopping after starting creates one entry with correct duration
- Team Workload page shows real logged hours per member per week
- All new routes follow the same auth, rate limiting, and input validation patterns as Phase 3

### Estimated Effort

**L**

### Dependencies

- Phase 3 complete (all core routes, D1 schema, auth working)

### Key Decisions

- Cron job runtime: Cloudflare Workers cron trigger (preferred) vs. a scheduled Nuxt task
- Whether time tracking needs an in-progress state indicator in the UI (timer ticking in real time requires a client-side interval + a server sync on stop)
- Template ownership: shared templates visible to all vs. only to the team that created them

---

## Phase 5 — Polish and Deploy

### Goal

Harden the application for production use. Performance, accessibility, error handling, and observability. This phase has no new features.

### Deliverables

**Performance:**
- Nuxt route-level code splitting verified (no oversized bundles)
- Images and assets on Cloudflare CDN
- D1 query analysis: indexes added for all frequent query patterns (task list by assignee, epic list by project, activity feed by entity)
- Nuxt server-side caching for non-personalized data (e.g., template list)

**Accessibility:**
- WCAG 2.1 AA audit on all pages
- Keyboard navigation works for all primary flows (create task, move Kanban card, search)
- Screen reader labels on all icon-only buttons
- Focus trap in modals and drawers
- Color contrast verified against design tokens

**Error handling:**
- All server routes return consistent error shapes `{ error: { code, message } }`
- Client-side error boundaries on all page-level components
- Toast notifications for all async operations (success and failure)
- Network offline detection with graceful degradation message

**Observability:**
- Cloudflare Analytics enabled
- Worker error logging to Cloudflare Logpush or equivalent
- Custom events: task created, task moved, login success, login failure

**Security final checks:**
- CSP headers set and tested (see security.md)
- HSTS enabled
- All API routes pen-tested against the security checklist in security.md
- Dependency audit (`npm audit`) with no high/critical vulnerabilities

**Deploy:**
- Production D1 database live with migrated data
- Cloudflare Pages production deployment
- DNS cutover from existing tracker domain to new Pages deployment
- Old Next.js + PocketBase system kept live in read-only mode for 2 weeks post-cutover as rollback option
- Runbook for rollback documented

### Success Criteria

- Lighthouse scores: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 80
- Zero high/critical vulnerabilities in npm audit
- All WCAG 2.1 AA issues resolved
- CSP header active with no `unsafe-eval` or `unsafe-inline` (except where documented and justified)
- Production app loads within 2 seconds on a standard mobile connection (LCP)
- Rollback procedure documented and tested in staging

### Estimated Effort

**M**

### Dependencies

- Phase 4 complete
- Production Cloudflare account with D1, Pages, and Workers in production tier
- DNS access to the tracker domain

### Key Decisions

- Rollback window duration (2 weeks recommended)
- Whether to run PocketBase in parallel as a read fallback during rollback window
- Cloudflare R2 vs. third-party storage for any file attachments (if implemented)

---

## Phase 6 — AI Assistant

### Goal

Integrate a Claude API-powered assistant panel into the tracker. The assistant can answer questions about tasks and epics, draft task descriptions, summarize activity, and suggest risk mitigations.

### Deliverables

**UI:**
- Collapsible AI Assistant panel (right sidebar) accessible from any page
- Input field with streaming response display
- Context-aware: the panel knows what page/entity the user is currently viewing
- Conversation history within session (not persisted by default)
- Clear conversation button

**Backend:**
- `POST /api/ai/chat` server route — receives message + context, calls Claude API, streams response
- Context builder: assembles relevant entity data (current task, epic, recent activity) and attaches to system prompt
- Role gate: AI Assistant available to Admin, Manager, Member; not Intern
- Rate limiting: 20 requests per user per hour via Cloudflare rate limiting

**Prompts:**
- System prompt defines the assistant's scope (Elux internal tool, project management context)
- Context injection template: current entity type, entity data summary, user role
- Guardrails: assistant does not make changes to data; it only reads and advises

**Suggested capabilities (v1):**
- "Summarize this epic" — pulls task list and activity feed, returns a narrative summary
- "Draft a task description" — given a task title, returns a description draft
- "What's blocking this task?" — reads dependencies and returns a plain-language explanation
- "Who's overloaded this week?" — reads Team Workload data and flags members above a threshold

### Success Criteria

- AI panel opens and streams a response within 3 seconds on a standard connection
- Assistant response is context-aware (references the current task/epic)
- Rate limit is enforced: the 21st request in an hour returns a clear error
- No project data is sent to Claude API beyond what the current user is permitted to see (enforced by server-side context builder)
- Intern users do not see the AI panel at all

### Estimated Effort

**M**

### Dependencies

- Phase 5 complete (production app live)
- Anthropic API key provisioned and stored as a Cloudflare Worker secret
- AI assistant design reviewed (interaction model, placement, context scope)

### Key Decisions

- Whether conversation history is persisted to D1 (adds complexity but enables "recall last week's summary" use cases)
- Whether to stream responses via SSE or return complete responses (streaming strongly preferred for perceived performance)
- Context window budget: how much entity data to include without hitting token limits or inflating costs

---

## Migration Strategy

### Approach: Parallel Build with Hard Cutover

The current Next.js + PocketBase system continues operating in production, unchanged, throughout the entire revamp. The new Nuxt 4 application is built on a separate Cloudflare Pages deployment under a staging URL.

There is no feature-flag-based incremental rollout. The product changes too fundamentally (new auth, new schema, new server layer) for a gradual route-by-route migration to be safe or practical. Instead:

1. **Build in parallel** — new system built from scratch on staging URL
2. **Verify parity** — every feature in the current tracker has an equivalent in the new one
3. **Migrate data** — PocketBase → D1 migration runs against staging, verified
4. **Cutover** — DNS switched, users notified, old system kept live but read-only as fallback
5. **Decommission** — old system shut down after 2-week rollback window

### Staging Strategy

- Cloudflare Pages preview deployments created for every PR (automatic via GitHub Actions)
- A dedicated `staging` branch deploys to a fixed staging URL (e.g., `staging.tracker.elux.app`)
- Production deploys from `main` branch only, manually triggered

### Cutover Checklist

- [ ] Data migration script run successfully against production D1
- [ ] All team members have tested login on new system with their real accounts
- [ ] DNS TTL lowered to 60 seconds 24 hours before cutover
- [ ] Old system set to read-only mode (PocketBase in maintenance mode)
- [ ] DNS A/CNAME records updated to Cloudflare Pages
- [ ] Smoke test all core workflows on production URL post-cutover
- [ ] Rollback DNS entry prepared (can switch back within 2 minutes)

---

## Database Migration Plan

### PocketBase to Cloudflare D1

PocketBase uses its own collection-based schema. D1 is standard SQLite. The migration is a one-time script that exports all PocketBase collections via the REST API and inserts them into D1.

### Schema Mapping

| PocketBase Collection | D1 Table | Notes |
|---|---|---|
| `users` | `users` | Password hash not migrated — all users must reset password on first login |
| `tasks` | `tasks` | PocketBase system fields (`created`, `updated`) → standard `created_at`, `updated_at` |
| `epics` | `epics` | |
| `goals` | `goals` | |
| `comments` | `comments` | |
| `docs` | `docs` | Rich text content stored as JSON (Tiptap format) |
| `attachments` | `attachments` | File references only; actual files need separate migration if stored in PocketBase filesystem |

### New Tables (no PocketBase equivalent)

- `sessions` — if using D1-backed sessions
- `activity_log` — new in Phase 4
- `task_dependencies` — new in Phase 4
- `templates` — new in Phase 4
- `time_entries` — new in Phase 4
- `risk_overrides` — for manual risk level overrides

### Migration Script Behavior

1. Read all records from each PocketBase collection via `GET /api/collections/{name}/records?perPage=500` (paginated)
2. Transform each record to the D1 schema (rename fields, convert types, strip PocketBase-internal fields)
3. Insert into D1 in batches of 100 (D1 has a statement size limit)
4. Write a migration log to a local file: records read, records inserted, errors
5. After insert, run a row-count comparison: PocketBase count vs. D1 count must match

### Password Reset Strategy

PocketBase password hashes are bcrypt but are not exportable via the REST API. Users cannot be migrated with their existing passwords. On first login to the new system, users will be prompted to use a "Forgot Password" flow. This requires an email-sending integration (Cloudflare Email Workers or a transactional email service).

### Rollback

If the migration script fails or produces incorrect data, the old PocketBase instance is unaffected (the script only reads from it). Re-running the script against an empty D1 database is safe.

---

## Risk Mitigation

### Phase 1 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Nuxt 4 breaking changes from Nuxt 3 | Medium | Medium | Pin exact Nuxt 4 version; read migration guide before starting |
| Cloudflare Pages + D1 local dev experience is poor | Medium | Low | Use Wrangler local dev with D1 local emulation; document setup |
| Design token decisions slow down the phase | Low | Medium | Time-box design token work to 1 day; iterate in Phase 5 |

### Phase 2 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope creep from stakeholders seeing the UI | High | Medium | Freeze scope at start of Phase 2; document deferred requests |
| Drag-and-drop library compatibility with Nuxt 4 | Medium | Medium | Spike on drag-and-drop in week 1 of Phase 2; resolve before building all Kanban UI |
| Phase 2 takes longer than estimated (XL) | Medium | High | Cut deferred features from Phase 2 UI if needed; they can be added in Phase 4 |

### Phase 3 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| D1 query performance at scale | Low | High | Add indexes in Phase 3; benchmark with realistic data volume before cutover |
| Data migration script produces data errors | Medium | High | Run against staging copy of PocketBase first; validate with row counts and spot checks |
| PocketBase export rate limiting | Low | Medium | Paginate exports; add delay between requests if needed |

### Phase 4 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Circular dependency detection logic is incorrect | Medium | Medium | Unit test with known circular cases before deploying |
| Cron jobs not triggering reliably on Cloudflare | Low | Low | Instrument with logging; add manual trigger endpoint for admin |

### Phase 5 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| CSP policy breaks a third-party integration | Medium | Medium | Test CSP in report-only mode first; promote to enforce after 1 week |
| DNS cutover causes downtime | Low | High | Lower TTL 24 hours before; have rollback DNS ready; do cutover during low-traffic hours |

### Phase 6 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Claude API cost overruns | Medium | Medium | Rate limit per user; cache repeated identical prompts; monitor spend weekly |
| AI sends sensitive project data it shouldn't | Low | High | Server-side context builder filters data by user role before sending to API; never send raw DB rows |

---

## Definition of Done

The revamp is complete when all of the following are true:

**Functional parity:**
- [ ] Every feature available in the current Next.js tracker is available in the new Nuxt 4 app
- [ ] No data from the PocketBase migration is missing or corrupted
- [ ] All four user roles (Admin, Manager, Member, Intern) can log in and access appropriate features

**Security:**
- [ ] Zero JWT tokens stored in localStorage or sessionStorage
- [ ] Zero direct browser-to-database API calls
- [ ] All mutating routes require CSRF token
- [ ] RBAC enforced server-side on every route — verified by attempting unauthorized actions with curl
- [ ] Auth and API routes have Cloudflare rate limiting active
- [ ] CSP headers in enforce mode with no `unsafe-eval`

**Quality:**
- [ ] Lighthouse scores: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90
- [ ] Zero high/critical npm vulnerabilities
- [ ] All pages load without console errors in production
- [ ] Core flows work on mobile (375px): login, My Work, My Day, task detail

**Operations:**
- [ ] Production deployment on Cloudflare Pages
- [ ] Rollback procedure documented and tested
- [ ] Environment variables and secrets documented (not their values) in a team-accessible location
- [ ] Old PocketBase system decommissioned after 2-week rollback window

**New features (Phase 4):**
- [ ] Risk indicators active on epics and tasks
- [ ] Activity feed showing real events
- [ ] Task dependencies enforced server-side
- [ ] Time tracking entries persisting

**AI Assistant (Phase 6):**
- [ ] AI panel available to Admin, Manager, Member
- [ ] Context-aware responses for tasks and epics
- [ ] Rate limiting active
