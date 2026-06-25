import { useDB, eq } from '../../../utils/db'
import { notifications } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id))
  return { ok: true }
})
