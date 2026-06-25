import { useDB, eq, and } from '../utils/db'
import { myDay } from '../database/schema'
import { addMyDaySchema } from '../utils/validation'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const result = addMyDaySchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const { taskId } = result.data
  const date = new Date().toISOString().slice(0, 10)
  const db = useDB()

  // Check if already exists
  const existing = await db.select().from(myDay)
    .where(and(eq(myDay.userId, userId), eq(myDay.taskId, taskId), eq(myDay.date, date)))
    .get()

  if (existing) return { ok: true, id: existing.id }

  const id = `md-${Date.now()}`
  await db.insert(myDay).values({ id, userId, taskId, date })

  return { id, ok: true }
})
