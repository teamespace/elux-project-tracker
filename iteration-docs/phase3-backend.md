# Phase 3 — Backend Implementation Prompt
> Run this in OpenCode to implement the full database + API layer for Elux Project Tracker.
> Stack: Nuxt 4 · Cloudflare D1 · Drizzle ORM · nuxt-auth-utils

---

## Context

The frontend (Phase 2) is complete with hardcoded dummy data. This phase wires it to a real D1 database via Nuxt server routes. All API calls go through `server/api/` — no direct DB access from the browser.

**Key naming rule:** The docs call them "Epics" but the frontend uses "Projects" (`app/pages/projects/`, IDs `p1`–`p8`). The database table is `projects`. Do not create an `epics` table.

**Existing files to keep:**
- `server/utils/db.ts` — already has `useDB()`, do not overwrite
- `drizzle.config.ts` — already configured for D1

---

## Step 1 — Drizzle Schema

**File:** `server/database/schema.ts`

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ─── Users ──────────────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // e.g. 'user-rasya'
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  initials: text('initials').notNull(),
  avatar: text('avatar'),
  role: text('role', { enum: ['admin', 'manager', 'member', 'intern'] }).notNull().default('member'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Goals ──────────────────────────────────────────────────────────────────

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(), // e.g. 'goal-1'
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  status: text('status', { enum: ['on-track', 'at-risk', 'delayed', 'not-started'] }).notNull().default('not-started'),
  statusLabel: text('status_label').notNull().default('NOT STARTED'),
  progress: integer('progress').notNull().default(0),
  ownerId: text('owner_id').references(() => users.id),
  quarter: text('quarter').notNull().default(''),
  dueDate: text('due_date').notNull().default(''),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const goalLabels = sqliteTable('goal_labels', {
  id: text('id').primaryKey(),
  goalId: text('goal_id').notNull().references(() => goals.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(),
})

// ─── KPIs ────────────────────────────────────────────────────────────────────

export const kpis = sqliteTable('kpis', {
  id: text('id').primaryKey(), // e.g. 'kpi-1'
  goalId: text('goal_id').notNull().references(() => goals.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  currentValue: text('current_value').notNull().default('0'),
  targetValue: text('target_value').notNull().default('0'),
  progress: integer('progress').notNull().default(0),
  status: text('status', { enum: ['on-track', 'at-risk', 'delayed', 'not-started'] }).notNull().default('not-started'),
  statusLabel: text('status_label').notNull().default('NOT STARTED'),
  ownerId: text('owner_id').references(() => users.id),
  dueDate: text('due_date').notNull().default(''),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Projects (= Epics in old docs) ─────────────────────────────────────────

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(), // e.g. 'p1'
  key: text('key').notNull(), // e.g. 'ALPHA'
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  status: text('status', { enum: ['on-track', 'at-risk', 'delayed', 'not-started'] }).notNull().default('not-started'),
  statusLabel: text('status_label').notNull().default('NOT STARTED'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
  priorityLabel: text('priority_label').notNull().default('Medium'),
  progress: integer('progress').notNull().default(0),
  openTasks: integer('open_tasks').notNull().default(0),
  atRiskTasks: integer('at_risk_tasks').notNull().default(0),
  doneT: integer('done_t').notNull().default(0),
  totalT: integer('total_t').notNull().default(0),
  dueDate: text('due_date').notNull().default(''),
  createdDate: text('created_date').notNull().default(sql`(date('now'))`),
  ownerId: text('owner_id').references(() => users.id),
  riskLevel: text('risk_level', { enum: ['low', 'medium', 'high'] }).notNull().default('low'),
  riskReason: text('risk_reason').notNull().default(''),
  riskOverriddenBy: text('risk_overridden_by').references(() => users.id),
  riskOverriddenAt: text('risk_overridden_at'),
  color: text('color').notNull().default('bg-blue-500'),
  category: text('category').notNull().default(''),
  labels: text('labels').notNull().default(''),
  attachCount: integer('attach_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

// Junction: goals ↔ projects
export const goalProjects = sqliteTable('goal_projects', {
  goalId: text('goal_id').notNull().references(() => goals.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  titleOverride: text('title_override'), // optional label shown in goals KPI linked list
  taskCount: integer('task_count').notNull().default(0),
})

// Junction: projects ↔ members (assignees)
export const projectMembers = sqliteTable('project_members', {
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  seed: text('seed').notNull(), // dicebear seed
  bg: text('bg').notNull(),    // hex bg color
})

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(), // e.g. 'task-1'
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  status: text('status', { enum: ['todo', 'in-progress', 'in-review', 'done', 'overdue'] }).notNull().default('todo'),
  statusLabel: text('status_label').notNull().default('To Do'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
  priorityLabel: text('priority_label').notNull().default('MED'),
  assigneeId: text('assignee_id').references(() => users.id),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  projectName: text('project_name').notNull().default(''),
  dueDate: text('due_date').notNull().default(''),
  dueType: text('due_type', { enum: ['today', 'week', 'overdue', 'none', 'all'] }).notNull().default('none'),
  progress: integer('progress').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  attachmentCount: integer('attachment_count').notNull().default(0),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

// Task labels (many per task)
export const taskLabels = sqliteTable('task_labels', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  color: text('color').notNull().default(''),
})

// ─── Subtasks ────────────────────────────────────────────────────────────────

export const subtasks = sqliteTable('subtasks', {
  id: text('id').primaryKey(), // e.g. 'st-1'
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  dueDate: text('due_date').notNull().default(''),
  assigneeName: text('assignee_name').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
})

// ─── Comments ────────────────────────────────────────────────────────────────

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  parentType: text('parent_type', { enum: ['task', 'project', 'goal'] }).notNull(),
  parentId: text('parent_id').notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Activity ─────────────────────────────────────────────────────────────────

export const activity = sqliteTable('activity', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').references(() => users.id),
  actorName: text('actor_name').notNull(),
  actorInitials: text('actor_initials').notNull(),
  actorAvatar: text('actor_avatar'),
  action: text('action').notNull(),
  target: text('target').notNull().default(''),
  entityType: text('entity_type', { enum: ['goal', 'project', 'task', 'subtask', 'comment', 'kpi'] }).notNull(),
  entityId: text('entity_id').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Critical Issues ─────────────────────────────────────────────────────────

export const criticalIssues = sqliteTable('critical_issues', {
  id: text('id').primaryKey(), // e.g. 'ci-1'
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  project: text('project').notNull().default(''),
  assigneeName: text('assignee_name').notNull().default('Unassigned'),
  priority: text('priority', { enum: ['High', 'Medium', 'Low'] }).notNull().default('High'),
  priorityLabel: text('priority_label').notNull().default('HIGH'),
  status: text('status', { enum: ['Overdue', 'At Risk', 'Not Started', 'Resolved'] }).notNull().default('At Risk'),
  statusLabel: text('status_label').notNull().default('At Risk'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Docs ─────────────────────────────────────────────────────────────────────

export const docs = sqliteTable('docs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull().default(''),
  goalId: text('goal_id').references(() => goals.id, { onDelete: 'set null' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  createdBy: text('created_by').notNull().references(() => users.id),
  labels: text('labels').notNull().default(''),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  actorId: text('actor_id').references(() => users.id),
  entityType: text('entity_type', { enum: ['task', 'project', 'goal', 'comment'] }).notNull(),
  entityId: text('entity_id').notNull(),
  action: text('action', { enum: ['assigned', 'commented', 'status_changed', 'mentioned', 'blocked', 'unblocked'] }).notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// ─── My Day ───────────────────────────────────────────────────────────────────

export const myDay = sqliteTable('my_day', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // ISO date '2026-06-25'
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Templates ─────────────────────────────────────────────────────────────────

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  entityType: text('entity_type', { enum: ['epic', 'task'] }).notNull(),
  payload: text('payload').notNull().default('{}'), // JSON: prefilled fields
  createdBy: text('created_by').notNull().references(() => users.id),
  isGlobal: integer('is_global', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

// ─── Task Dependencies ────────────────────────────────────────────────────────

export const taskDependencies = sqliteTable('task_dependencies', {
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  dependsOnTaskId: text('depends_on_task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
})

// ─── Time Entries ─────────────────────────────────────────────────────────────

export const timeEntries = sqliteTable('time_entries', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  hours: real('hours').notNull(),
  note: text('note').notNull().default(''),
  loggedDate: text('logged_date').notNull(), // ISO date
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})
```

---

## Step 2 — Auth Utils Session Type

**File:** `server/utils/auth.ts`

```typescript
declare module '#auth-utils' {
  interface User {
    id: string
    name: string
    initials: string
    avatar?: string
    role: 'admin' | 'manager' | 'member' | 'intern'
  }
  interface UserSession {
    user: User
  }
}

export {}
```

---

## Step 3 — Auth Middleware

**File:** `server/middleware/auth.ts`

```typescript
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Allow public routes
  if (
    url.pathname.startsWith('/api/auth/') ||
    url.pathname.startsWith('/_nuxt') ||
    url.pathname.startsWith('/__nuxt') ||
    !url.pathname.startsWith('/api/')
  ) return

  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Attach user to event.context for use in route handlers
  event.context.user = session.user
})
```

---

## Step 3b — Permissions & RBAC Helpers

**File:** `server/utils/permissions.ts`

```typescript
import type { H3Event } from 'h3'

type Role = 'admin' | 'manager' | 'member' | 'intern'

export function requireRole(event: H3Event, ...roles: Role[]) {
  const session = event.context.user
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!roles.includes(session.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }
}

export function requireAuth(event: H3Event) {
  const session = event.context.user
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  return session
}

export function requireOwnership(event: H3Event, ownerId: string) {
  const session = event.context.user
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (session.role === 'admin') return // Admin bypasses
  if (session.id !== ownerId) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }
}
```

---

## Step 3c — CSRF Middleware

**File:** `server/middleware/csrf.ts`

```typescript
export default defineEventHandler(async (event) => {
  if (event.method !== 'POST' && event.method !== 'PUT' &&
      event.method !== 'PATCH' && event.method !== 'DELETE') return

  // Dev mode: skip CSRF for local development convenience
  if (process.env.NODE_ENV === 'development') return

  // Auth routes don't need CSRF (no session yet)
  const url = getRequestURL(event)
  if (url.pathname === '/api/auth/login' || url.pathname === '/api/auth/logout') return

  const csrfHeader = getHeader(event, 'x-csrf-token')
  const csrfCookie = getCookie(event, 'csrf_token')

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    throw createError({ statusCode: 403, statusMessage: 'CSRF validation failed' })
  }
})
```

---

## Step 3d — Zod Validation Schemas

**File:** `server/utils/validation.ts`

```typescript
import { z } from 'zod'

export const createGoalSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  status: z.enum(['on-track', 'at-risk', 'delayed', 'not-started']).optional(),
  statusLabel: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  ownerId: z.string().optional(),
  quarter: z.string().optional(),
  dueDate: z.string().optional(),
})

export const updateGoalSchema = createGoalSchema.partial()

export const createProjectSchema = z.object({
  key: z.string().min(1).max(10).optional(),
  name: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  status: z.enum(['on-track', 'at-risk', 'delayed', 'not-started']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  ownerId: z.string().optional(),
  dueDate: z.string().optional(),
  color: z.string().optional(),
  category: z.string().optional(),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  riskReason: z.string().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  status: z.enum(['todo', 'in-progress', 'in-review', 'done', 'overdue']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  dueDate: z.string().optional(),
  dueType: z.enum(['today', 'week', 'overdue', 'none', 'all']).optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const createCommentSchema = z.object({
  parentType: z.enum(['task', 'project', 'goal']),
  parentId: z.string(),
  text: z.string().min(1).max(5000),
})

export const createDocSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  goalId: z.string().optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  labels: z.string().optional(),
  isPublic: z.boolean().optional(),
})

export const updateDocSchema = createDocSchema.partial()

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  entityType: z.enum(['epic', 'task']),
  payload: z.string().optional(), // JSON string
  isGlobal: z.boolean().optional(),
})

export const createTimeEntrySchema = z.object({
  taskId: z.string(),
  hours: z.number().min(0.1).max(168),
  note: z.string().max(500).optional(),
  loggedDate: z.string(), // ISO date
})

export const addDependencySchema = z.object({
  dependsOnTaskId: z.string(),
})

export const addMyDaySchema = z.object({
  taskId: z.string(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
})
```

---

## Step 3e — Activity Logging Helper

**File:** `server/utils/activity.ts`

```typescript
import { useDB } from './db'
import { activity } from '../database/schema'
import type { H3Event } from 'h3'

type EntityType = 'goal' | 'project' | 'task' | 'subtask' | 'comment' | 'kpi'

export async function logActivity(
  event: H3Event,
  action: string,
  entityType: EntityType,
  entityId: string,
  target: string = '',
) {
  const session = event.context.user
  const db = useDB()

  await db.insert(activity).values({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actorId: session?.id ?? null,
    actorName: session?.name ?? 'Unknown',
    actorInitials: session?.initials ?? '?',
    actorAvatar: session?.avatar ?? null,
    action,
    target,
    entityType,
    entityId,
  })
}
```

---

## Step 3f — Pagination Helper

**File:** `server/utils/pagination.ts`

```typescript
import type { H3Event } from 'h3'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function getPagination(event: H3Event): { page: number; limit: number; offset: number } {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

export function wrapPaginated<T>(data: T[], meta: PaginationMeta) {
  return { data, meta }
}
```

---

## Step 4 — Auth API Routes

**File:** `server/api/auth/login.post.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const db = useDB()
  const user = await db.select().from(users).where(eq(users.email, email)).get()

  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  // For now compare plain — swap for bcrypt when you add password hashing
  // In dev seed, passwords are stored as plain text prefixed with "plain:"
  const storedPass = user.passwordHash
  const valid = storedPass.startsWith('plain:')
    ? storedPass.slice(6) === password
    : storedPass === password

  if (!valid) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      initials: user.initials,
      avatar: user.avatar ?? undefined,
      role: user.role as 'admin' | 'manager' | 'member' | 'intern',
    },
  })

  return { ok: true }
})
```

**File:** `server/api/auth/logout.post.ts`

```typescript
export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return { ok: true }
})
```

**File:** `server/api/auth/me.get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  return session.user
})
```

---

## Step 5 — Goals API

**File:** `server/api/goals/index.get.ts`

```typescript
import { useDB } from '../../utils/db'
import { goals, goalLabels, kpis, goalProjects, users, projects } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const db = useDB()

  const allGoals = await db.select().from(goals).all()

  const result = await Promise.all(allGoals.map(async (goal) => {
    const owner = goal.ownerId
      ? await db.select().from(users).where(eq(users.id, goal.ownerId)).get()
      : null

    const labels = await db.select().from(goalLabels).where(eq(goalLabels.goalId, goal.id)).all()
    const kpiList = await db.select().from(kpis).where(eq(kpis.goalId, goal.id)).all()
    const gps = await db.select().from(goalProjects).where(eq(goalProjects.goalId, goal.id)).all()

    const linkedProjectsList = await Promise.all(gps.map(async (gp) => {
      const proj = await db.select().from(projects).where(eq(projects.id, gp.projectId)).get()
      if (!proj) return null
      return {
        id: gp.projectId,
        title: gp.titleOverride ?? proj.name,
        project: proj.name,
        status: proj.status,
        statusLabel: proj.statusLabel,
        progress: proj.progress,
        taskCount: gp.taskCount,
      }
    }))

    return {
      ...goal,
      owner: owner ? { initials: owner.initials, name: owner.name, avatar: owner.avatar } : null,
      labels: labels.map(l => ({ id: l.id, name: l.name, color: l.color })),
      kpis: await Promise.all(kpiList.map(async (k) => {
        const kOwner = k.ownerId
          ? await db.select().from(users).where(eq(users.id, k.ownerId)).get()
          : null
        return {
          ...k,
          owner: kOwner ? { initials: kOwner.initials, name: kOwner.name, avatar: kOwner.avatar } : null,
        }
      })),
      linkedProjects: linkedProjectsList.filter(Boolean),
      activity: [], // load lazily on detail page if needed
    }
  }))

  return result
})
```

**File:** `server/api/goals/index.post.ts`

```typescript
import { useDB } from '../../utils/db'
import { goals } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createGoalSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const result = createGoalSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `goal-${Date.now()}`
  await db.insert(goals).values({
    id,
    title: body.title,
    description: body.description ?? '',
    status: body.status ?? 'not-started',
    statusLabel: body.statusLabel ?? 'NOT STARTED',
    progress: body.progress ?? 0,
    ownerId: body.ownerId ?? null,
    quarter: body.quarter ?? '',
    dueDate: body.dueDate ?? '',
  })

  await logActivity(event, 'created goal', 'goal', id, body.title)

  return { id }
})
```

**File:** `server/api/goals/[id].get.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { goals, goalLabels, kpis, goalProjects, users, projects, activity } from '../../../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const goal = await db.select().from(goals).where(eq(goals.id, id)).get()
  if (!goal) throw createError({ statusCode: 404, statusMessage: 'Goal not found' })

  const owner = goal.ownerId
    ? await db.select().from(users).where(eq(users.id, goal.ownerId)).get()
    : null

  const labels = await db.select().from(goalLabels).where(eq(goalLabels.goalId, id)).all()

  const kpiList = await db.select().from(kpis).where(eq(kpis.goalId, id)).all()
  const enrichedKpis = await Promise.all(kpiList.map(async (k) => {
    const kOwner = k.ownerId
      ? await db.select().from(users).where(eq(users.id, k.ownerId)).get()
      : null
    return { ...k, owner: kOwner ? { initials: kOwner.initials, name: kOwner.name, avatar: kOwner.avatar } : null }
  }))

  const gps = await db.select().from(goalProjects).where(eq(goalProjects.goalId, id)).all()
  const linkedProjectsList = await Promise.all(gps.map(async (gp) => {
    const proj = await db.select().from(projects).where(eq(projects.id, gp.projectId)).get()
    if (!proj) return null
    return {
      id: gp.projectId,
      title: gp.titleOverride ?? proj.name,
      project: proj.name,
      status: proj.status,
      statusLabel: proj.statusLabel,
      progress: proj.progress,
      taskCount: gp.taskCount,
    }
  }))

  const activityList = await db.select().from(activity)
    .where(eq(activity.entityId, id))
    .orderBy(desc(activity.createdAt))
    .limit(20)
    .all()

  return {
    ...goal,
    owner: owner ? { initials: owner.initials, name: owner.name, avatar: owner.avatar } : null,
    labels: labels.map(l => ({ id: l.id, name: l.name, color: l.color })),
    kpis: enrichedKpis,
    linkedProjects: linkedProjectsList.filter(Boolean),
    activity: activityList.map(a => ({
      id: a.id,
      actor: { initials: a.actorInitials, name: a.actorName, avatar: a.actorAvatar },
      action: a.action,
      target: a.target,
      time: a.createdAt,
    })),
  }
})
```

**File:** `server/api/goals/[id].put.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { goals } from '../../../database/schema'
import { sql } from 'drizzle-orm'
import { requireRole } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'
import { updateGoalSchema } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const id = getRouterParam(event, 'id')!
  const result = updateGoalSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  await db.update(goals)
    .set({ ...body, updatedAt: sql`(datetime('now'))` })
    .where(eq(goals.id, id))

  await logActivity(event, 'updated goal', 'goal', id, body.title ?? '')

  return { ok: true }
})
```

**File:** `server/api/goals/[id].delete.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { goals } from '../../../database/schema'
import { requireRole } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const goal = await db.select().from(goals).where(eq(goals.id, id)).get()
  if (!goal) throw createError({ statusCode: 404, statusMessage: 'Goal not found' })

  await db.delete(goals).where(eq(goals.id, id))
  await logActivity(event, 'deleted goal', 'goal', id, goal.title)

  return { ok: true }
})
```

---

## Step 6 — Projects API

**File:** `server/api/projects/index.get.ts`

```typescript
import { useDB } from '../../utils/db'
import { projects, projectMembers, users } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const db = useDB()

  const allProjects = await db.select().from(projects).all()

  return Promise.all(allProjects.map(async (proj) => {
    const members = await db.select().from(projectMembers).where(eq(projectMembers.projectId, proj.id)).all()
    return {
      ...proj,
      assignees: members.map(m => ({ seed: m.seed, bg: m.bg, name: m.seed })),
    }
  }))
})
```

**File:** `server/api/projects/index.post.ts`

```typescript
import { useDB } from '../../utils/db'
import { projects } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createProjectSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const result = createProjectSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `p-${Date.now()}`
  await db.insert(projects).values({
    id,
    key: body.key ?? id.toUpperCase(),
    name: body.name,
    description: body.description ?? '',
    status: body.status ?? 'not-started',
    statusLabel: body.statusLabel ?? 'NOT STARTED',
    priority: body.priority ?? 'medium',
    priorityLabel: body.priorityLabel ?? 'Medium',
    progress: 0,
    openTasks: 0,
    atRiskTasks: 0,
    doneT: 0,
    totalT: 0,
    dueDate: body.dueDate ?? '',
    ownerId: body.ownerId ?? null,
    color: body.color ?? 'bg-blue-500',
    category: body.category ?? '',
    labels: body.labels ?? '',
    riskLevel: body.riskLevel ?? 'low',
    riskReason: body.riskReason ?? '',
  })

  await logActivity(event, 'created project', 'project', id, body.name)

  return { id }
})
```

**File:** `server/api/projects/[id].get.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { projects, projectMembers, tasks, subtasks, comments, users, activity } from '../../../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const proj = await db.select().from(projects).where(eq(projects.id, id)).get()
  if (!proj) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const owner = proj.ownerId
    ? await db.select().from(users).where(eq(users.id, proj.ownerId)).get()
    : null

  const members = await db.select().from(projectMembers).where(eq(projectMembers.projectId, id)).all()

  const taskList = await db.select().from(tasks).where(eq(tasks.projectId, id)).all()
  const enrichedTasks = await Promise.all(taskList.map(async (t) => {
    const subs = await db.select().from(subtasks).where(eq(subtasks.taskId, t.id)).all()
    return { ...t, subtasks: subs }
  }))

  const commentList = await db.select().from(comments)
    .where(eq(comments.parentId, id))
    .orderBy(desc(comments.createdAt))
    .all()
  const enrichedComments = await Promise.all(commentList.map(async (c) => {
    const author = await db.select().from(users).where(eq(users.id, c.authorId)).get()
    return {
      ...c,
      author: author ? { initials: author.initials, name: author.name, avatar: author.avatar } : null,
    }
  }))

  const activityList = await db.select().from(activity)
    .where(eq(activity.entityId, id))
    .orderBy(desc(activity.createdAt))
    .limit(20)
    .all()

  return {
    ...proj,
    owner: owner ? { initials: owner.initials, name: owner.name, avatar: owner.avatar } : null,
    assignees: members.map(m => ({ seed: m.seed, bg: m.bg, name: m.seed })),
    childTasks: enrichedTasks,
    comments: enrichedComments,
    activities: activityList.map(a => ({
      id: a.id,
      actor: { initials: a.actorInitials, name: a.actorName, avatar: a.actorAvatar },
      text: a.action,
      time: a.createdAt,
    })),
  }
})
```

**File:** `server/api/projects/[id].put.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { projects } from '../../../database/schema'
import { sql } from 'drizzle-orm'
import { requireRole } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'
import { updateProjectSchema } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const id = getRouterParam(event, 'id')!
  const result = updateProjectSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  await db.update(projects)
    .set({ ...body, updatedAt: sql`(datetime('now'))` })
    .where(eq(projects.id, id))

  await logActivity(event, 'updated project', 'project', id, body.name ?? '')

  return { ok: true }
})
```

**File:** `server/api/projects/[id].delete.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { projects } from '../../../database/schema'
import { requireRole } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const proj = await db.select().from(projects).where(eq(projects.id, id)).get()
  if (!proj) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  await db.delete(projects).where(eq(projects.id, id))
  await logActivity(event, 'deleted project', 'project', id, proj.name)

  return { ok: true }
})
```

---

## Step 7 — Tasks API

**File:** `server/api/tasks/index.get.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { tasks, taskLabels, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  let allTasks = await db.select().from(tasks).all()

  // Filter by project
  if (query.projectId) {
    allTasks = allTasks.filter(t => t.projectId === query.projectId)
  }
  // Filter by assignee
  if (query.assigneeId) {
    allTasks = allTasks.filter(t => t.assigneeId === query.assigneeId)
  }
  // Filter by status
  if (query.status) {
    allTasks = allTasks.filter(t => t.status === query.status)
  }

  return Promise.all(allTasks.map(async (t) => {
    const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, t.id)).all()
    const assignee = t.assigneeId
      ? await db.select().from(users).where(eq(users.id, t.assigneeId)).get()
      : null
    return {
      ...t,
      labels: labels.map(l => ({ text: l.text, color: l.color })),
      assignee: assignee ? { id: assignee.id, initials: assignee.initials, name: assignee.name, avatar: assignee.avatar } : null,
    }
  }))
})
```

**File:** `server/api/tasks/index.post.ts`

```typescript
import { useDB } from '../../utils/db'
import { tasks } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createTaskSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager', 'member')

  const result = createTaskSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `task-${Date.now()}`
  await db.insert(tasks).values({
    id,
    title: body.title,
    description: body.description ?? '',
    status: body.status ?? 'todo',
    statusLabel: body.statusLabel ?? 'To Do',
    priority: body.priority ?? 'medium',
    priorityLabel: body.priorityLabel ?? 'MED',
    assigneeId: body.assigneeId ?? null,
    projectId: body.projectId ?? null,
    projectName: body.projectName ?? '',
    dueDate: body.dueDate ?? '',
    dueType: body.dueType ?? 'none',
    progress: 0,
  })

  await logActivity(event, 'created task', 'task', id, body.title)

  return { id }
})
```

**File:** `server/api/tasks/[id].get.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { tasks, subtasks, taskLabels, comments, users } from '../../../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const task = await db.select().from(tasks).where(eq(tasks.id, id)).get()
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

  const subs = await db.select().from(subtasks).where(eq(subtasks.taskId, id)).all()
  const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, id)).all()
  const commentList = await db.select().from(comments)
    .where(eq(comments.parentId, id))
    .orderBy(desc(comments.createdAt))
    .all()
  const enrichedComments = await Promise.all(commentList.map(async (c) => {
    const author = await db.select().from(users).where(eq(users.id, c.authorId)).get()
    return { ...c, author: author ? { initials: author.initials, name: author.name, avatar: author.avatar } : null }
  }))

  return {
    ...task,
    subtasks: subs,
    labels: labels.map(l => ({ text: l.text, color: l.color })),
    comments: enrichedComments,
  }
})
```

**File:** `server/api/tasks/[id].put.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { tasks } from '../../../database/schema'
import { sql } from 'drizzle-orm'
import { requireAuth } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'
import { updateTaskSchema } from '../../../utils/validation'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const result = updateTaskSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  // Members can only edit own tasks
  if (user.role === 'member') {
    const task = await db.select().from(tasks).where(eq(tasks.id, id)).get()
    if (task && task.assigneeId !== user.id) {
      throw createError({ statusCode: 403, statusMessage: 'You can only edit your own tasks' })
    }
  }

  await db.update(tasks)
    .set({ ...body, updatedAt: sql`(datetime('now'))` })
    .where(eq(tasks.id, id))

  await logActivity(event, 'updated task', 'task', id, body.title ?? '')

  return { ok: true }
})
```

**File:** `server/api/tasks/[id].delete.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { tasks } from '../../../database/schema'
import { requireAuth } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const task = await db.select().from(tasks).where(eq(tasks.id, id)).get()
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

  // Only admin/manager can delete any task; member can delete own tasks
  if (user.role !== 'admin' && user.role !== 'manager' && task.assigneeId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await db.delete(tasks).where(eq(tasks.id, id))
  await logActivity(event, 'deleted task', 'task', id, task.title)

  return { ok: true }
})
```

---

## Step 8 — Subtasks API

**File:** `server/api/subtasks/[id].put.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { subtasks } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = useDB()

  await db.update(subtasks).set(body).where(eq(subtasks.id, id))
  return { ok: true }
})
```

**File:** `server/api/subtasks/[id].delete.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { subtasks } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()
  await db.delete(subtasks).where(eq(subtasks.id, id))
  return { ok: true }
})
```

---

## Step 9 — Users API

**File:** `server/api/users/index.get.ts`

```typescript
import { useDB } from '../../utils/db'
import { users } from '../../database/schema'

export default defineEventHandler(async (_event) => {
  const db = useDB()
  const all = await db.select({
    id: users.id,
    name: users.name,
    initials: users.initials,
    avatar: users.avatar,
    role: users.role,
    email: users.email,
  }).from(users).all()
  return all
})
```

---

## Step 10 — Dashboard Aggregate API

**File:** `server/api/dashboard.get.ts`

```typescript
import { useDB, eq } from '../utils/db'
import { tasks, projects, criticalIssues, activity } from '../database/schema'
import { desc, and } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const db = useDB()

  const allTasks = await db.select().from(tasks).all()
  const allProjects = await db.select().from(projects).all()
  const issues = await db.select().from(criticalIssues).all()
  const feed = await db.select().from(activity)
    .orderBy(desc(activity.createdAt))
    .limit(10)
    .all()

  const total = allTasks.length
  const done = allTasks.filter(t => t.done).length
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length
  const overdue = allTasks.filter(t => t.dueType === 'overdue' && !t.done).length
  const atRisk = allProjects.filter(p => p.status === 'at-risk').length

  return {
    stats: { total, done, inProgress, overdue, atRisk, totalProjects: allProjects.length },
    criticalIssues: issues,
    activity: feed,
  }
})
```

---

## Step 11 — My Work API

**File:** `server/api/my-work.get.ts`

```typescript
import { useDB, eq } from '../utils/db'
import { tasks, taskLabels } from '../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  const myTasks = await db.select().from(tasks).where(eq(tasks.assigneeId, userId)).all()

  return Promise.all(myTasks.map(async (t) => {
    const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, t.id)).all()
    return { ...t, labels: labels.map(l => ({ text: l.text, color: l.color })) }
  }))
})
```

---

## Step 12 — Team Workload API

**File:** `server/api/team.get.ts`

```typescript
import { useDB, eq } from '../utils/db'
import { users, tasks } from '../database/schema'

export default defineEventHandler(async (_event) => {
  const db = useDB()
  const allUsers = await db.select().from(users).all()
  const allTasks = await db.select().from(tasks).all()

  return allUsers.map(user => {
    const mine = allTasks.filter(t => t.assigneeId === user.id)
    return {
      id: user.id,
      name: user.name,
      initials: user.initials,
      avatar: user.avatar,
      role: user.role,
      todo: mine.filter(t => t.status === 'todo').length,
      inProgress: mine.filter(t => t.status === 'in-progress').length,
      inReview: mine.filter(t => t.status === 'in-review').length,
      done: mine.filter(t => t.done).length,
      total: mine.length,
    }
  })
})
```

---

## Step 13 — Search API

**File:** `server/api/search.get.ts`

```typescript
import { useDB, like } from '../utils/db'
import { tasks, projects, goals } from '../database/schema'
import { or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event) as { q: string }
  if (!q || q.length < 2) return { tasks: [], projects: [], goals: [] }

  const db = useDB()
  const pattern = `%${q}%`

  const [matchedTasks, matchedProjects, matchedGoals] = await Promise.all([
    db.select().from(tasks).where(like(tasks.title, pattern)).limit(5).all(),
    db.select().from(projects).where(like(projects.name, pattern)).limit(5).all(),
    db.select().from(goals).where(like(goals.title, pattern)).limit(5).all(),
  ])

  return { tasks: matchedTasks, projects: matchedProjects, goals: matchedGoals }
})
```

---

## Step 14 — Critical Issues API

**File:** `server/api/critical-issues.get.ts`

```typescript
import { useDB } from '../utils/db'
import { criticalIssues } from '../database/schema'

export default defineEventHandler(async (_event) => {
  const db = useDB()
  return db.select().from(criticalIssues).all()
})
```

---

## Step 15 — Activity API

**File:** `server/api/activity.get.ts`

```typescript
import { useDB } from '../utils/db'
import { activity } from '../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  const feed = await db.select().from(activity)
    .orderBy(desc(activity.createdAt))
    .limit(Number(query.limit ?? 20))
    .all()

  return feed
})
```

---

## Step 15b — Docs API

**File:** `server/api/docs/index.get.ts`

```typescript
import { useDB } from '../utils/db'
import { docs, users } from '../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  let allDocs = await db.select().from(docs).all()

  if (query.projectId) allDocs = allDocs.filter(d => d.projectId === query.projectId)
  if (query.goalId) allDocs = allDocs.filter(d => d.goalId === query.goalId)

  return Promise.all(allDocs.map(async (d) => {
    const author = await db.select().from(users).where(eq(users.id, d.createdBy)).get()
    return {
      ...d,
      author: author ? { id: author.id, initials: author.initials, name: author.name, avatar: author.avatar } : null,
    }
  }))
})
```

**File:** `server/api/docs/index.post.ts`

```typescript
import { useDB } from '../utils/db'
import { docs } from '../database/schema'
import { requireAuth } from '../utils/permissions'
import { logActivity } from '../utils/activity'
import { createDocSchema } from '../utils/validation'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const result = createDocSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `doc-${Date.now()}`
  await db.insert(docs).values({
    id,
    title: body.title,
    content: body.content ?? '',
    goalId: body.goalId ?? null,
    projectId: body.projectId ?? null,
    taskId: body.taskId ?? null,
    createdBy: user.id,
    labels: body.labels ?? '',
    isPublic: body.isPublic ?? false,
  })

  await logActivity(event, 'created doc', 'project', id, body.title)

  return { id }
})
```

**File:** `server/api/docs/[id].get.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { docs, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const doc = await db.select().from(docs).where(eq(docs.id, id)).get()
  if (!doc) throw createError({ statusCode: 404, statusMessage: 'Doc not found' })

  const author = await db.select().from(users).where(eq(users.id, doc.createdBy)).get()

  return {
    ...doc,
    author: author ? { id: author.id, initials: author.initials, name: author.name, avatar: author.avatar } : null,
  }
})
```

**File:** `server/api/docs/[id].put.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { docs } from '../../database/schema'
import { sql } from 'drizzle-orm'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { updateDocSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const result = updateDocSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  await db.update(docs)
    .set({ ...body, updatedAt: sql`(datetime('now'))` })
    .where(eq(docs.id, id))

  await logActivity(event, 'updated doc', 'project', id, body.title ?? '')

  return { ok: true }
})
```

**File:** `server/api/docs/[id].delete.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { docs } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const doc = await db.select().from(docs).where(eq(docs.id, id)).get()
  if (!doc) throw createError({ statusCode: 404, statusMessage: 'Doc not found' })

  await db.delete(docs).where(eq(docs.id, id))
  await logActivity(event, 'deleted doc', 'project', id, doc.title)

  return { ok: true }
})
```

---

## Step 15c — Notifications API

**File:** `server/api/notifications.get.ts`

```typescript
import { useDB, eq } from '../utils/db'
import { notifications, users } from '../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  const all = await db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
    .all()

  return Promise.all(all.map(async (n) => {
    const actor = n.actorId
      ? await db.select().from(users).where(eq(users.id, n.actorId)).get()
      : null
    return {
      ...n,
      actor: actor ? { initials: actor.initials, name: actor.name, avatar: actor.avatar } : null,
    }
  }))
})
```

**File:** `server/api/notifications/[id]/read.patch.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { notifications } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id))
  return { ok: true }
})
```

**File:** `server/api/notifications/read-all.patch.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { notifications } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId))

  return { ok: true }
})
```

---

## Step 15d — My Day API

**File:** `server/api/my-day.get.ts`

```typescript
import { useDB, eq, and } from '../utils/db'
import { myDay, tasks, taskLabels } from '../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const date = (getQuery(event).date as string) ?? new Date().toISOString().slice(0, 10)
  const db = useDB()

  const entries = await db.select().from(myDay)
    .where(and(eq(myDay.userId, userId), eq(myDay.date, date)))
    .all()

  const taskIds = entries.map(e => e.taskId)
  if (taskIds.length === 0) return []

  const taskResults = await db.select().from(tasks).all()
  const myTasks = taskResults.filter(t => taskIds.includes(t.id))

  return Promise.all(myTasks.map(async (t) => {
    const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, t.id)).all()
    return { ...t, labels: labels.map(l => ({ text: l.text, color: l.color })) }
  }))
})
```

**File:** `server/api/my-day.post.ts`

```typescript
import { useDB, eq, and } from '../utils/db'
import { myDay } from '../database/schema'
import { addMyDaySchema } from '../utils/validation'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const result = addMyDaySchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const { taskId } = result.data
  const date = new Date().toISOString().slice(0, 10)
  const db = useDB()

  // Check if already exists
  const existing = await db.select().from(myDay)
    .where(and(eq(myDay.userId, userId), eq(myDay.taskId, taskId), eq(myDay.date, date)))
    .get()

  if (existing) return { ok: true, id: existing.id }

  const id = `md-${Date.now()}`
  await db.insert(myDay).values({ id, userId, taskId, date })

  return { id, ok: true }
})
```

**File:** `server/api/my-day/[id].delete.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { myDay } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const entry = await db.select().from(myDay).where(eq(myDay.id, id)).get()
  if (!entry || entry.userId !== userId) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  await db.delete(myDay).where(eq(myDay.id, id))
  return { ok: true }
})
```

---

## Step 15e — Templates API

**File:** `server/api/templates/index.get.ts`

```typescript
import { useDB, eq, or } from '../utils/db'
import { templates } from '../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  // Return global templates + user's own
  return db.select().from(templates)
    .where(or(eq(templates.isGlobal, true), eq(templates.createdBy, userId)))
    .all()
})
```

**File:** `server/api/templates/index.post.ts`

```typescript
import { useDB } from '../utils/db'
import { templates } from '../database/schema'
import { requireRole } from '../utils/permissions'
import { logActivity } from '../utils/activity'
import { createTemplateSchema } from '../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')
  const user = event.context.user

  const result = createTemplateSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `tpl-${Date.now()}`
  await db.insert(templates).values({
    id,
    name: body.name,
    description: body.description ?? '',
    entityType: body.entityType,
    payload: body.payload ?? '{}',
    createdBy: user.id,
    isGlobal: body.isGlobal ?? false,
  })

  await logActivity(event, 'created template', 'project', id, body.name)

  return { id }
})
```

**File:** `server/api/templates/[id].delete.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { templates } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const tpl = await db.select().from(templates).where(eq(templates.id, id)).get()
  if (!tpl) throw createError({ statusCode: 404, statusMessage: 'Template not found' })

  if (user.role !== 'admin' && tpl.createdBy !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await db.delete(templates).where(eq(templates.id, id))
  await logActivity(event, 'deleted template', 'project', id, tpl.name)

  return { ok: true }
})
```

**File:** `server/api/templates/[id]/apply.post.ts`

```typescript
import { useDB, eq } from '../../../utils/db'
import { templates, tasks, projects } from '../../../database/schema'
import { requireRole } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')
  const user = event.context.user

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const tpl = await db.select().from(templates).where(eq(templates.id, id)).get()
  if (!tpl) throw createError({ statusCode: 404, statusMessage: 'Template not found' })

  const payload = JSON.parse(tpl.payload)
  const body = await readBody(event)

  if (tpl.entityType === 'task') {
    const taskId = `task-${Date.now()}`
    await db.insert(tasks).values({
      id: taskId,
      title: `${tpl.name} - ${body.title ?? ''}`,
      description: payload.description ?? '',
      status: 'todo',
      statusLabel: 'To Do',
      priority: payload.priority ?? 'medium',
      priorityLabel: payload.priority ?? 'MED',
      assigneeId: body.assigneeId ?? null,
      projectId: body.projectId ?? null,
      projectName: body.projectName ?? '',
      dueDate: body.dueDate ?? '',
    })
    await logActivity(event, 'created task from template', 'task', taskId, tpl.name)
    return { taskId }
  }

  if (tpl.entityType === 'epic') {
    const projId = `p-${Date.now()}`
    await db.insert(projects).values({
      id: projId,
      key: (payload.key ?? '').toUpperCase(),
      name: payload.name ?? tpl.name,
      description: payload.description ?? '',
      status: 'not-started',
      statusLabel: 'NOT STARTED',
      ownerId: user.id,
    })
    await logActivity(event, 'created project from template', 'project', projId, tpl.name)
    return { projectId: projId }
  }

  return { ok: true }
})
```

---

## Step 15f — Task Dependencies API

**File:** `server/api/tasks/[id]/dependencies.get.ts`

```typescript
import { useDB, eq, or } from '../../../utils/db'
import { taskDependencies, tasks } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const deps = await db.select().from(taskDependencies)
    .where(or(eq(taskDependencies.taskId, id), eq(taskDependencies.dependsOnTaskId, id)))
    .all()

  const taskIds = [...new Set(deps.flatMap(d => [d.taskId, d.dependsOnTaskId]))]
  const allTasks = await db.select().from(tasks).all()
  const taskMap = Object.fromEntries(allTasks.map(t => [t.id, t]))

  const blockedBy = deps.filter(d => d.taskId === id).map(d => ({
    id: d.dependsOnTaskId,
    title: taskMap[d.dependsOnTaskId]?.title ?? '[Unknown]',
    status: taskMap[d.dependsOnTaskId]?.status ?? 'unknown',
  }))

  const blocks = deps.filter(d => d.dependsOnTaskId === id).map(d => ({
    id: d.taskId,
    title: taskMap[d.taskId]?.title ?? '[Unknown]',
    status: taskMap[d.taskId]?.status ?? 'unknown',
  }))

  return { blockedBy, blocks }
})
```

**File:** `server/api/tasks/[id]/dependencies.post.ts`

```typescript
import { useDB, eq, and } from '../../../utils/db'
import { taskDependencies } from '../../../database/schema'
import { requireRole } from '../../../utils/permissions'
import { addDependencySchema } from '../../../utils/validation'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const taskId = getRouterParam(event, 'id')!
  const result = addDependencySchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const { dependsOnTaskId } = result.data
  if (taskId === dependsOnTaskId) {
    throw createError({ statusCode: 400, statusMessage: 'A task cannot depend on itself' })
  }

  const db = useDB()

  // Circular dependency check
  const allDeps = await db.select().from(taskDependencies).all()
  const graph = new Map<string, string[]>()
  for (const d of allDeps) {
    if (!graph.has(d.taskId)) graph.set(d.taskId, [])
    graph.get(d.taskId)!.push(d.dependsOnTaskId)
  }
  if (!graph.has(taskId)) graph.set(taskId, [])
  graph.get(taskId)!.push(dependsOnTaskId)

  function hasCycle(node: string, visited = new Set<string>(), stack = new Set<string>()): boolean {
    if (stack.has(node)) return true
    if (visited.has(node)) return false
    visited.add(node)
    stack.add(node)
    for (const neighbor of graph.get(node) ?? []) {
      if (hasCycle(neighbor, visited, stack)) return true
    }
    stack.delete(node)
    return false
  }

  if (hasCycle(taskId)) {
    throw createError({ statusCode: 400, statusMessage: 'Circular dependency detected' })
  }

  await db.insert(taskDependencies).values({ taskId, dependsOnTaskId })
  await logActivity(event, 'added dependency', 'task', taskId)

  return { ok: true }
})
```

**File:** `server/api/tasks/[id]/dependencies/[depId].delete.ts`

```typescript
import { useDB, eq, and } from '../../../../utils/db'
import { taskDependencies } from '../../../../database/schema'
import { requireRole } from '../../../../utils/permissions'
import { logActivity } from '../../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const taskId = getRouterParam(event, 'id')!
  const depId = getRouterParam(event, 'depId')!
  const db = useDB()

  await db.delete(taskDependencies)
    .where(and(eq(taskDependencies.taskId, taskId), eq(taskDependencies.dependsOnTaskId, depId)))

  await logActivity(event, 'removed dependency', 'task', taskId)

  return { ok: true }
})
```

---

## Step 15g — Time Entries API

**File:** `server/api/time/index.get.ts`

```typescript
import { useDB, eq } from '../utils/db'
import { timeEntries, users } from '../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  let entries = await db.select().from(timeEntries)
    .orderBy(desc(timeEntries.createdAt))
    .all()

  if (query.taskId) entries = entries.filter(e => e.taskId === query.taskId)
  if (query.userId) entries = entries.filter(e => e.userId === query.userId)

  return Promise.all(entries.map(async (e) => {
    const user = await db.select().from(users).where(eq(users.id, e.userId)).get()
    return {
      ...e,
      user: user ? { initials: user.initials, name: user.name, avatar: user.avatar } : null,
    }
  }))
})
```

**File:** `server/api/time/index.post.ts`

```typescript
import { useDB } from '../utils/db'
import { timeEntries } from '../database/schema'
import { requireAuth } from '../utils/permissions'
import { logActivity } from '../utils/activity'
import { createTimeEntrySchema } from '../utils/validation'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const result = createTimeEntrySchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `te-${Date.now()}`
  await db.insert(timeEntries).values({
    id,
    taskId: body.taskId,
    userId: user.id,
    hours: body.hours,
    note: body.note ?? '',
    loggedDate: body.loggedDate,
  })

  await logActivity(event, 'logged time', 'task', body.taskId, `${body.hours}h`)

  return { id }
})
```

**File:** `server/api/time/[id].delete.ts`

```typescript
import { useDB, eq } from '../../utils/db'
import { timeEntries } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const entry = await db.select().from(timeEntries).where(eq(timeEntries.id, id)).get()
  if (!entry) throw createError({ statusCode: 404, statusMessage: 'Time entry not found' })

  // Only the owner or admin can delete
  if (user.role !== 'admin' && entry.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await db.delete(timeEntries).where(eq(timeEntries.id, id))
  await logActivity(event, 'deleted time entry', 'task', entry.taskId)

  return { ok: true }
})
```

---

## Step 16 — Seed File

**File:** `server/database/seed.ts`

```typescript
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// Run with: npx wrangler d1 execute elux-tracker --local --file=./server/database/seed.sql
// Or use this script via: npx tsx server/database/seed.ts (local D1 via wrangler binding)

export async function seed(db: ReturnType<typeof drizzle>) {
  // ── Users ──────────────────────────────────────────────────────────────────
  await db.delete(schema.users)
  await db.insert(schema.users).values([
    {
      id: 'user-rasya',
      email: 'rasya@queebo.chat',
      passwordHash: 'plain:rasya123',
      name: 'Rasya',
      initials: 'R',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya',
      role: 'admin',
    },
    {
      id: 'user-dito',
      email: 'dito@elux.id',
      passwordHash: 'plain:dito123',
      name: 'Dito',
      initials: 'D',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito',
      role: 'member',
    },
    {
      id: 'user-maya',
      email: 'maya@elux.id',
      passwordHash: 'plain:maya123',
      name: 'Maya',
      initials: 'M',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya',
      role: 'member',
    },
    {
      id: 'user-rara',
      email: 'rara@elux.id',
      passwordHash: 'plain:rara123',
      name: 'Rara',
      initials: 'Ra',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara',
      role: 'member',
    },
  ])

  // ── Goals ──────────────────────────────────────────────────────────────────
  await db.delete(schema.goals)
  await db.insert(schema.goals).values([
    { id: 'goal-1', title: 'Q3 Ship Product Redesign', description: 'Deliver a complete redesign of the core product experience to improve user engagement, reduce churn, and modernize the visual language across all key user journeys.', status: 'on-track', statusLabel: 'ON TRACK', progress: 58, ownerId: 'user-rasya', quarter: 'Q3 2026', dueDate: 'Sep 30, 2026' },
    { id: 'goal-2', title: 'Q3 Improve Dev Velocity', description: 'Increase the speed and quality of software delivery by improving CI/CD pipelines, reducing review times, and raising test coverage across all teams.', status: 'at-risk', statusLabel: 'AT RISK', progress: 28, ownerId: 'user-maya', quarter: 'Q3 2026', dueDate: 'Sep 30, 2026' },
    { id: 'goal-3', title: 'Q4 Launch Beta to 100 Users', description: 'Acquire and onboard the first 100 beta users, gather qualitative feedback, and achieve a healthy early retention rate before the public launch.', status: 'not-started', statusLabel: 'NOT STARTED', progress: 0, ownerId: 'user-dito', quarter: 'Q4 2026', dueDate: 'Dec 31, 2026' },
    { id: 'goal-4', title: 'Q2 Design System Foundation', description: 'Establish a shared design system with components, tokens, and documentation that all product teams can use consistently.', status: 'delayed', statusLabel: 'DELAYED', progress: 40, ownerId: 'user-rasya', quarter: 'Q2 2026', dueDate: 'Jun 30, 2026' },
  ])

  await db.insert(schema.goalLabels).values([
    { id: 'gl-1', goalId: 'goal-1', name: 'Product', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'gl-2', goalId: 'goal-1', name: 'Q3', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { id: 'gl-3', goalId: 'goal-2', name: 'Engineering', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'gl-4', goalId: 'goal-3', name: 'Beta', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'gl-5', goalId: 'goal-3', name: 'Growth', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ])

  await db.insert(schema.kpis).values([
    { id: 'kpi-1', goalId: 'goal-1', name: 'NPS Score ≥ 45', currentValue: '38', targetValue: '45', progress: 84, status: 'at-risk', statusLabel: 'AT RISK', ownerId: 'user-rasya', dueDate: 'Sep 30' },
    { id: 'kpi-2', goalId: 'goal-1', name: 'Reduce page load < 2s', currentValue: '2.1s', targetValue: '2.0s', progress: 95, status: 'on-track', statusLabel: 'ON TRACK', ownerId: 'user-dito', dueDate: 'Aug 15' },
    { id: 'kpi-3', goalId: 'goal-1', name: 'Launch 3 core features', currentValue: '1', targetValue: '3', progress: 33, status: 'delayed', statusLabel: 'DELAYED', ownerId: 'user-maya', dueDate: 'Sep 30' },
    { id: 'kpi-4', goalId: 'goal-2', name: 'Deploy frequency ≥ 3x/week', currentValue: '1.5', targetValue: '3', progress: 50, status: 'at-risk', statusLabel: 'AT RISK', ownerId: 'user-maya', dueDate: 'Sep 30' },
    { id: 'kpi-5', goalId: 'goal-2', name: 'PR review time < 4h', currentValue: '6h', targetValue: '4h', progress: 67, status: 'at-risk', statusLabel: 'AT RISK', ownerId: 'user-dito', dueDate: 'Aug 30' },
    { id: 'kpi-6', goalId: 'goal-2', name: 'Test coverage ≥ 80%', currentValue: '72%', targetValue: '80%', progress: 90, status: 'on-track', statusLabel: 'ON TRACK', ownerId: 'user-rara', dueDate: 'Sep 15' },
    { id: 'kpi-7', goalId: 'goal-3', name: 'Beta user signups ≥ 100', currentValue: '0', targetValue: '100', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', ownerId: 'user-dito', dueDate: 'Dec 31' },
    { id: 'kpi-8', goalId: 'goal-3', name: 'User retention ≥ 60%', currentValue: '0%', targetValue: '60%', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', ownerId: 'user-maya', dueDate: 'Dec 31' },
  ])

  // ── Projects ───────────────────────────────────────────────────────────────
  await db.delete(schema.projects)
  await db.insert(schema.projects).values([
    { id: 'p1', key: 'ALPHA', name: 'Alpha Project', category: 'UX Redesign', description: 'Redesigning core product UX to improve activation, retention, and time-to-value across the entire product surface.', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', priorityLabel: 'High', progress: 62, doneT: 9, totalT: 14, openTasks: 14, atRiskTasks: 2, dueDate: 'Aug 30, 2025', ownerId: 'user-rasya', riskLevel: 'high', riskReason: '3 tasks overdue', color: 'bg-blue-500', labels: 'UX, Q3', attachCount: 3, commentCount: 7 },
    { id: 'p2', key: 'BETA', name: 'Beta Launch', category: 'Q3 Milestone', description: 'Public launch milestone for Q3, marketing site, landing page, and announcement prep.', status: 'on-track', statusLabel: 'On Track', priority: 'medium', priorityLabel: 'Medium', progress: 78, doneT: 7, totalT: 9, openTasks: 9, atRiskTasks: 0, dueDate: 'Jul 15, 2025', ownerId: 'user-maya', riskLevel: 'low', riskReason: '', color: 'bg-green-500', labels: 'Q3', attachCount: 5, commentCount: 12 },
    { id: 'p3', key: 'MOB', name: 'Mobile App MVP', category: 'Product', description: 'iOS + Android MVP, core flows and onboarding.', status: 'on-track', statusLabel: 'On Track', priority: 'high', priorityLabel: 'High', progress: 45, doneT: 9, totalT: 20, openTasks: 20, atRiskTasks: 1, dueDate: 'Oct 1, 2025', ownerId: 'user-rasya', riskLevel: 'medium', riskReason: 'Checkout flow overdue', color: 'bg-purple-500', labels: 'Mobile, Q4', attachCount: 8, commentCount: 4 },
    { id: 'p4', key: 'ANL', name: 'Analytics Dashboard', category: 'Data & Reporting', description: 'Data & reporting suite for internal and external use.', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', priorityLabel: 'High', progress: 30, doneT: 4, totalT: 13, openTasks: 13, atRiskTasks: 3, dueDate: 'Jul 5, 2025', ownerId: 'user-maya', riskLevel: 'high', riskReason: '3 at-risk tasks, past deadline', color: 'bg-amber-500', labels: 'Data', attachCount: 2, commentCount: 9 },
    { id: 'p5', key: 'CUS', name: 'Customer Portal', category: 'Self-serve', description: 'Self-serve billing, profile, and account management.', status: 'on-track', statusLabel: 'On Track', priority: 'low', priorityLabel: 'Low', progress: 90, doneT: 18, totalT: 20, openTasks: 2, atRiskTasks: 0, dueDate: 'Aug 1, 2025', ownerId: 'user-rara', riskLevel: 'low', riskReason: '', color: 'bg-teal-500', labels: '', attachCount: 11, commentCount: 3 },
    { id: 'p6', key: 'API', name: 'API Gateway v2', category: 'Infrastructure', description: 'Rate limiting, auth middleware, and routing redesign.', status: 'delayed', statusLabel: 'Delayed', priority: 'high', priorityLabel: 'High', progress: 15, doneT: 2, totalT: 12, openTasks: 12, atRiskTasks: 4, dueDate: 'Jun 30, 2025', ownerId: 'user-dito', riskLevel: 'high', riskReason: '4 at-risk tasks, overdue', color: 'bg-red-500', labels: 'Infra, Backend', attachCount: 0, commentCount: 14 },
    { id: 'p7', key: 'DS2', name: 'Design System v2', category: 'Design', description: 'Component library, tokens, and documentation rollout.', status: 'on-track', statusLabel: 'On Track', priority: 'medium', priorityLabel: 'Medium', progress: 55, doneT: 6, totalT: 11, openTasks: 5, atRiskTasks: 0, dueDate: 'Sep 15, 2025', ownerId: 'user-rasya', riskLevel: 'low', riskReason: '', color: 'bg-pink-500', labels: 'Design, Q3', attachCount: 6, commentCount: 8 },
    { id: 'p8', key: 'INT', name: 'Internal Tools', category: 'Design System', description: 'Tracker revamp and design system rollout for internal team.', status: 'not-started', statusLabel: 'Not Started', priority: 'low', priorityLabel: 'Low', progress: 0, doneT: 0, totalT: 0, openTasks: 0, atRiskTasks: 0, dueDate: 'Sep 10, 2025', ownerId: 'user-rasya', riskLevel: 'low', riskReason: '', color: 'bg-gray-500', labels: '', attachCount: 0, commentCount: 0 },
  ])

  await db.insert(schema.projectMembers).values([
    { projectId: 'p1', userId: 'user-rasya', seed: 'Rasya', bg: 'b6e3f4' },
    { projectId: 'p1', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p1', userId: 'user-dito', seed: 'Dito', bg: 'c0aede' },
    { projectId: 'p2', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p3', userId: 'user-rasya', seed: 'Rasya', bg: 'b6e3f4' },
    { projectId: 'p3', userId: 'user-rara', seed: 'Rara', bg: 'f9a8d4' },
    { projectId: 'p4', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p5', userId: 'user-rara', seed: 'Rara', bg: 'f9a8d4' },
    { projectId: 'p6', userId: 'user-dito', seed: 'Dito', bg: 'c0aede' },
    { projectId: 'p6', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p7', userId: 'user-rasya', seed: 'Rasya', bg: 'b6e3f4' },
    { projectId: 'p7', userId: 'user-rara', seed: 'Rara', bg: 'f9a8d4' },
  ])

  await db.insert(schema.goalProjects).values([
    { goalId: 'goal-1', projectId: 'p1', titleOverride: 'Auth & Onboarding Redesign', taskCount: 8 },
    { goalId: 'goal-1', projectId: 'p7', titleOverride: 'Core Dashboard v2', taskCount: 5 },
    { goalId: 'goal-2', projectId: 'p2', titleOverride: 'API Documentation', taskCount: 3 },
  ])

  // ── Tasks ──────────────────────────────────────────────────────────────────
  await db.delete(schema.tasks)
  await db.insert(schema.tasks).values([
    // Overdue
    { id: 'task-t1', title: 'Auth redesign implementation', status: 'overdue', statusLabel: 'Overdue', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jun 10', dueType: 'overdue', done: false },
    { id: 'task-t2', title: 'Mobile checkout flow', status: 'overdue', statusLabel: 'Overdue', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'Jun 14', dueType: 'overdue', done: false },
    { id: 'task-t3', title: 'Token naming inconsistency fix', status: 'overdue', statusLabel: 'Overdue', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 18', dueType: 'overdue', done: false },
    // In Progress
    { id: 'task-t4', title: 'Produce high-fidelity mockups', status: 'in-progress', statusLabel: 'In Progress', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Today', dueType: 'today', done: false },
    { id: 'task-t5', title: 'API rate limit specification', status: 'in-progress', statusLabel: 'In Progress', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Today', dueType: 'today', done: false },
    { id: 'task-t6', title: 'Component library export', status: 'in-progress', statusLabel: 'In Progress', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 23', dueType: 'week', done: false },
    { id: 'task-t7', title: 'Implement payment gateway', status: 'in-progress', statusLabel: 'In Progress', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'Jun 24', dueType: 'week', done: false },
    { id: 'task-t8', title: 'Write release notes draft', status: 'in-progress', statusLabel: 'In Progress', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: '—', dueType: 'none', done: false },
    // To Do
    { id: 'task-t9', title: 'Handoff to engineering', status: 'todo', statusLabel: 'To Do', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jul 15', dueType: 'none', done: false },
    { id: 'task-t10', title: 'Onboarding copy finalization', status: 'todo', statusLabel: 'To Do', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Jul 1', dueType: 'none', done: false },
    { id: 'task-t11', title: 'App store submission checklist', status: 'todo', statusLabel: 'To Do', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'Jun 30', dueType: 'week', done: false },
    // In Review
    { id: 'task-t12', title: 'Draft information architecture', status: 'in-review', statusLabel: 'In Review', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jun 22', dueType: 'week', done: false },
    { id: 'task-t13', title: 'Design system documentation', status: 'in-review', statusLabel: 'In Review', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 25', dueType: 'none', done: false },
    // Completed
    { id: 'task-t14', title: 'Finalize user research synthesis', status: 'done', statusLabel: 'Done', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jun 10', dueType: 'none', done: true },
    { id: 'task-t15', title: 'Audit existing components', status: 'done', statusLabel: 'Done', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 12', dueType: 'none', done: true },
    { id: 'task-t16', title: 'Set up CI/CD pipeline', status: 'done', statusLabel: 'Done', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Jun 15', dueType: 'none', done: true },
    { id: 'task-t17', title: 'Finalize screen flows', status: 'done', statusLabel: 'Done', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'May 15', dueType: 'none', done: true },
    { id: 'task-t18', title: 'User interview synthesis', status: 'done', statusLabel: 'Done', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'May 20', dueType: 'none', done: true },
    { id: 'task-t19', title: 'Typography scale definition', status: 'done', statusLabel: 'Done', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'May 28', dueType: 'none', done: true },
    { id: 'task-t20', title: 'Competitor feature analysis', status: 'done', statusLabel: 'Done', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Jun 5', dueType: 'none', done: true },
  ])

  await db.insert(schema.taskLabels).values([
    { id: 'tl-1', taskId: 'task-t1', text: 'UX', color: '' },
    { id: 'tl-2', taskId: 'task-t1', text: 'Design', color: 'amber' },
    { id: 'tl-3', taskId: 'task-t2', text: 'Mobile', color: 'green' },
    { id: 'tl-4', taskId: 'task-t3', text: 'Tokens', color: 'gray' },
    { id: 'tl-5', taskId: 'task-t4', text: 'UX', color: '' },
    { id: 'tl-6', taskId: 'task-t4', text: 'Figma', color: '' },
    { id: 'tl-7', taskId: 'task-t5', text: 'Backend', color: 'gray' },
    { id: 'tl-8', taskId: 'task-t6', text: 'Components', color: 'green' },
    { id: 'tl-9', taskId: 'task-t7', text: 'Mobile', color: 'green' },
    { id: 'tl-10', taskId: 'task-t7', text: 'Dev', color: 'gray' },
    { id: 'tl-11', taskId: 'task-t8', text: 'Docs', color: 'gray' },
    { id: 'tl-12', taskId: 'task-t9', text: 'Handoff', color: 'gray' },
    { id: 'tl-13', taskId: 'task-t12', text: 'UX', color: '' },
  ])

  // ── Critical Issues ────────────────────────────────────────────────────────
  await db.delete(schema.criticalIssues)
  await db.insert(schema.criticalIssues).values([
    { id: 'ci-1', title: 'Auth redesign implementation', subtitle: 'Blocking login flow for new users', project: 'Alpha Project', assigneeName: 'Dito', priority: 'High', priorityLabel: 'HIGH', status: 'Overdue', statusLabel: 'Overdue' },
    { id: 'ci-2', title: 'API rate limit specification', subtitle: 'Missing specs before dev handoff', project: 'Beta Launch', assigneeName: 'Unassigned', priority: 'High', priorityLabel: 'HIGH', status: 'At Risk', statusLabel: 'At Risk' },
    { id: 'ci-3', title: 'Mobile checkout flow blocked', subtitle: 'Payment gateway integration stalled', project: 'Mobile App MVP', assigneeName: 'Dito', priority: 'High', priorityLabel: 'HIGH', status: 'Overdue', statusLabel: 'Overdue' },
    { id: 'ci-4', title: 'Token naming inconsistency', subtitle: 'Affecting component library export', project: 'Design System v2', assigneeName: 'Rasya', priority: 'Medium', priorityLabel: 'MED', status: 'At Risk', statusLabel: 'At Risk' },
  ])

  // ── Docs ────────────────────────────────────────────────────────────────────
  await db.delete(schema.docs)
  await db.insert(schema.docs).values([
    { id: 'doc-1', title: 'Project Alpha — Design Spec', content: '# Design Specification\n\n## Overview\nThis document covers the design requirements for Alpha Project UX redesign.\n\n## Key Decisions\n- Color palette: based on Tailwind v4 default tokens\n- Typography: Geist (Inter fallback)\n- Spacing: 8px base grid', goalId: 'goal-1', projectId: 'p1', taskId: null, createdBy: 'user-rasya', labels: 'Design, Spec', isPublic: false },
    { id: 'doc-2', title: 'Beta Launch Checklist', content: '## Pre-launch\n- [ ] DNS configured\n- [ ] SSL verified\n- [ ] Load test completed\n- [ ] Rollback plan documented\n\n## Post-launch\n- [ ] Monitor errors 24h\n- [ ] User feedback form live', goalId: 'goal-2', projectId: 'p2', taskId: null, createdBy: 'user-maya', labels: 'Launch, Checklist', isPublic: false },
    { id: 'doc-3', title: 'Design Token Reference', content: '## Colors\n- Primary: #2563EB\n- Success: #16A34A\n- Warning: #F59E0B\n- Danger: #DC2626\n\n## Spacing\n- Base: 4px\n- Scale: 4, 8, 12, 16, 24, 32, 48, 64', goalId: 'goal-4', projectId: 'p7', taskId: null, createdBy: 'user-rasya', labels: 'Design, Tokens', isPublic: true },
    { id: 'doc-4', title: 'API Integration Guide', content: '## Authentication\nAll requests require a session cookie.\n\n### Endpoints\n- `GET /api/projects` — list projects\n- `POST /api/tasks` — create task\n- `GET /api/dashboard` — dashboard stats', goalId: 'goal-2', projectId: 'p6', taskId: null, createdBy: 'user-dito', labels: 'API, Guide', isPublic: false },
  ])

  // ── Notifications ───────────────────────────────────────────────────────────
  await db.delete(schema.notifications)
  await db.insert(schema.notifications).values([
    { id: 'notif-1', userId: 'user-rasya', actorId: 'user-dito', entityType: 'task', entityId: 'task-t1', action: 'assigned', message: 'Dito assigned you to "Auth redesign implementation"', isRead: false },
    { id: 'notif-2', userId: 'user-rasya', actorId: 'user-maya', entityType: 'task', entityId: 'task-t4', action: 'commented', message: 'Maya commented on "Produce high-fidelity mockups"', isRead: false },
    { id: 'notif-3', userId: 'user-rasya', actorId: null, entityType: 'task', entityId: 'task-t2', action: 'status_changed', message: '"Mobile checkout flow" is now overdue', isRead: true },
    { id: 'notif-4', userId: 'user-rasya', actorId: 'user-rara', entityType: 'task', entityId: 'task-t9', action: 'mentioned', message: 'Rara mentioned you in "Handoff to engineering"', isRead: false },
    { id: 'notif-5', userId: 'user-maya', actorId: 'user-rasya', entityType: 'project', entityId: 'p1', action: 'status_changed', message: 'Alpha Project status changed to At Risk', isRead: false },
    { id: 'notif-6', userId: 'user-dito', actorId: 'user-maya', entityType: 'task', entityId: 'task-t5', action: 'assigned', message: 'Maya assigned you to "API rate limit specification"', isRead: true },
  ])

  // ── My Day ──────────────────────────────────────────────────────────────────
  await db.delete(schema.myDay)
  await db.insert(schema.myDay).values([
    { id: 'md-1', userId: 'user-rasya', taskId: 'task-t4', date: new Date().toISOString().slice(0, 10) },
    { id: 'md-2', userId: 'user-rasya', taskId: 'task-t5', date: new Date().toISOString().slice(0, 10) },
    { id: 'md-3', userId: 'user-rasya', taskId: 'task-t9', date: new Date().toISOString().slice(0, 10) },
  ])

  // ── Templates ───────────────────────────────────────────────────────────────
  await db.delete(schema.templates)
  await db.insert(schema.templates).values([
    { id: 'tpl-1', name: 'Feature Epic Template', description: 'Standard epic for feature development with default tasks', entityType: 'epic', payload: JSON.stringify({ name: 'Feature Epic', priority: 'medium', description: 'Feature scope and implementation plan' }), createdBy: 'user-rasya', isGlobal: true },
    { id: 'tpl-2', name: 'Bug Fix Task', description: 'Standard bug fix task template', entityType: 'task', payload: JSON.stringify({ priority: 'high', description: 'Steps to reproduce:\n1.\n2.\n3.\n\nExpected behavior:\n\nActual behavior:' }), createdBy: 'user-rasya', isGlobal: true },
    { id: 'tpl-3', name: 'Design Review Task', description: 'Task template for design review cycles', entityType: 'task', payload: JSON.stringify({ priority: 'medium', description: '## Assets\n- Figma file link:\n- Screenshot references:\n\n## Review Criteria\n- [ ] Brand consistency\n- [ ] Component usage\n- [ ] Responsive behavior' }), createdBy: 'user-maya', isGlobal: false },
  ])

  // ── Task Dependencies ───────────────────────────────────────────────────────
  await db.delete(schema.taskDependencies)
  await db.insert(schema.taskDependencies).values([
    { taskId: 'task-t1', dependsOnTaskId: 'task-t12' }, // Auth blocked by IA draft
    { taskId: 'task-t2', dependsOnTaskId: 'task-t7' },  // Checkout blocked by payment gateway
    { taskId: 'task-t5', dependsOnTaskId: 'task-t8' },  // Rate limit spec blocked by release notes
  ])

  // ── Time Entries ────────────────────────────────────────────────────────────
  await db.delete(schema.timeEntries)
  await db.insert(schema.timeEntries).values([
    { id: 'te-1', taskId: 'task-t4', userId: 'user-rasya', hours: 3.5, note: 'Initial mockup wireframes', loggedDate: '2026-06-24' },
    { id: 'te-2', taskId: 'task-t4', userId: 'user-rasya', hours: 2.0, note: 'Polished high-fidelity screens', loggedDate: '2026-06-25' },
    { id: 'te-3', taskId: 'task-t6', userId: 'user-rasya', hours: 1.5, note: 'Exported button and input components', loggedDate: '2026-06-23' },
    { id: 'te-4', taskId: 'task-t8', userId: 'user-rasya', hours: 2.0, note: 'Drafted v2.1 release notes', loggedDate: '2026-06-24' },
  ])

  console.log('✅ Seed complete')
}
```

---

## Step 17 — Run Migration + Seed

After writing all the above files, run:

```bash
# 1. Generate migration from schema
npx drizzle-kit generate

# 2. Apply migration to local D1
npx wrangler d1 execute elux-tracker --local --file=./server/database/migrations/<generated_file>.sql

# 3. Run seed (you'll need to call seed() from a script or via wrangler)
# Option A — via Wrangler Pages dev with a seed route:
# Create server/api/seed.post.ts that calls seed(useDB()) — DELETE THIS FILE AFTER USE

# Option B — generate SQL from seed data manually:
npx drizzle-kit studio  # opens Drizzle Studio to paste/run seed SQL
```

**Temporary seed route (delete after first run):**

`server/api/__seed.post.ts`

```typescript
import { seed } from '../database/seed'
import { useDB } from '../utils/db'

export default defineEventHandler(async (event) => {
  // DANGER: Remove this file after seeding
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden in production' })
  }
  await seed(useDB())
  return { ok: true }
})
```

Call it once: `curl -X POST http://localhost:3000/api/__seed`

Then **delete `server/api/__seed.post.ts`**.

---

## Step 18 — Frontend: Replace Dummy Data with API Calls

After the backend is running, swap these files to call the API instead of using local arrays.

**`app/pages/projects/index.vue`** — replace `allProjects` constant:
```typescript
const { data: allProjects } = await useAsyncData('projects', () => $fetch('/api/projects'))
```

**`app/pages/goals/index.vue`** — replace `goals` ref:
```typescript
const { data: goals } = await useAsyncData('goals', () => $fetch('/api/goals'))
```

**`app/pages/my-work.vue`** — replace `groups` static data:
```typescript
const { data: myTasks } = await useAsyncData('my-work', () => $fetch('/api/my-work'))
// then group by task.status client-side
```

**`app/pages/projects/[id].vue`** — replace `db` array:
```typescript
const route = useRoute()
const { data: project } = await useAsyncData(`project-${route.params.id}`, () =>
  $fetch(`/api/projects/${route.params.id}`)
)
```

**`app/pages/goals/[id].vue`** — replace `goalDb` array:
```typescript
const route = useRoute()
const { data: goal } = await useAsyncData(`goal-${route.params.id}`, () =>
  $fetch(`/api/goals/${route.params.id}`)
)
```

**`app/pages/dashboard.vue`** — replace stat computation:
```typescript
const { data: dash } = await useAsyncData('dashboard', () => $fetch('/api/dashboard'))
```

**`app/pages/docs/index.vue`** — replace doc list:
```typescript
const { data: docs } = await useAsyncData('docs', () => $fetch('/api/docs'))
```

**`app/pages/docs/[id].vue`** — replace doc detail:
```typescript
const route = useRoute()
const { data: doc } = await useAsyncData(`doc-${route.params.id}`, () =>
  $fetch(`/api/docs/${route.params.id}`)
)
```

**`app/pages/my-day.vue`** — replace dummy My Day:
```typescript
const { data: myDayTasks } = await useAsyncData('my-day', () => $fetch('/api/my-day'))
```

**`app/pages/notifications.vue`** — replace dummy notifications:
```typescript
const { data: notificationsData } = await useAsyncData('notifications', () =>
  $fetch('/api/notifications')
)
```

**`app/pages/team.vue`** — replace dummy team:
```typescript
const { data: team } = await useAsyncData('team', () => $fetch('/api/team'))
```

**`app/pages/activity.vue`** — replace dummy activity:
```typescript
const { data: activityData } = await useAsyncData('activity', () =>
  $fetch('/api/activity?limit=50')
)
```

**`app/pages/critical-issues.vue`** — replace dummy issues:
```typescript
const { data: issues } = await useAsyncData('critical-issues', () =>
  $fetch('/api/critical-issues')
)
```

**`app/pages/board.vue`** — replace tasks:
```typescript
const { data: tasks } = await useAsyncData('tasks', () => $fetch('/api/tasks'))
```

**`app/pages/tasks/[id].vue`** — replace dummy task detail:
```typescript
const route = useRoute()
const { data: task } = await useAsyncData(`task-${route.params.id}`, () =>
  $fetch(`/api/tasks/${route.params.id}`)
)
```

**Time tracking** — log time for a task:
```typescript
await $fetch('/api/time', {
  method: 'POST',
  body: { taskId: 'task-123', hours: 2.5, note: 'Reviewed designs', loggedDate: '2026-06-25' }
})
```

**Task dependencies** — add a dependency:
```typescript
await $fetch('/api/tasks/task-123/dependencies', {
  method: 'POST',
  body: { dependsOnTaskId: 'task-456' }
})
```

**Templates** — apply a template:
```typescript
await $fetch('/api/templates/tpl-1/apply', {
  method: 'POST',
  body: { title: 'My New Project', assigneeId: 'user-rasya' }
})
```

---

## Step 19 — Notes

- All routes under `server/api/` are auto-imported by Nitro — no manual registration needed.
- `server/utils/db.ts` already exports `useDB()` and re-exports `sql, eq, and, or, desc, asc, like` from drizzle-orm. Import from there, not directly from drizzle-orm.
- For local dev: use `npx nuxthub dev` (not `nuxt dev`) to get the D1 binding.
- `getUserSession()` and `setUserSession()` come from `nuxt-auth-utils` — auto-imported in server routes.
- The `server/middleware/auth.ts` runs on every request. Public paths (login, logout, me) are exempted by prefix check.
- **RBAC:** `server/utils/permissions.ts` exports `requireAuth()`, `requireRole()`, and `requireOwnership()`. Apply `requireRole(event, 'admin', 'manager')` at the top of every mutating route.
- **CSRF:** `server/middleware/csrf.ts` checks `X-CSRF-Token` header for all mutating routes. Disabled in development mode.
- **Validation:** `server/utils/validation.ts` exports Zod schemas. Use `safeParse()` — on failure, throw `createError({ statusCode: 400 })`.
- **Activity Logging:** `server/utils/activity.ts` exports `logActivity(event, action, entityType, entityId, target)`. Call in every mutating route.
- **Pagination:** `server/utils/pagination.ts` exports `getPagination(event)` and `wrapPaginated()`. Apply to all list endpoints. Max 50 per page.
- The `event.context.user` is set by `server/middleware/auth.ts` — it contains `{ id, name, initials, avatar, role }`.
- **Password hashing:** The seed uses `plain:` prefix for dev. Before production, swap login to use bcrypt comparison and update passwords to bcrypt hashes.
- Pagination: add `?page=1&limit=20` query params to list routes when you need it — not required for seed data volume.
