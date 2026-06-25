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
