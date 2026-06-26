import { useDB, eq, and } from '../utils/db'
import { myDay, tasks, users, projects } from '../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  const date = new Date().toISOString().slice(0, 10)
  const items = await db.select().from(myDay)
    .where(and(eq(myDay.userId, userId), eq(myDay.date, date)))
    .all()

  // Enrich with task info
  const result = []
  for (const item of items) {
    const task = await db.select().from(tasks).where(eq(tasks.id, item.taskId)).get()
    if (!task) continue
    let projectName = ''
    if (task.projectId) {
      const proj = await db.select().from(projects).where(eq(projects.id, task.projectId)).get()
      projectName = proj?.name || ''
    }
    let assignee = null
    if (task.assigneeId) {
      const u = await db.select().from(users).where(eq(users.id, task.assigneeId)).get()
      if (u) assignee = { id: u.id, name: u.name, avatar: `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(u.name)}` }
    }
    result.push({
      id: item.id,
      taskId: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      statusLabel: task.statusLabel,
      priority: task.priority,
      priorityLabel: task.priorityLabel,
      projectId: task.projectId,
      projectName,
      dueDate: task.dueDate,
      progress: task.progress,
      done: task.status === 'done',
      assignee,
      date: item.date,
    })
  }
  return result
})