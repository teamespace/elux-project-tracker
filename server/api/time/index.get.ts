import { useDB, eq } from '../../utils/db'
import { timeEntries, users } from '../../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  let entries = await db.select().from(timeEntries)
    .orderBy(desc(timeEntries.createdAt))
    .all()

  if (query.taskId) entries = entries.filter(e => e.taskId === query.taskId)
  if (query.userId) entries = entries.filter(e => e.userId === query.userId)

  return Promise.all(entries.map(async (e) => {
    const user = await db.select().from(users).where(eq(users.id, e.userId)).get()
    return {
      ...e,
      user: user ? { initials: user.initials, name: user.name, avatar: user.avatar } : null,
    }
  }))
})
