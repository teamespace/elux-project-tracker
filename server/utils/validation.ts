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
  assignees: z.array(z.string().min(1)).optional(),
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
