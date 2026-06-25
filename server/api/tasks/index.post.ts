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
