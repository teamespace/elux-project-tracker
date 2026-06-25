import { useDB, eq } from '../../utils/db'
import { tasks, taskLabels, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  let allTasks = await db.select().from(tasks).all()

  if (query.projectId) {
    allTasks = allTasks.filter(t => t.projectId === query.projectId)
  }
  if (query.assigneeId) {
    allTasks = allTasks.filter(t => t.assigneeId === query.assigneeId)
  }
  if (query.status) {
    allTasks = allTasks.filter(t => t.status === query.status)
  }

  return Promise.all(allTasks.map(async (t) => {
    const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, t.id)).all()
    const assignee = t.assigneeId
      ? await db.select().from(users).where(eq(users.id, t.assigneeId)).get()
      : null
    return {
      ...t,
      labels: labels.map(l => ({ text: l.text, color: l.color })),
      assignee: assignee ? { id: assignee.id, initials: assignee.initials, name: assignee.name, avatar: assignee.avatar } : null,
    }
  }))
})
