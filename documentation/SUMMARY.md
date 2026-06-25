# Elux Project Tracker — Revamp Summary
> Context file for continuing work in OpenCode or any AI coding assistant.

---

## What is this?

Full revamp of an internal project tracker for **Elux**, an AI-native product design agency (Indonesia). The existing app runs at https://pt.eluxemang.top. We are rebuilding it from scratch using a new stack while keeping all existing functionality + adding new features.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Nuxt 4 |
| Hosting | Cloudflare Pages |
| Database | Cloudflare D1 (SQLite) |
| API | Cloudflare Workers via Nuxt 4 server routes |
| Auth | Nuxt Auth Utils (HttpOnly cookies) |
| UI Library | Nuxt UI v3 (fully free/open source) |
| Styling | Tailwind CSS v4 |
| Icons | Phosphor Icons |
| AI | Claude API (Phase 6, last priority) |
| ORM | Drizzle ORM (D1-compatible) |

**Replacing:** Next.js App Router + PocketBase backend

---

## Users & Roles

| Role | Permissions |
|---|---|
| Admin | Full access — create/edit/delete everything |
| Manager | Create/manage Goals and Epics, assign tasks |
| Member | Create and edit own tasks |
| Intern | View + limited task status updates |

---

## Feature Hierarchy

```
Goal → Project → Task → Subtask + Comments
```

> **Note:** The original docs used "Epic" but the frontend was built with "Project" (`app/pages/projects/`, IDs `p1`–`p8`). The database table is `projects`. The term "Epic" is retired.

---

## Confirmed Features

### Core (revamped from existing)
- Dashboard — helicopter/project-level overview
- Goals — with KPI tracking and linked projects
- Projects — list + side panel (tabs: Overview, Tasks, Docs)
- Board/Kanban — To Do, In Progress, Review, Done
- My Work — personal tasks grouped by status
- My Day — today's priority tasks only (subset of My Work)
- Team Workload — capacity per member
- Global Search — ⌘K command palette
- Task Detail — status, assignee, priority, subtasks, comments, time tracking, dependencies, changelog
- Docs Hub — cross-epic documentation

### New Features
- Risk indicators per epic — HIGH / MEDIUM / LOW with reason
- Critical issues section on dashboard
- Activity feed on dashboard
- Epic side panel (slide from right)
- Changelog per epic
- Task dependencies (blocked by / blocks)
- Template system for epics and tasks
- Time tracking per task (timer or manual)

### AI — Phase 6 (last priority)
- Persistent AI Assistant panel, always accessible, context-aware
- Can: generate tasks from brief, answer project questions, weekly summary, risk detection

### Deferred (not in this revamp)
- Vendor Portal / SPK
- Team messaging
- Gantt chart

---

## Visual Design

**References:**
- Overall: [Linear](https://linear.app) — minimal, fast, clean
- Dashboard: [Vercel Dashboard](https://vercel.com) — immediate orientation
- My Work: [Superlist](https://superlist.com) — personal, focused
- Docs: [Craft.do](https://craft.do) — hierarchy, reading experience

**Key decisions:**
- Accent color: `#2563EB` (blue — Linear-like)
- Font: Geist (Inter fallback)
- 8px base spacing
- Sidebar: fixed 240px
- No gradients, no heavy shadows
- Dark mode supported from day 1
- Status colors: On Track (green), Delayed (red), At Risk (amber)
- Risk colors: HIGH (red), MEDIUM (amber), LOW (green)
- Priority: High (red dot), Medium (amber dot), Low (gray dot)

---

## Critical Bugs to Fix (from audit)

| ID | Issue |
|---|---|
| BF-01 | `/epic/[id]` and `/task/[id]` return 404 on direct URL — SSR dynamic routes not configured |
| BF-02 | Board: 8+ tasks return 503 — caused by Next.js RSC prefetching + perPage=1000 antipattern |
| BF-03 | No success/error toast on any write operation (create, update, delete) |
| BF-04 | Notification bell shows 9+ badge but does nothing on click |
| BF-05 | Dashboard "19 tasks" vs My Work "30 tasks" for same user — metrics inconsistent |
| BF-06 | Epic status never auto-updates when all tasks reach Done |
| BF-07 | Create Task not available on Board page — only from inside Epic |
| BF-08 | Goal detail has no Add KPI or Link Epic actions |
| BF-09 | Edit/Delete buttons visible to Member role (RBAC not enforced in UI) |

**Architecture antipatterns to eliminate:**
- `perPage=1000` client-side fetching → replace with server-side pagination (max 50/page)
- PocketBase API called directly from browser → all calls move server-side
- JWT in localStorage → HttpOnly cookies via Nuxt Auth Utils

---

## Development Phases

| Phase | Goal | Status |
|---|---|---|
| 0 | Documentation | ✅ Done |
| 1 | Design Foundation | ✅ Done |
| 2 | Frontend with dummy data | ✅ Done |
| 3 | Backend — D1 schema + API routes + seed | 🔄 Next (`backend/phase3-backend.md`) |
| 4 | New features | ⬜ |
| 5 | Polish + Deploy | ⬜ |
| 6 | AI Assistant | ⬜ |

---

## Phase 3 — What to do next

**Goal:** Implement the full backend (D1 schema, API routes, seed data) so the frontend can swap dummy data for real API calls.

Run `backend/phase3-backend.md` in OpenCode. It covers:
1. `server/database/schema.ts` — Drizzle schema for all tables
2. `server/utils/auth.ts` — session type declaration
3. `server/middleware/auth.ts` — protect all `/api/*` routes
4. Auth routes: login, logout, me
5. API routes: goals, kpis, projects, tasks, subtasks, users, dashboard, my-work, team, search, activity, critical-issues
6. `server/database/seed.ts` — seed data matching the frontend dummy data exactly
7. Frontend swap instructions — replace hardcoded arrays with `useAsyncData` + `$fetch`

After Phase 3: delete `server/api/__seed.post.ts`, then start Phase 4 (new features).

---

## Documentation Files

All in `/documentation/` folder:

| File | Description |
|---|---|
| `blueprint.md` | System architecture, data model (SQL DDL), RBAC matrix, API surface (~60 endpoints), auth flow |
| `techstack.md` | Every tech choice with version numbers, rationale, alternatives considered |
| `prd.md` | Product requirements, personas, MoSCoW features, success metrics |
| `brd.md` | Business requirements, stakeholder map, risk register |
| `frd.md` | Functional requirements per feature, acceptance criteria, edge cases |
| `user-story.md` | 90 user stories (US-001–090), Given/When/Then, per role |
| `roadmap.md` | 7 phases with deliverables, effort sizing, migration strategy |
| `security.md` | Auth flow, RBAC enforcement, 40-point pre-launch checklist |
| `design.md` | Full design token system (light/dark), component specs, animation principles |
| `wireframe.md` | 16 screens with ASCII layout, interactions, empty/loading/error states |

---

## Nuxt 4 Directory Structure (target)

```
/
├── app/
│   ├── components/
│   │   ├── ui/           # base components (Button, Badge, Card, Avatar...)
│   │   ├── layout/       # Sidebar, Header, AppShell
│   │   └── [feature]/    # Dashboard, Board, Epics, etc.
│   ├── composables/      # useAuth, usePermissions, useTasks, etc.
│   ├── layouts/
│   │   ├── default.vue   # authenticated app shell
│   │   └── auth.vue      # login page
│   ├── middleware/        # auth.ts, role.ts
│   ├── pages/
│   │   ├── dashboard.vue
│   │   ├── goals/
│   │   ├── epics/
│   │   ├── board.vue
│   │   ├── my-work.vue
│   │   ├── team.vue
│   │   └── docs/
│   └── app.vue
├── server/
│   ├── api/              # all API routes (tasks, epics, goals, etc.)
│   ├── middleware/        # auth validation per request
│   └── utils/            # db helpers, rbac guards
├── shared/
│   └── types/            # shared TypeScript types
├── public/
├── nuxt.config.ts
└── wrangler.toml
```

---

## Key Constraints

- All API calls must be server-side (Nuxt server routes → D1). No direct DB access from browser.
- Pagination enforced server-side, max 50 records per page. `perPage=1000` is banned.
- RBAC enforced at two levels: server route (403 if unauthorized) + UI (conditional rendering via `usePermissions()`).
- Auth session via HttpOnly cookie only. No localStorage for tokens.
- Nuxt UI v3 components can be swapped later (built on Reka UI + Tailwind) — don't hardcode styles.
