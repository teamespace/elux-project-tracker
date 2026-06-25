import { useDB, eq, and } from '../utils/db'
import { myDay, tasks, taskLabels } from '../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const date = (getQuery(event).date as string) ?? new Date().toISOString().slice(0, 10)
  const db = useDB()

  const entries = await db.select().from(myDay)
    .where(and(eq(myDay.userId, userId), eq(myDay.date, date)))
    .all()

  const taskIds = entries.map(e => e.taskId)
  if (taskIds.length === 0) return []

  const taskResults = await db.select().from(tasks).all()
  const myTasks = taskResults.filter(t => taskIds.includes(t.id))

  return Promise.all(myTasks.map(async (t) => {
    const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, t.id)).all()
    return { ...t, labels: labels.map(l => ({ text: l.text, color: l.color })) }
  }))
})
