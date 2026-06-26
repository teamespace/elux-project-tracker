import { useDB, eq, and, count } from '../../utils/db'
import { notifications } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  const result = await db.select({ count: count() }).from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
    .get()

  return { count: result?.count ?? 0 }
})