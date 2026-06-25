import { useDB, eq } from '../utils/db'
import { notifications, users } from '../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  const all = await db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
    .all()

  return Promise.all(all.map(async (n) => {
    const actor = n.actorId
      ? await db.select().from(users).where(eq(users.id, n.actorId)).get()
      : null
    return {
      ...n,
      actor: actor ? { initials: actor.initials, name: actor.name, avatar: actor.avatar } : null,
    }
  }))
})
