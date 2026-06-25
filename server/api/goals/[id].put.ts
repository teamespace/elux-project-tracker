import { useDB, eq } from '../../utils/db'
import { goals } from '../../database/schema'
import { sql } from 'drizzle-orm'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { updateGoalSchema } from '../../utils/validation'

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
