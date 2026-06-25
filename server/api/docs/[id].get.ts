import { useDB, eq } from '../../utils/db'
import { docs, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const doc = await db.select().from(docs).where(eq(docs.id, id)).get()
  if (!doc) throw createError({ statusCode: 404, statusMessage: 'Doc not found' })

  const author = await db.select().from(users).where(eq(users.id, doc.createdBy)).get()

  return {
    ...doc,
    author: author ? { id: author.id, initials: author.initials, name: author.name, avatar: author.avatar } : null,
  }
})
