import { useDB, eq } from '../../utils/db'
import { notifications } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId))

  return { ok: true }
})
