# Elux Project Tracker — System Blueprint

**Version:** 1.1  
**Last Updated:** 2026-06-25  
**Status:** Phase 2 complete — Phase 3 (backend) in progress  
**Audience:** Engineers, tech leads, contributors

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Data Model](#3-data-model)
4. [Data Flow](#4-data-flow)
5. [Auth Flow](#5-auth-flow)
6. [RBAC Matrix](#6-rbac-matrix)
7. [API Structure](#7-api-structure)
8. [Real-Time Considerations](#8-real-time-considerations)
9. [AI Assistant Integration](#9-ai-assistant-integration)
10. [Deployment Architecture](#10-deployment-architecture)

---

## 1. System Overview

Elux Project Tracker is an internal project management tool built for Elux, an AI-native product design agency based in Indonesia. The tool replaces the current Next.js + PocketBase implementation with a Nuxt 4 stack fully deployed on Cloudflare's edge infrastructure.

### Purpose

The tracker organizes work at four levels of granularity:

```
Goal → Project → Task → Subtask
```

Goals represent high-level business objectives. Projects are workstreams under a goal (previously called "Epics" in early docs — renamed to match the frontend). Tasks are actionable units of work assigned to team members. Subtasks break a task into discrete steps.

> **Naming note:** All references to "Epic/Epics" in this document mean "Project/Projects". The database table is `projects`. The frontend pages are `app/pages/projects/`. The old term is deprecated.

Supporting entities include Comments, Docs, Templates, Time Entries, and Changelogs — all scoped to their parent entity.

### Core Problems the Revamp Solves

| Problem | Root Cause | Solution |
|---|---|---|
| 503 errors under load | `perPage=1000` client-side fetching | Server-side pagination via Nuxt server routes |
| JWT in localStorage (XSS risk) | PocketBase SDK default behavior | HttpOnly cookie sessions via Nuxt Auth Utils |
| 404 on dynamic routes | Incorrect SSR config in Next.js | Proper Nuxt 4 SSR routing with `definePageMeta` |
| Browser calls PocketBase directly | No API abstraction layer | All DB access through Nuxt server routes only |
| RBAC enforced only in UI | No backend permission layer | Role checks enforced at server route level |

### Users and Roles

| Role | Example User | Scope |
|---|---|---|
| Admin | — | Full access to all entities |
| Manager | Lintang (PM) | Create epics/goals, assign tasks |
| Member | Ahrasya (designer) | Create and edit own tasks |
| Intern | — | View-only + limited task status updates |

---

## 2. Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│                                                                │
│   Nuxt 4 Vue Components (Nuxt UI v3 + Tailwind CSS v4)        │
│   Phosphor Icons · useAsyncData · useFetch                    │
│                                                                │
│   No direct DB calls. No JWT in localStorage.                 │
└────────────────────┬───────────────────────────────────────────┘
                     │ HTTPS (HttpOnly cookies attached)
                     ▼
┌────────────────────────────────────────────────────────────────┐
│              Cloudflare Pages (SSR + Static Assets)            │
│                                                                │
│   Nuxt 4 Server Engine (Nitro)                                │
│   ├── /server/routes/  (non-API server routes)                │
│   ├── /server/api/     (REST endpoints → Workers)             │
│   │   ├── auth/        login, logout, session                 │
│   │   ├── users/       CRUD + role management                 │
│   │   ├── goals/       CRUD + pagination                      │
│   │   ├── epics/       CRUD + changelog                       │
│   │   ├── tasks/       CRUD + assignments + deps              │
│   │   ├── subtasks/    CRUD                                   │
│   │   ├── comments/    CRUD                                   │
│   │   ├── docs/        CRUD                                   │
│   │   ├── templates/   CRUD + apply                           │
│   │   ├── time/        entries + reports                      │
│   │   ├── activity/    feed + notifications                   │
│   │   └── ai/          assistant context + chat               │
│   └── Nuxt Auth Utils (session cookie handler)                │
└────────────────────┬───────────────────────────────────────────┘
                     │ D1 HTTP API / Workers binding
                     ▼
┌────────────────────────────────────────────────────────────────┐
│              Cloudflare D1 (SQLite at the edge)                │
│                                                                │
│   Tables: users, goals, epics, tasks, subtasks,               │
│           comments, docs, templates, time_entries,            │
│           changelogs, task_dependencies, activity_feed        │
│                                                                │
│   Accessed exclusively via Nuxt server routes using           │
│   Drizzle ORM — never from the browser                        │
└────────────────────────────────────────────────────────────────┘

External Services (server-side only):
┌──────────────────────┐     ┌─────────────────────────────────┐
│  Anthropic Claude API │     │  Cloudflare R2 (file storage)   │
│  (AI assistant panel) │     │  (doc attachments, avatars)     │
└──────────────────────┘     └─────────────────────────────────┘
```

---

## 3. Data Model

### 3.1 Entity Overview

```
users
  └── goals (created_by → users)
        └── epics (goal_id → goals, owner_id → users)
              └── tasks (epic_id → epics, assignee_id → users, created_by → users)
                    ├── subtasks (task_id → tasks, assignee_id → users)
                    ├── comments (task_id → tasks, author_id → users)
                    └── time_entries (task_id → tasks, user_id → users)
epics
  └── changelogs (epic_id → epics, author_id → users)
tasks
  └── task_dependencies (task_id → tasks, depends_on_task_id → tasks)
docs (linked to goal_id, epic_id, or task_id — nullable)
templates (created_by → users)
activity_feed (actor_id → users, entity_type, entity_id)
```

### 3.2 Table Definitions

#### `users`

```sql
CREATE TABLE users (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'intern')),
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Fields:
- `id` — UUID-like hex string, primary key
- `email` — unique login identifier
- `name` — display name
- `avatar_url` — optional Cloudflare R2 URL
- `role` — enforced enum: admin | manager | member | intern
- `is_active` — soft deactivation

---

#### `goals`

```sql
CREATE TABLE goals (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  start_date  TEXT,
  end_date    TEXT,
  created_by  TEXT NOT NULL REFERENCES users(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Fields:
- `status` — active | completed | archived
- `start_date` / `end_date` — ISO 8601 date strings (D1/SQLite stores as TEXT)

---

#### `epics`

```sql
CREATE TABLE epics (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  goal_id     TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done', 'archived')),
  priority    TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  owner_id    TEXT REFERENCES users(id),
  start_date  TEXT,
  due_date    TEXT,
  created_by  TEXT NOT NULL REFERENCES users(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

#### `tasks`

```sql
CREATE TABLE tasks (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  epic_id       TEXT NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'blocked')),
  priority      TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee_id   TEXT REFERENCES users(id),
  created_by    TEXT NOT NULL REFERENCES users(id),
  due_date      TEXT,
  estimated_hours REAL,
  labels        TEXT DEFAULT '[]',  -- JSON array of strings
  is_template   INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Fields:
- `labels` — stored as a JSON string array (SQLite has no native array type)
- `is_template` — flag for tasks used as templates
- `estimated_hours` — for time tracking comparison

---

#### `subtasks`

```sql
CREATE TABLE subtasks (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  task_id     TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  is_done     INTEGER NOT NULL DEFAULT 0,
  assignee_id TEXT REFERENCES users(id),
  due_date    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_by  TEXT NOT NULL REFERENCES users(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

#### `comments`

```sql
CREATE TABLE comments (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  task_id     TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id   TEXT NOT NULL REFERENCES users(id),
  body        TEXT NOT NULL,
  is_edited   INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

#### `docs`

```sql
CREATE TABLE docs (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',  -- markdown or rich text
  goal_id     TEXT REFERENCES goals(id) ON DELETE SET NULL,
  epic_id     TEXT REFERENCES epics(id) ON DELETE SET NULL,
  task_id     TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  created_by  TEXT NOT NULL REFERENCES users(id),
  is_public   INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Notes:
- A doc can be free-floating (all three FKs null) or linked to exactly one entity.
- `is_public` allows read access without auth for sharing.

---

#### `templates`

```sql
CREATE TABLE templates (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name        TEXT NOT NULL,
  description TEXT,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('epic', 'task')),
  payload     TEXT NOT NULL DEFAULT '{}',  -- JSON: prefilled fields
  created_by  TEXT NOT NULL REFERENCES users(id),
  is_global   INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Fields:
- `payload` — JSON blob containing the template's default field values
- `is_global` — if 1, visible to all users; if 0, only creator

---

#### `time_entries`

```sql
CREATE TABLE time_entries (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  task_id     TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id),
  hours       REAL NOT NULL,
  note        TEXT,
  logged_date TEXT NOT NULL,  -- ISO 8601 date
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

#### `changelogs`

```sql
CREATE TABLE changelogs (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  epic_id     TEXT NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
  author_id   TEXT NOT NULL REFERENCES users(id),
  version     TEXT NOT NULL,  -- e.g. "v1.2"
  summary     TEXT NOT NULL,
  changes     TEXT NOT NULL DEFAULT '[]',  -- JSON array of change entries
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

#### `task_dependencies`

```sql
CREATE TABLE task_dependencies (
  task_id           TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, depends_on_task_id)
);
```

A task can have multiple blockers and block multiple other tasks.

---

#### `activity_feed`

```sql
CREATE TABLE activity_feed (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  actor_id    TEXT NOT NULL REFERENCES users(id),
  action      TEXT NOT NULL,  -- 'created', 'updated', 'deleted', 'commented', 'status_changed', etc.
  entity_type TEXT NOT NULL CHECK (entity_type IN ('goal', 'epic', 'task', 'subtask', 'comment', 'doc')),
  entity_id   TEXT NOT NULL,
  entity_title TEXT,          -- denormalized for display without join
  meta        TEXT DEFAULT '{}',  -- JSON: e.g. { from: 'todo', to: 'in_progress' }
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Fields:
- `meta` — carries the diff payload (old/new values) for status changes, reassignments, etc.
- `entity_title` — stored at write time to prevent needing a join on every feed read

---

#### `sessions` (in-memory / KV — not D1)

Sessions are managed by Nuxt Auth Utils using signed cookies. No session table is required in D1. If persistent session revocation is needed in the future, a `sessions` table can be added with `session_token` and `expires_at`.

---

### 3.3 Indexes

```sql
-- Frequent lookup patterns
CREATE INDEX idx_epics_goal_id ON epics(goal_id);
CREATE INDEX idx_tasks_epic_id ON tasks(epic_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_activity_feed_entity ON activity_feed(entity_type, entity_id);
CREATE INDEX idx_activity_feed_actor ON activity_feed(actor_id);
CREATE INDEX idx_changelogs_epic_id ON changelogs(epic_id);
```

---

## 4. Data Flow

### 4.1 Standard Read Request

```
Browser (Vue component)
  │
  │  useAsyncData('tasks', () => $fetch('/api/tasks?page=1&limit=20'))
  ▼
Nuxt 4 Server (Nitro, running on Cloudflare Pages)
  │
  │  /server/api/tasks/index.get.ts
  │  1. Read session cookie → validate via useAuthSession()
  │  2. Check role permissions (RBAC guard)
  │  3. Parse query params: page, limit, epicId, status, assigneeId
  │  4. Build Drizzle query with WHERE + LIMIT + OFFSET
  ▼
Cloudflare D1 (via Workers binding)
  │
  │  SELECT tasks.*, users.name AS assignee_name
  │  FROM tasks LEFT JOIN users ON tasks.assignee_id = users.id
  │  WHERE tasks.epic_id = ? AND tasks.status = ?
  │  ORDER BY tasks.created_at DESC
  │  LIMIT 20 OFFSET 0
  ▼
Nuxt Server
  │  5. Shape response: { data: Task[], meta: { page, total, totalPages } }
  ▼
Browser
  │  6. Render task list from response
  │  No raw SQL ever reaches the browser.
```

### 4.2 Standard Write Request

```
Browser
  │  $fetch('/api/tasks', { method: 'POST', body: { title, epicId, ... } })
  ▼
Nuxt Server /server/api/tasks/index.post.ts
  │  1. Validate session cookie
  │  2. Validate body with Zod schema
  │  3. RBAC check: can this role create tasks in this epic?
  │  4. Insert row via Drizzle
  │  5. Write to activity_feed (actor, action: 'created', entity_type: 'task')
  │  6. Return created task
  ▼
Browser
  │  Invalidate and refresh relevant useAsyncData keys
```

### 4.3 Pagination Pattern

Every list endpoint returns:

```typescript
{
  data: T[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

Default: `limit=20`, max: `limit=100`. No `perPage=1000` anywhere.

---

## 5. Auth Flow

### 5.1 Login

```
Browser → POST /api/auth/login { email, password }
          │
          ▼
Nuxt Server
  1. Query users table: SELECT * FROM users WHERE email = ?
  2. Verify password hash (bcrypt)
  3. If valid: call setUserSession(event, { user: { id, email, name, role } })
     → Nuxt Auth Utils seals the payload using a server-side secret
     → Sets HttpOnly cookie: nuxt-session (SameSite=Lax, Secure)
  4. Return { user } to browser (no token in response body)
          │
          ▼
Browser
  - Cookie stored by browser automatically
  - No JWT in localStorage, no sessionStorage
  - Subsequent requests: cookie attached automatically by browser
```

### 5.2 Session Validation Per Request

Every protected server route starts with:

```typescript
// /server/utils/auth.ts
export async function requireAuth(event: H3Event) {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return session.user
}

export async function requireRole(event: H3Event, roles: string[]) {
  const user = await requireAuth(event)
  if (!roles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
  return user
}
```

Usage in a route:

```typescript
// /server/api/epics/index.post.ts
export default defineEventHandler(async (event) => {
  const user = await requireRole(event, ['admin', 'manager'])
  const body = await readValidatedBody(event, epicCreateSchema.parse)
  // ... insert
})
```

### 5.3 Logout

```
Browser → POST /api/auth/logout
Nuxt Server → clearUserSession(event)
            → Cookie cleared via Set-Cookie: nuxt-session=; Max-Age=0
Browser → Redirected to /login
```

### 5.4 Password Storage

Passwords hashed with `bcrypt` at cost factor 12 before storage. The `users` table holds a `password_hash TEXT NOT NULL` column (omitted from the schema above for brevity — never returned in API responses).

---

## 6. RBAC Matrix

The table below defines what each role can do per entity. "Own" means records created by or assigned to that user.

### Notation
- `✓` = allowed
- `own` = only own records
- `✗` = denied (server returns 403)

### Users

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List users | ✓ | ✓ | ✓ | ✓ |
| View user profile | ✓ | ✓ | ✓ | ✓ |
| Create user | ✓ | ✗ | ✗ | ✗ |
| Edit any user | ✓ | ✗ | ✗ | ✗ |
| Edit own profile | ✓ | ✓ | ✓ | ✓ |
| Delete user | ✓ | ✗ | ✗ | ✗ |
| Change role | ✓ | ✗ | ✗ | ✗ |

### Goals

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List goals | ✓ | ✓ | ✓ | ✓ |
| View goal | ✓ | ✓ | ✓ | ✓ |
| Create goal | ✓ | ✓ | ✗ | ✗ |
| Edit goal | ✓ | own | ✗ | ✗ |
| Delete goal | ✓ | ✗ | ✗ | ✗ |
| Archive goal | ✓ | own | ✗ | ✗ |

### Epics

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List epics | ✓ | ✓ | ✓ | ✓ |
| View epic | ✓ | ✓ | ✓ | ✓ |
| Create epic | ✓ | ✓ | ✗ | ✗ |
| Edit epic | ✓ | own | ✗ | ✗ |
| Delete epic | ✓ | ✗ | ✗ | ✗ |
| Write changelog | ✓ | own | ✗ | ✗ |

### Tasks

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List tasks | ✓ | ✓ | ✓ | ✓ |
| View task | ✓ | ✓ | ✓ | ✓ |
| Create task | ✓ | ✓ | ✓ | ✗ |
| Edit any task | ✓ | ✓ | ✗ | ✗ |
| Edit own task | ✓ | ✓ | ✓ | ✗ |
| Update status (own) | ✓ | ✓ | ✓ | ✓ |
| Assign task | ✓ | ✓ | ✗ | ✗ |
| Delete task | ✓ | ✓ | own | ✗ |
| Add dependency | ✓ | ✓ | ✗ | ✗ |

### Subtasks

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| Create subtask | ✓ | ✓ | own (parent task) | ✗ |
| Edit subtask | ✓ | ✓ | own | ✗ |
| Toggle done | ✓ | ✓ | ✓ | ✓ |
| Delete subtask | ✓ | ✓ | own | ✗ |

### Comments

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| View comments | ✓ | ✓ | ✓ | ✓ |
| Post comment | ✓ | ✓ | ✓ | ✓ |
| Edit own comment | ✓ | ✓ | ✓ | ✗ |
| Delete own comment | ✓ | ✓ | ✓ | ✗ |
| Delete any comment | ✓ | ✗ | ✗ | ✗ |

### Docs

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| View docs | ✓ | ✓ | ✓ | ✓ |
| Create doc | ✓ | ✓ | ✓ | ✗ |
| Edit own doc | ✓ | ✓ | ✓ | ✗ |
| Edit any doc | ✓ | ✗ | ✗ | ✗ |
| Delete doc | ✓ | own | own | ✗ |

### Templates

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| View global templates | ✓ | ✓ | ✓ | ✓ |
| Create template | ✓ | ✓ | ✓ | ✗ |
| Mark as global | ✓ | ✓ | ✗ | ✗ |
| Delete any template | ✓ | ✗ | ✗ | ✗ |
| Delete own template | ✓ | ✓ | ✓ | ✗ |

### Time Entries

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| Log time | ✓ | ✓ | ✓ | ✗ |
| View own time | ✓ | ✓ | ✓ | ✗ |
| View any time | ✓ | ✓ | ✗ | ✗ |
| Edit own entry | ✓ | ✓ | ✓ | ✗ |
| Delete any entry | ✓ | ✗ | ✗ | ✗ |

---

## 7. API Structure

All endpoints follow Nuxt 4 file-system routing conventions under `/server/api/`. File names map to HTTP methods.

### Convention

```
/server/api/[resource]/
  index.get.ts       → GET    /api/[resource]          (list)
  index.post.ts      → POST   /api/[resource]          (create)
  [id].get.ts        → GET    /api/[resource]/[id]     (read one)
  [id].put.ts        → PUT    /api/[resource]/[id]     (full update)
  [id].patch.ts      → PATCH  /api/[resource]/[id]     (partial update)
  [id].delete.ts     → DELETE /api/[resource]/[id]     (delete)
```

### Full API Surface

```
/api/auth/
  login.post.ts
  logout.post.ts
  session.get.ts         → Returns current session user (for client hydration)

/api/users/
  index.get.ts           → Admin/Manager: list all users
  [id].get.ts
  [id].patch.ts          → Admin: any; self: own profile
  [id].delete.ts         → Admin only

/api/goals/
  index.get.ts           → Paginated list, filterable by status
  index.post.ts          → Admin, Manager
  [id].get.ts
  [id].patch.ts
  [id].delete.ts         → Admin only
  [id]/epics.get.ts      → Epics under a goal (paginated)

/api/epics/
  index.get.ts
  index.post.ts          → Admin, Manager
  [id].get.ts
  [id].patch.ts
  [id].delete.ts         → Admin only
  [id]/tasks.get.ts      → Tasks under an epic (paginated)
  [id]/changelog.get.ts
  [id]/changelog.post.ts

/api/tasks/
  index.get.ts           → Supports ?epicId, ?assigneeId, ?status, ?page, ?limit
  index.post.ts
  [id].get.ts
  [id].patch.ts
  [id].delete.ts
  [id]/subtasks.get.ts
  [id]/subtasks.post.ts
  [id]/comments.get.ts
  [id]/comments.post.ts
  [id]/time.get.ts
  [id]/time.post.ts
  [id]/dependencies.get.ts
  [id]/dependencies.post.ts
  [id]/dependencies.[dependId].delete.ts

/api/subtasks/
  [id].patch.ts
  [id].delete.ts

/api/comments/
  [id].patch.ts
  [id].delete.ts

/api/docs/
  index.get.ts           → Supports ?goalId, ?epicId, ?taskId
  index.post.ts
  [id].get.ts
  [id].patch.ts
  [id].delete.ts

/api/templates/
  index.get.ts
  index.post.ts
  [id].get.ts
  [id].patch.ts
  [id].delete.ts
  [id]/apply.post.ts     → Creates an epic/task from a template

/api/time/
  index.get.ts           → Supports ?userId, ?taskId, ?from, ?to
  [id].patch.ts
  [id].delete.ts

/api/activity/
  index.get.ts           → Global activity feed, paginated
  [entityType]/[entityId].get.ts  → Feed for a specific entity

/api/search/
  index.get.ts           → ?q= across tasks, epics, goals, docs

/api/ai/
  chat.post.ts           → Sends message + context to Claude API
  context.get.ts         → Returns structured app context for AI consumption
```

### Response Envelope

All API responses use a consistent shape:

```typescript
// Success
{ data: T, meta?: PaginationMeta }

// Error
{ error: { code: string, message: string, details?: unknown } }
```

---

## 8. Real-Time Considerations

Cloudflare D1 is a request/response database with no native push capability. Real-time features are implemented via polling or Cloudflare Durable Objects in a future phase.

### 8.1 Activity Feed (Current Phase — Polling)

The activity feed is written synchronously on every mutation:

```typescript
// Called inside every mutating route handler
await db.insert(activityFeedTable).values({
  actorId: user.id,
  action: 'status_changed',
  entityType: 'task',
  entityId: task.id,
  entityTitle: task.title,
  meta: JSON.stringify({ from: oldStatus, to: newStatus })
})
```

The frontend polls `/api/activity?after=[lastSeenTimestamp]` every 30 seconds using `setInterval` inside a composable. This is acceptable for an internal tool with a small team.

```typescript
// composables/useActivityFeed.ts
export function useActivityFeed() {
  const feed = ref<ActivityEntry[]>([])
  const lastSeen = ref(new Date().toISOString())

  const poll = async () => {
    const { data } = await $fetch('/api/activity', {
      query: { after: lastSeen.value, limit: 50 }
    })
    if (data.length) {
      feed.value = [...data, ...feed.value].slice(0, 200)
      lastSeen.value = data[0].created_at
    }
  }

  onMounted(() => {
    poll()
    const interval = setInterval(poll, 30_000)
    onUnmounted(() => clearInterval(interval))
  })

  return { feed }
}
```

### 8.2 Notifications

Notifications are a filtered view of `activity_feed` where the current user is @mentioned in comments or is the assignee of a task that changed status. Stored in the same table, read via:

```
GET /api/activity?targetUserId=[userId]&unread=true
```

A `notifications_read_at` timestamp per user (stored in the `users` table) determines what counts as unread.

### 8.3 Future: Cloudflare Durable Objects

If real-time push is required, Cloudflare Durable Objects can be added without changing the stack. Each epic or board would map to a Durable Object that holds a WebSocket connection. This is out of scope for v1 but the polling approach is designed to be drop-in replaced.

---

## 9. AI Assistant Integration

The AI assistant is the lowest-priority feature. It is isolated in a dedicated panel and does not affect core functionality.

### 9.1 Architecture

```
Browser (AI Panel component)
  │  POST /api/ai/chat { message, contextSnapshot }
  ▼
/server/api/ai/chat.post.ts
  │  1. requireAuth(event)
  │  2. Read context from /api/ai/context (or accept pre-fetched snapshot)
  │  3. Build system prompt with app context
  │  4. Call Anthropic Claude API (server-side, API key in env)
  │  5. Stream response back to browser
  ▼
Browser
  │  Render streamed response in the panel
```

### 9.2 Context Endpoint

```
GET /api/ai/context
```

Returns a read-only snapshot of the current user's workspace:

```typescript
{
  user: { name, role },
  myTasks: Task[],        // tasks assigned to current user, status != done
  overdueCount: number,
  activeEpics: Epic[],    // epics with status = in_progress
  recentActivity: ActivityEntry[]  // last 20 activity items
}
```

This context is injected as the system prompt for every AI conversation. The assistant can answer questions like "what am I blocked on?" or "summarize this week's progress" without direct DB access.

### 9.3 Claude API Call

```typescript
// /server/api/ai/chat.post.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { message, history } = await readBody(event)
  const context = await getAIContext(event, user)

  const stream = await client.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    system: buildSystemPrompt(context),
    messages: [...history, { role: 'user', content: message }]
  })

  // Stream back to browser via SSE
  return sendStream(event, stream.toReadableStream())
})
```

### 9.4 Constraints

- The AI assistant has read-only access to context. It cannot mutate data.
- API key is stored in Cloudflare Pages environment variable, never in the browser.
- Conversation history is client-side only (not persisted to D1 in v1).

---

## 10. Deployment Architecture

### 10.1 Infrastructure Map

```
GitHub Repository
  │
  │  Push to main branch
  ▼
Cloudflare Pages Build Pipeline
  │  nuxt build → .output/
  │  Nitro preset: cloudflare-pages
  ▼
Cloudflare Pages (Global CDN)
  ├── Static assets served from CDN edge (~300 locations)
  ├── Server routes run as Cloudflare Workers (V8 isolates)
  └── D1 binding: DB → Cloudflare D1 (SQLite, regional replication)

Environment Variables (Cloudflare Pages dashboard):
  NUXT_SESSION_PASSWORD     → 32+ char random string (cookie signing)
  ANTHROPIC_API_KEY         → Claude API key
  NUXT_PUBLIC_APP_URL       → https://pt.eluxemang.top
```

### 10.2 Build Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  modules: [
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/ui'
  ],

  hub: {
    database: true   // enables D1 binding via NuxtHub
  }
})
```

### 10.3 Database Migrations

Managed via Drizzle Kit:

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply to local D1
npx wrangler d1 execute elux-tracker --local --file ./drizzle/0001_init.sql

# Apply to production D1
npx wrangler d1 execute elux-tracker --file ./drizzle/0001_init.sql
```

### 10.4 Environment Separation

| Environment | Cloudflare Pages Branch | D1 Database |
|---|---|---|
| Production | `main` | `elux-tracker-prod` |
| Staging | `staging` | `elux-tracker-staging` |
| Local dev | `wrangler dev` | Local D1 file |

### 10.5 Local Development

```bash
# Start full local dev with D1 simulation
npx nuxi dev --remote

# Or via NuxtHub local dev (recommended)
npx nuxthub dev
```

NuxtHub provides a local D1 emulation via `wrangler` under the hood, allowing full end-to-end local development without deploying.

### 10.6 Performance Budget

| Metric | Target |
|---|---|
| Time to First Byte (TTFB) | < 200ms |
| Largest Contentful Paint (LCP) | < 2s |
| API response (list, paginated) | < 300ms |
| API response (single entity) | < 100ms |
| D1 query time (simple select) | < 10ms |

D1 runs in the same Cloudflare data center as the Worker handling the request. Latency between Worker and D1 is single-digit milliseconds.

---

*End of Blueprint — v1.0*
