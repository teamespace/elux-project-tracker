import { useDB, eq } from '../utils/db'
import { tasks, taskLabels } from '../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  const myTasks = await db.select().from(tasks).where(eq(tasks.assigneeId, userId)).all()

  return Promise.all(myTasks.map(async (t) => {
    const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, t.id)).all()
    return { ...t, labels: labels.map(l => ({ text: l.text, color: l.color })) }
  }))
})
