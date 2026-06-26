import { useDB, eq, and } from '../../utils/db'
import { myDay } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const taskId = getRouterParam(event, 'taskId')
  if (!taskId) throw createError({ statusCode: 400, statusMessage: 'Missing taskId' })

  const date = new Date().toISOString().slice(0, 10)
  const db = useDB()
  await db.delete(myDay).where(and(
    eq(myDay.userId, userId),
    eq(myDay.taskId, taskId),
    eq(myDay.date, date),
  ))

  return { ok: true }
})