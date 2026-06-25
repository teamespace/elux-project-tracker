import { useDB } from '../../utils/db'
import { docs, users } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  let allDocs = await db.select().from(docs).all()

  if (query.projectId) allDocs = allDocs.filter(d => d.projectId === query.projectId)
  if (query.goalId) allDocs = allDocs.filter(d => d.goalId === query.goalId)

  return Promise.all(allDocs.map(async (d) => {
    const author = await db.select().from(users).where(eq(users.id, d.createdBy)).get()
    return {
      ...d,
      author: author ? { id: author.id, initials: author.initials, name: author.name, avatar: author.avatar } : null,
    }
  }))
})
