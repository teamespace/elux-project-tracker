import { useDB, eq } from '../../utils/db'
import { myDay } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const entry = await db.select().from(myDay).where(eq(myDay.id, id)).get()
  if (!entry || entry.userId !== userId) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  await db.delete(myDay).where(eq(myDay.id, id))
  return { ok: true }
})
