import { useDB, eq } from '../../utils/db'
import { subtasks } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const db = useDB()
  await db.delete(subtasks).where(eq(subtasks.id, id))
  await logActivity(event, 'deleted subtask', 'subtask', id)
  return { ok: true }
})
