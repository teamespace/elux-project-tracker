import { useDB, eq } from '../../utils/db'
import { goals } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

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
