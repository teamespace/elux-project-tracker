# Elux Project Tracker — Security Architecture

**Project:** Elux Project Tracker Full Revamp  
**Company:** Elux — AI-native product design agency, Indonesia  
**Date:** June 2026  
**Version:** 1.0

---

## Table of Contents

1. [Security Principles](#security-principles)
2. [Threat Model](#threat-model)
3. [Auth Architecture](#auth-architecture)
4. [RBAC — Role Definitions and Permission Matrix](#rbac--role-definitions-and-permission-matrix)
5. [Server-Side RBAC Enforcement](#server-side-rbac-enforcement)
6. [UI-Level RBAC Enforcement](#ui-level-rbac-enforcement)
7. [API Security](#api-security)
8. [Data Security](#data-security)
9. [CSRF Protection](#csrf-protection)
10. [XSS Prevention and CSP](#xss-prevention-and-csp)
11. [Audit Logging](#audit-logging)
12. [Rate Limiting](#rate-limiting)
13. [Security Checklist — Pre-Launch](#security-checklist--pre-launch)
14. [Known Accepted Risks and Mitigations](#known-accepted-risks-and-mitigations)

---

## Security Principles

### 1. Server-Side First

The browser is untrusted territory. Every piece of data that requires authorization must be fetched through a Cloudflare Worker server route — never directly from the client to the database. The client receives only what the authenticated user is permitted to see. This eliminates the entire class of vulnerabilities caused by the current PocketBase browser-direct pattern.

### 2. Defense in Depth

Security is enforced at multiple layers simultaneously: the network layer (Cloudflare rate limiting, WAF), the server layer (Worker middleware, role checks), and the UI layer (conditional rendering). A failure at one layer does not expose the system. The UI layer is cosmetic reinforcement, not a security boundary — the server layer is the real enforcement.

### 3. Least Privilege

Every role receives only the minimum data and permissions needed to do their job. A Member should not receive a list of all team members' tasks just because the endpoint exists. Server routes enforce per-user data scoping, not just per-role action permissions.

### 4. Fail Secure

When something goes wrong — an expired session, an invalid token, a missing permission — the system defaults to denying access. No fallback logic should accidentally grant access.

### 5. Audit Everything That Matters

Every create, update, and delete action on core entities is logged with who did it, when, and what changed. This supports both security incident investigation and the product-level changelog feature.

### 6. No Security Through Obscurity

RBAC is not implemented by hiding routes or URLs. A Member navigating directly to `/app/admin/users` gets a 403, not a redirect to a page they can see. Security must hold up to direct URL access, direct API calls, and modified frontend code.

---

## Threat Model

### In Scope

- **Session hijacking:** stealing an authenticated user's session cookie
- **Cross-site scripting (XSS):** injecting scripts via task/epic/comment content
- **Cross-site request forgery (CSRF):** tricking a logged-in user into submitting a form to the app
- **Privilege escalation:** a Member accessing Admin or Manager-only endpoints
- **Data leakage:** server routes returning more data than the requesting user is allowed to see
- **Brute-force attacks:** automated login attempts against the auth endpoint
- **Injection attacks:** SQL injection via API parameters into D1 queries

### Out of Scope (for this revamp)

- Physical access attacks
- Cloudflare infrastructure compromise
- Supply chain attacks on npm packages (mitigated by `npm audit` in CI, not in scope as a product decision)
- Anthropic API compromise (Phase 6)

---

## Auth Architecture

### Why HttpOnly Cookies, Not localStorage

The current system stores JWT tokens in localStorage. localStorage is accessible to any JavaScript running on the page — including injected scripts from XSS vulnerabilities. If an attacker injects a script, they can read `localStorage.getItem('token')` and exfiltrate the token, giving them full session access.

An HttpOnly cookie cannot be read by JavaScript at all. Even if XSS occurs, the attacker cannot steal the session token. The browser sends the cookie automatically with every request to the same origin, and only the server can read its value.

**Summary of the change:**

| Property | localStorage JWT (current) | HttpOnly Cookie (new) |
|---|---|---|
| Readable by JS | Yes (XSS vulnerable) | No |
| Sent automatically | No (must be added to headers) | Yes (automatic on same-origin requests) |
| Accessible in DevTools | Yes (Application tab) | Not readable, only visible as header |
| Expiry enforceable server-side | No (client holds the token) | Yes (server can invalidate) |
| Logout invalidation | Only by deleting client-side token | Server marks session invalid |

### Session Strategy

The new system uses a **signed HttpOnly session cookie** backed by a D1 sessions table. This is a stateful session — the server can invalidate it at any time (on logout, on password change, on suspicious activity).

Alternative considered: stateless signed JWT in an HttpOnly cookie. Rejected because a stateless JWT cannot be invalidated before expiry without a blocklist, which adds complexity equivalent to the D1 sessions table anyway.

### Login Flow

```
1. User submits email + password to POST /api/auth/login

2. Worker validates input (email format, password not empty)

3. Worker queries D1: SELECT * FROM users WHERE email = ?
   - Uses parameterized query (no SQL injection possible)

4. Worker compares submitted password against stored bcrypt hash
   (bcrypt.verify — never compare plaintext)

5. If credentials are invalid: return 401 { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }
   - Same error message for both wrong email and wrong password (no user enumeration)

6. If credentials are valid:
   a. Generate a cryptographically random session ID (crypto.randomUUID())
   b. INSERT into sessions table: session_id, user_id, created_at, expires_at, ip_address, user_agent
   c. Set response header: Set-Cookie: session=<session_id>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400

7. Return 200 { user: { id, name, email, role } }
   - Do not return the session ID or any auth token in the response body

8. Client redirects to /app/dashboard
```

### Session Verification (Middleware)

Every request to `/api/*` and `/app/*` routes passes through a Nuxt server middleware:

```
1. Read session cookie from request headers

2. If no cookie: return 401 / redirect to /login

3. Query D1: SELECT * FROM sessions JOIN users ON sessions.user_id = users.id
   WHERE sessions.session_id = ? AND sessions.expires_at > NOW() AND sessions.revoked = 0

4. If no matching session: clear cookie, return 401

5. Attach user object (id, name, email, role) to the request context (event.context.user)

6. Let request proceed
```

The user object attached in step 5 is the authoritative source of the current user's identity and role for every subsequent handler in the request lifecycle. It is never read from the request body or query parameters.

### Token Refresh

Sessions have a 24-hour expiry by default. The middleware silently extends the session expiry on each request if the session is more than 12 hours old (rolling expiry). This keeps active users logged in without requiring a re-login every 24 hours.

On inactivity for 24 hours, the session expires and the next request redirects to login.

### Logout Flow

```
1. User clicks logout (or session is invalidated server-side)

2. POST /api/auth/logout (no body needed — session is read from cookie)

3. Worker: UPDATE sessions SET revoked = 1 WHERE session_id = ?

4. Worker: Set-Cookie: session=; HttpOnly; Secure; Max-Age=0 (clears the cookie)

5. Return 200

6. Client redirects to /login
```

Setting `revoked = 1` means the session is immediately invalid on the server. Even if the browser somehow retained the cookie, the next request would find no valid session in D1. This is the key advantage of stateful sessions over stateless JWTs.

### Password Reset

Since PocketBase password hashes cannot be exported, all migrated users must reset their password on first login. The reset flow:

1. User enters email on `/forgot-password`
2. Worker: check if email exists in D1 (but return same success message regardless — no email enumeration)
3. If email exists: generate a time-limited reset token (expires in 1 hour), store in `password_reset_tokens` table, send email via Cloudflare Email Workers
4. User clicks link in email → `/reset-password?token=<token>`
5. Worker validates token (exists, not expired, not already used)
6. User sets new password; Worker hashes with bcrypt (cost factor 12), updates `users.password_hash`, marks token as used, revokes all existing sessions for that user

---

## RBAC — Role Definitions and Permission Matrix

### Role Definitions

**Admin**
Full access to everything. Can manage users, roles, and all project data. Can see all teams, all tasks, all epics, all goals. Can delete anything. There should be no more than 2–3 Admins in the system at any time.

**Manager**
Can create and manage epics and goals. Can assign tasks to team members. Can see all tasks and team workload. Cannot manage user accounts or change roles. Cannot delete other users' work without being assigned as the project lead.

**Member**
Can create, edit, and complete tasks assigned to or created by themselves. Can comment on tasks and epics they have access to. Cannot create or edit epics or goals. Cannot see other members' private notes or unreleased work. Can see the board and dashboard for their assigned projects.

**Intern**
Read-only by default. Can view tasks, epics, goals, and the board. Cannot create, edit, or delete anything. Cannot comment unless explicitly granted by Admin.

### Permission Matrix

The following table defines server-side permissions. "Own" means records where `assignee_id = current_user.id` or `created_by = current_user.id`.

#### Tasks

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List all tasks | Yes | Yes | No — own only | No — assigned to them |
| Read task detail | Yes | Yes | Yes (visible tasks) | Yes (visible tasks) |
| Create task | Yes | Yes | Yes | No |
| Edit any task | Yes | Yes | No | No |
| Edit own task | Yes | Yes | Yes | No |
| Delete any task | Yes | No | No | No |
| Delete own task | Yes | Yes | Yes | No |
| Change task status | Yes | Yes | Yes (own) | No |
| Assign task to user | Yes | Yes | No | No |
| Change task priority | Yes | Yes | No | No |
| Add comment | Yes | Yes | Yes | No |
| Delete any comment | Yes | No | No | No |
| Delete own comment | Yes | Yes | Yes | No |

#### Epics

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List epics | Yes | Yes | Yes | Yes |
| Read epic detail | Yes | Yes | Yes | Yes |
| Create epic | Yes | Yes | No | No |
| Edit epic | Yes | Yes | No | No |
| Delete epic | Yes | No | No | No |
| Update risk level | Yes | Yes | No | No |
| Link task to epic | Yes | Yes | No | No |

#### Goals

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List goals | Yes | Yes | Yes | Yes |
| Read goal detail | Yes | Yes | Yes | Yes |
| Create goal | Yes | Yes | No | No |
| Edit goal | Yes | Yes | No | No |
| Delete goal | Yes | No | No | No |

#### Users and Team

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List all users | Yes | Yes (limited fields) | No | No |
| Read own profile | Yes | Yes | Yes | Yes |
| Edit own profile | Yes | Yes | Yes | Yes |
| Edit any user | Yes | No | No | No |
| Change user role | Yes | No | No | No |
| Deactivate user | Yes | No | No | No |
| View team workload | Yes | Yes | No | No |

#### Templates

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List templates | Yes | Yes | Yes (shared only) | No |
| Use template | Yes | Yes | Yes | No |
| Create template | Yes | Yes | No | No |
| Edit template | Yes | Own | No | No |
| Delete template | Yes | Own | No | No |
| Share template | Yes | Yes | No | No |

#### Time Entries

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| Create time entry | Yes | Yes | Yes | No |
| Edit own entry | Yes | Yes | Yes | No |
| Delete own entry | Yes | Yes | Yes | No |
| Delete any entry | Yes | No | No | No |
| View all entries | Yes | Yes | No | No |
| View own entries | Yes | Yes | Yes | No |

#### Docs

| Action | Admin | Manager | Member | Intern |
|---|---|---|---|---|
| List docs | Yes | Yes | Yes | Yes |
| Read doc | Yes | Yes | Yes | Yes |
| Create doc | Yes | Yes | No | No |
| Edit doc | Yes | Yes | No | No |
| Delete doc | Yes | No | No | No |

---

## Server-Side RBAC Enforcement

RBAC must be enforced in the Cloudflare Worker, not only in the UI. A Member who opens DevTools and manually calls `DELETE /api/tasks/123` must receive a 403, even if the UI never rendered a Delete button for them.

### Middleware Structure

All server routes are protected by a layered middleware approach in Nuxt server routes:

```
/server/middleware/
  auth.ts          — attaches session user to event.context.user; 401 if no session
  
/server/utils/
  permissions.ts   — requireRole(), requireOwnership(), hasPermission() helpers
  
/server/api/
  tasks/
    index.get.ts   — GET /api/tasks (list)
    index.post.ts  — POST /api/tasks (create)
    [id].get.ts    — GET /api/tasks/:id
    [id].put.ts    — PUT /api/tasks/:id
    [id].delete.ts — DELETE /api/tasks/:id
```

### `requireRole` Helper

```typescript
// /server/utils/permissions.ts

export function requireRole(event: H3Event, ...roles: Role[]) {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Unauthenticated' })
  if (!roles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Insufficient permissions' })
  }
}

export function requireOwnership(event: H3Event, ownerId: string) {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, message: 'Unauthenticated' })
  if (user.role === 'admin') return // Admin bypasses ownership check
  if (user.id !== ownerId) {
    throw createError({ statusCode: 403, message: 'Insufficient permissions' })
  }
}
```

### Example: DELETE /api/tasks/:id

```typescript
// /server/api/tasks/[id].delete.ts

export default defineEventHandler(async (event) => {
  // Auth middleware already attached event.context.user

  const taskId = getRouterParam(event, 'id')
  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, taskId) })

  if (!task) throw createError({ statusCode: 404, message: 'Task not found' })

  const user = event.context.user

  // Admins can delete anything
  // Managers and Members can only delete their own tasks
  if (user.role !== 'admin' && task.createdBy !== user.id) {
    throw createError({ statusCode: 403, message: 'Insufficient permissions' })
  }

  await db.delete(tasks).where(eq(tasks.id, taskId))

  // Audit log
  await logActivity(event, 'task.deleted', taskId, null, task)

  return { success: true }
})
```

### Data Scoping

Listing endpoints must scope results to what the user can see, not return all rows and let the client filter.

```typescript
// /server/api/tasks/index.get.ts — Member scoping example

const user = event.context.user
const query = db.select().from(tasks)

if (user.role === 'member') {
  // Members only see tasks assigned to them or created by them
  query.where(
    or(
      eq(tasks.assigneeId, user.id),
      eq(tasks.createdBy, user.id)
    )
  )
} else if (user.role === 'intern') {
  // Interns see tasks assigned to them only
  query.where(eq(tasks.assigneeId, user.id))
}
// Admin and Manager see all tasks (no additional filter)
```

### Pagination Enforcement

Every list endpoint enforces pagination. The client cannot request more than 100 records at once.

```typescript
const page = Math.max(1, Number(getQuery(event).page) || 1)
const limit = Math.min(100, Math.max(1, Number(getQuery(event).limit) || 20))
const offset = (page - 1) * limit
```

No endpoint will ever process `perPage=1000` or similar. If the client sends a limit above 100, it is silently capped.

---

## UI-Level RBAC Enforcement

UI enforcement is secondary to server enforcement. It exists to prevent members from seeing buttons and actions they cannot use, improving UX and reducing accidental errors. It is not a security boundary.

### `usePermissions` Composable

```typescript
// /composables/usePermissions.ts

export function usePermissions() {
  const { user } = useAuth()

  const can = (action: string, resource?: Record<string, unknown>) => {
    if (!user.value) return false

    const role = user.value.role

    switch (action) {
      case 'task:delete':
        if (role === 'admin') return true
        if (role === 'manager' || role === 'member') {
          return resource?.createdBy === user.value.id
        }
        return false

      case 'epic:create':
        return role === 'admin' || role === 'manager'

      case 'user:manage':
        return role === 'admin'

      // ... all permissions defined here
      default:
        return false
    }
  }

  return { can }
}
```

### Usage in Components

```vue
<!-- TaskRow.vue -->
<template>
  <div class="task-row">
    <span>{{ task.title }}</span>
    
    <!-- Only rendered if the user has permission -->
    <div v-if="can('task:edit', task)" class="actions">
      <button @click="openEdit">Edit</button>
    </div>
    <div v-if="can('task:delete', task)" class="actions">
      <button @click="confirmDelete">Delete</button>
    </div>
  </div>
</template>

<script setup>
const { can } = usePermissions()
</script>
```

The `can()` function always checks against the session user object fetched server-side on page load — never against a client-side state that could be tampered with. If the session user object says the role is Member, all Member-level restrictions apply regardless of what is in any other client-side store.

---

## API Security

### All Data Access Through Server Routes

The browser does not call PocketBase or D1 directly. The browser calls `/api/*` Nuxt server routes, which run in the Cloudflare Worker context. The Worker has the D1 binding and any secrets. The browser has no access to database credentials, connection strings, or internal IDs that are not part of the response.

This replaces the current pattern where the browser calls `pb.eluxemang.top` directly with the user's JWT and receives whatever PocketBase allows.

### Input Validation

All server routes validate their inputs using zod before any database operation. Validation errors return 400 with a structured error body.

```typescript
// /server/api/tasks/index.post.ts

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  assigneeId: z.string().uuid().optional(),
  epicId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['todo', 'in_progress', 'in_review', 'done']).default('todo'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = createTaskSchema.safeParse(body)
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      data: { errors: result.error.flatten() }
    })
  }
  
  // Proceed with result.data — all fields type-safe and validated
})
```

### SQL Injection Prevention

All D1 queries use parameterized statements through Drizzle ORM. Raw SQL is never constructed from user input. Drizzle's query builder ensures values are always parameterized.

```typescript
// Safe — parameterized
const task = await db.query.tasks.findFirst({
  where: eq(tasks.id, taskId) // taskId is bound as a parameter
})

// Never do this
const task = await db.run(`SELECT * FROM tasks WHERE id = '${taskId}'`) // SQL injection risk
```

### Response Filtering

Sensitive fields are never included in API responses. This is enforced by defining explicit select columns rather than selecting `*`.

Fields that are never sent to the client:
- `password_hash` — user passwords
- `session_id` — internal session identifiers  
- `reset_token` — password reset tokens
- `internal_notes` — Admin-only fields on user records

```typescript
// /server/api/users/index.get.ts

const users = await db.select({
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
  role: usersTable.role,
  avatarUrl: usersTable.avatarUrl,
  // password_hash is intentionally omitted
}).from(usersTable)
```

---

## Data Security

### Least Privilege Data Access

The server routes scope queries to what the requesting user is allowed to see. This is not optional filtering — it is the default behavior.

**Members:**
- Task list: only tasks where `assignee_id = user.id OR created_by = user.id`
- Epic list: all epics (read-only)
- Goal list: all goals (read-only)
- User list: only themselves (own profile)

**Interns:**
- Task list: only tasks assigned to them
- Epic list: all epics (read-only)
- Goal list: all goals (read-only)
- User list: none (no access to user list endpoint)

**Managers:**
- Task list: all tasks in projects they manage
- User list: all users, but only name/email/role/avatar (no internal fields)

**Admins:**
- Full access to all data

### No Bulk Exports Without Authorization

No endpoint returns an unbounded list of records. The `perPage=1000` pattern from the current system is eliminated. All list endpoints enforce pagination with a maximum of 100 records per page, server-side.

### D1 Binding Security

The D1 database binding is available only in the Worker context. It is not exposed to the client. Cloudflare Workers have access to the binding via the `env` object, which is injected at runtime and never serialized to the client.

---

## CSRF Protection

### Why CSRF Is a Risk

When using cookie-based sessions, a malicious website can trick a logged-in user's browser into sending a request to the app. The browser automatically attaches the session cookie to any request to the app's domain. Without CSRF protection, an attacker could craft a form on their own site that submits to `POST /api/tasks` and the browser would include the user's valid session cookie.

### Implementation

The app uses the **Double Submit Cookie** pattern, appropriate for a SPA with API routes:

1. On login, the server sets a second cookie: `csrf_token=<random_value>; SameSite=Lax; Secure` (NOT HttpOnly — this one must be readable by JavaScript)
2. The Nuxt app reads this cookie value in a composable and includes it as the `X-CSRF-Token` request header on all mutating requests (POST, PUT, PATCH, DELETE)
3. The server middleware for mutating routes checks that `X-CSRF-Token` header equals the `csrf_token` cookie value
4. An attacker's malicious form cannot set the `X-CSRF-Token` header because it cannot read the csrf_token cookie (same-origin policy prevents cross-origin cookie reads)

```typescript
// /server/middleware/csrf.ts

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return

  // Skip for auth routes that create the session (no session yet)
  if (getRequestURL(event).pathname === '/api/auth/login') return

  const csrfFromHeader = getHeader(event, 'x-csrf-token')
  const csrfFromCookie = getCookie(event, 'csrf_token')

  if (!csrfFromHeader || !csrfFromCookie || csrfFromHeader !== csrfFromCookie) {
    throw createError({ statusCode: 403, message: 'CSRF validation failed' })
  }
})
```

### SameSite Cookie Attribute

The session cookie is set with `SameSite=Lax`. This provides baseline CSRF protection for most cross-site navigation scenarios:
- Lax: cross-site GET requests include the cookie, but cross-site POST requests do not
- Combined with the explicit CSRF token check, this provides defense in depth

`SameSite=Strict` was considered but rejected because it breaks OAuth redirects and some legitimate cross-site navigation flows. `Lax` is the right default for this use case.

---

## XSS Prevention and CSP

### Content Security Policy

Cloudflare Pages supports adding custom HTTP headers via `_headers` file or Cloudflare Transform Rules. The following CSP is applied to all pages:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://avatars.example.com;
  font-src 'self';
  connect-src 'self' https://api.anthropic.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

Notes:
- `unsafe-inline` for styles is needed for Tailwind's dynamic classes. This is an accepted risk documented below.
- `unsafe-eval` is explicitly excluded. No code in the app should use `eval()` or `new Function()`.
- `connect-src` includes `api.anthropic.com` for Phase 6 AI features. Until Phase 6, this is not included.
- `frame-src 'none'` prevents the app from being iframed (clickjacking protection)

### CSP Deployment Strategy

1. Deploy CSP in **report-only mode** first: `Content-Security-Policy-Report-Only: ...`
2. Monitor for violations in Cloudflare Analytics for one week
3. Fix any violations (usually caused by third-party scripts or inline styles in a library)
4. Promote to enforce mode: `Content-Security-Policy: ...`

### Output Encoding

All user-generated content rendered in the UI is treated as plain text, not HTML. Vue's template syntax (`{{ }}`) HTML-encodes values by default. The use of `v-html` is prohibited unless the content has been explicitly sanitized.

If rich text rendering is needed (Docs Hub), use a controlled renderer (e.g., Tiptap with an allowlist of safe elements) that does not render arbitrary HTML.

### Additional Security Headers

Set on all responses via Cloudflare Pages `_headers` file:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## Audit Logging

### What Gets Logged

Every write operation on a core entity writes a row to the `activity_log` table:

| Event | Trigger |
|---|---|
| `task.created` | POST /api/tasks |
| `task.updated` | PUT/PATCH /api/tasks/:id (includes diff) |
| `task.deleted` | DELETE /api/tasks/:id |
| `task.status_changed` | Status field changes |
| `epic.created` | POST /api/epics |
| `epic.updated` | PUT/PATCH /api/epics/:id |
| `epic.deleted` | DELETE /api/epics/:id |
| `goal.created` | POST /api/goals |
| `goal.updated` | PUT/PATCH /api/goals/:id |
| `goal.deleted` | DELETE /api/goals/:id |
| `user.role_changed` | Admin changes a user's role |
| `user.deactivated` | Admin deactivates a user |
| `auth.login` | Successful login |
| `auth.login_failed` | Failed login attempt |
| `auth.logout` | Logout |
| `auth.password_reset` | Password reset completed |
| `time_entry.created` | POST /api/tasks/:id/time/start (on stop) |
| `time_entry.deleted` | DELETE /api/time/:id |

### Activity Log Schema

```sql
CREATE TABLE activity_log (
  id            TEXT PRIMARY KEY,
  entity_type   TEXT NOT NULL,          -- 'task', 'epic', 'goal', 'user', 'auth'
  entity_id     TEXT,                   -- NULL for auth events
  actor_id      TEXT NOT NULL,          -- user who performed the action
  action        TEXT NOT NULL,          -- 'task.created', 'task.updated', etc.
  before_state  TEXT,                   -- JSON snapshot before change (for updates)
  after_state   TEXT,                   -- JSON snapshot after change
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    INTEGER NOT NULL        -- Unix timestamp
);

CREATE INDEX idx_activity_log_entity ON activity_log (entity_type, entity_id, created_at DESC);
CREATE INDEX idx_activity_log_actor ON activity_log (actor_id, created_at DESC);
CREATE INDEX idx_activity_log_created ON activity_log (created_at DESC);
```

### `logActivity` Helper

```typescript
// /server/utils/activityLog.ts

export async function logActivity(
  event: H3Event,
  action: string,
  entityId: string | null,
  beforeState: unknown,
  afterState: unknown
) {
  const user = event.context.user
  const entityType = action.split('.')[0]

  await db.insert(activityLog).values({
    id: crypto.randomUUID(),
    entityType,
    entityId,
    actorId: user.id,
    action,
    beforeState: beforeState ? JSON.stringify(beforeState) : null,
    afterState: afterState ? JSON.stringify(afterState) : null,
    ipAddress: getRequestIP(event),
    userAgent: getHeader(event, 'user-agent'),
    createdAt: Date.now(),
  })
}
```

### Auth Event Logging

Auth events (login success, login failure, logout, password reset) are logged even before a session is established. Login failures include the email attempted, which is valuable for detecting brute-force or credential stuffing attempts.

Auth log entries are visible only to Admins. They are never included in the product-facing changelog.

### Retention

Activity log entries are retained indefinitely by default (they are the basis for the product changelog feature). Auth events are retained for 90 days, then eligible for automated cleanup.

---

## Rate Limiting

### Why Rate Limiting Is Critical

Without rate limiting:
- The login endpoint can be brute-forced (automated password guessing)
- The API can be scraped to dump all accessible data
- The AI endpoint (Phase 6) can be abused to run up API costs

### Cloudflare Rate Limiting Configuration

Rate limiting is configured at the Cloudflare account level, applied before requests reach the Worker.

**Auth endpoints:**

| Endpoint | Limit | Window | Action |
|---|---|---|---|
| `POST /api/auth/login` | 5 requests | 1 minute per IP | Block for 10 minutes |
| `POST /api/auth/forgot-password` | 3 requests | 10 minutes per IP | Block for 1 hour |
| `POST /api/auth/reset-password` | 5 requests | 10 minutes per IP | Block for 1 hour |

**API endpoints:**

| Endpoint | Limit | Window | Action |
|---|---|---|---|
| `GET /api/*` | 120 requests | 1 minute per authenticated user | 429 response |
| `POST/PUT/PATCH/DELETE /api/*` | 30 requests | 1 minute per authenticated user | 429 response |
| `POST /api/ai/chat` (Phase 6) | 20 requests | 1 hour per authenticated user | 429 response |

**Global:**
- 1000 requests per minute per IP (DDoS mitigation, handled by Cloudflare WAF)

### Rate Limit Response

When rate limited, the response includes:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

The client displays a user-friendly message and disables the relevant input until `retryAfter` seconds have passed.

### Account Lockout

After 10 failed login attempts from the same IP in 30 minutes (detected via auth event log), the IP is temporarily blocked for 24 hours. This is handled by Cloudflare's existing rate limiting rule above.

There is deliberately no per-account lockout (locking an account after N failures). Per-account lockout creates a denial-of-service vector: an attacker could lock any known email address out of their account. IP-based limiting is preferred.

---

## Security Checklist — Pre-Launch

### Authentication

- [ ] Login endpoint returns the same error message for wrong email and wrong password (no user enumeration)
- [ ] Session cookie has `HttpOnly`, `Secure`, and `SameSite=Lax` attributes
- [ ] Session cookie is not present in any JavaScript-accessible storage (verified with DevTools Application tab)
- [ ] Logout revokes the session in D1 (verify by reusing the cookie after logout — should return 401)
- [ ] Password reset tokens expire after 1 hour and are single-use
- [ ] Passwords are hashed with bcrypt (cost factor ≥ 12) — verify in D1 that hashes start with `$2b$12$`)

### Authorization

- [ ] Sending a DELETE request as a Member returns 403 (test with curl, not browser)
- [ ] Sending a POST to create an epic as a Member returns 403
- [ ] An Intern cannot access `/api/users` — returns 403
- [ ] A Manager cannot change another user's role — returns 403
- [ ] Data scoping verified: Member can only retrieve their own tasks from list endpoint

### CSRF

- [ ] POST request without `X-CSRF-Token` header returns 403
- [ ] POST request with incorrect `X-CSRF-Token` returns 403
- [ ] CSRF token rotates on login (new session = new token)

### API Security

- [ ] `perPage=1000` in any request is capped to 100 server-side
- [ ] Zod validation rejects requests with unexpected fields or incorrect types
- [ ] Response bodies do not contain `password_hash`, `session_id`, or `reset_token` fields

### Headers and CSP

- [ ] `Content-Security-Policy` header present on all page responses
- [ ] `X-Frame-Options: DENY` header present
- [ ] `X-Content-Type-Options: nosniff` header present
- [ ] `Strict-Transport-Security` header present with `includeSubDomains`
- [ ] CSP does not include `unsafe-eval`
- [ ] CSP violations monitored for at least 1 week before enforcing

### Rate Limiting

- [ ] Auth login endpoint blocked after 5 requests per minute per IP
- [ ] Cloudflare rate limiting rules active in production
- [ ] Rate limit response returns `Retry-After` header

### Dependencies

- [ ] `npm audit` shows zero high or critical vulnerabilities
- [ ] All dependencies pinned to exact versions in `package.json`
- [ ] Dependabot or equivalent configured for automated PR on security updates

### Infrastructure

- [ ] D1 database is not publicly accessible (only via Worker binding)
- [ ] Cloudflare Worker secrets (API keys) stored as encrypted Worker secrets, not in code
- [ ] No secrets committed to Git (verify with `git log --all -S 'secret'`)
- [ ] Environment variables for dev/staging/prod are separate (no production secrets in dev)

### Audit Logging

- [ ] Successful and failed login attempts are logged
- [ ] All create/update/delete operations on core entities are logged
- [ ] Audit log is not writable by any non-Admin API endpoint
- [ ] Auth logs are visible only to Admins in the UI

---

## Known Accepted Risks and Mitigations

### 1. `unsafe-inline` for Styles

**Risk:** The CSP `style-src 'unsafe-inline'` allows inline styles, which could be used in a CSS-based injection attack.

**Why accepted:** Tailwind CSS and Nuxt UI v3 rely on dynamically generated classes. Removing `unsafe-inline` for styles requires nonce-based CSP integration with the SSR renderer, which is complex and adds maintenance overhead. CSS-based injection attacks are significantly lower severity than script injection.

**Mitigation:** Vue's template system HTML-encodes all attribute values by default, making CSS injection through user content very difficult. The risk is accepted for v1 and should be revisited when Tailwind v4 has better CSP tooling.

### 2. Stateful Session Store in D1

**Risk:** D1 sessions table adds a database read on every authenticated request (session lookup). Under high load, this adds latency and D1 read costs.

**Why accepted:** Stateless JWT in HttpOnly cookies cannot be invalidated before expiry. The inability to force-logout a compromised account is a worse security trade-off than the D1 read cost.

**Mitigation:** Index `sessions.session_id`. Consider a short-lived cache in KV for session data if latency becomes measurable. Implement session cleanup job (delete `revoked = 1` and expired sessions older than 30 days).

### 3. Email-Based Password Reset

**Risk:** If a user's email account is compromised, their tracker account can be taken over via the reset flow.

**Why accepted:** Email-based reset is industry standard. TOTP/hardware key MFA would eliminate this but adds significant UX friction for an internal tool.

**Mitigation:** Log all password reset events with IP address. Admin can review auth logs if a suspicious reset is suspected. Consider adding MFA as an optional Phase 7 feature for Admin accounts specifically.

### 4. Cloudflare as Single Point of Failure

**Risk:** The entire application runs on Cloudflare (Pages, Workers, D1). A Cloudflare outage takes down the app.

**Why accepted:** Cloudflare's SLA and global infrastructure make a full outage extremely unlikely. Multi-cloud redundancy would require significant architecture changes and cost.

**Mitigation:** Cloudflare Status page monitoring. The old PocketBase system is kept live for 2 weeks post-cutover as a temporary fallback.

### 5. No MFA

**Risk:** Compromised credentials give full account access.

**Why accepted:** Internal tool with a small team. Adding MFA would increase friction without proportionate security gain for the current threat model.

**Mitigation:** Strong password requirements enforced on reset (minimum 12 characters, checked against have-i-been-pwned API). Rate limiting on login prevents brute force. Revisit for Phase 7 if the team expands or the tool handles more sensitive data.

### 6. Rich Text Content in Docs Hub

**Risk:** Docs Hub renders rich text (Tiptap editor). Malformed content could attempt HTML injection.

**Why accepted:** Rich text editing is a core product requirement.

**Mitigation:** Tiptap's output is serialized as JSON (ProseMirror document format), not raw HTML. The renderer uses Tiptap's own HTML generator with a strict allowlist of permitted nodes and marks. `v-html` is not used for rendering doc content — Tiptap's Vue component handles rendering in a sandboxed way. Additionally, the CSP `script-src 'self'` prevents any injected scripts from executing.
