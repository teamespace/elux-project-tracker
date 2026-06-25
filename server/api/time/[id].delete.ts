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
