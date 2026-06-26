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
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
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
