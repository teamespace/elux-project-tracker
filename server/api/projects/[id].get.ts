import { useDB, eq } from '../../utils/db'
import { projects, projectMembers, tasks, subtasks, comments, users, activity } from '../../database/schema'
import { desc } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const proj = await db.select().from(projects).where(eq(projects.id, id)).get()
  if (!proj) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const owner = proj.ownerId
    ? await db.select().from(users).where(eq(users.id, proj.ownerId)).get()
    : null

  const members = await db.select().from(projectMembers).where(eq(projectMembers.projectId, id)).all()

  const taskList = await db.select().from(tasks).where(eq(tasks.projectId, id)).all()
  const enrichedTasks = await Promise.all(taskList.map(async (t) => {
    const subs = await db.select().from(subtasks).where(eq(subtasks.taskId, t.id)).all()
    return { ...t, subtasks: subs }
  }))

  const commentList = await db.select().from(comments)
    .where(eq(comments.parentId, id))
    .orderBy(desc(comments.createdAt))
    .all()
  const enrichedComments = await Promise.all(commentList.map(async (c) => {
    const author = await db.select().from(users).where(eq(users.id, c.authorId)).get()
    return {
      ...c,
      author: author ? { initials: author.initials, name: author.name, avatar: author.avatar } : null,
    }
  }))

  const activityList = await db.select().from(activity)
    .where(eq(activity.entityId, id))
    .orderBy(desc(activity.createdAt))
    .limit(20)
    .all()

  return {
    ...proj,
    owner: owner ? { initials: owner.initials, name: owner.name, avatar: owner.avatar } : null,
    assignees: members.map(m => ({ seed: m.seed, bg: m.bg, name: m.seed })),
    childTasks: enrichedTasks,
    comments: enrichedComments,
    activities: activityList.map(a => ({
      id: a.id,
      actor: { initials: a.actorInitials, name: a.actorName, avatar: a.actorAvatar },
      text: a.action,
      time: a.createdAt,
    })),
  }
})
