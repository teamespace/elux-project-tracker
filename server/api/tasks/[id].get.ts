import { useDB, eq } from '../../utils/db'
import { tasks, subtasks, taskLabels, comments, users } from '../../database/schema'
import { desc } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const task = await db.select().from(tasks).where(eq(tasks.id, id)).get()
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

  const subs = await db.select().from(subtasks).where(eq(subtasks.taskId, id)).all()
  const labels = await db.select().from(taskLabels).where(eq(taskLabels.taskId, id)).all()
  const commentList = await db.select().from(comments)
    .where(eq(comments.parentId, id))
    .orderBy(desc(comments.createdAt))
    .all()
  const enrichedComments = await Promise.all(commentList.map(async (c) => {
    const author = await db.select().from(users).where(eq(users.id, c.authorId)).get()
    return { ...c, author: author ? { initials: author.initials, name: author.name, avatar: author.avatar } : null }
  }))

  return {
    ...task,
    subtasks: subs,
    labels: labels.map(l => ({ text: l.text, color: l.color })),
    comments: enrichedComments,
  }
})
