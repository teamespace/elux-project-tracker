import { useDB, eq } from '../../../utils/db'
import { notifications } from '../../../database/schema'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id))
  await logActivity(event as any, 'read notification', 'task', id)
  return { ok: true }
})
