import { useDB, eq } from '../../utils/db'
import { tasks } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const task = await db.select().from(tasks).where(eq(tasks.id, id)).get()
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

  if (user.role !== 'admin' && user.role !== 'manager' && task.assigneeId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await db.delete(tasks).where(eq(tasks.id, id))
  await logActivity(event, 'deleted task', 'task', id, task.title)

  return { ok: true }
})
