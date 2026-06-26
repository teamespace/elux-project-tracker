import { useDB, eq } from '../../utils/db'
import { users, projectMembers, tasks, goals, goalProjects } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const db = useDB()
  const user = await db.select().from(users).where(eq(users.id, id)).get()
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  // Projects assigned
  const projects = await db.select().from(projectMembers).where(eq(projectMembers.userId, id)).all()

  // Open tasks assigned
  const openTasks = await db.select().from(tasks)
    .where(eq(tasks.assigneeId, id))
    .all()
  const myTasks = openTasks.filter(t => t.status !== 'done')

  // Goals owned
  const myGoals = await db.select().from(goals).where(eq(goals.ownerId, id)).all()

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    initials: user.name.charAt(0).toUpperCase(),
    avatar: `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(user.name)}`,
    bg: user.bg || 'b6e3f4',
    capacity: user.capacity ?? 10,
    assigned: myTasks.length,
    todo: myTasks.filter(t => t.status === 'todo').length,
    inProgress: myTasks.filter(t => t.status === 'in-progress').length,
    done: openTasks.filter(t => t.status === 'done').length,
    projectsCount: projects.length,
    goalsCount: myGoals.length,
  }
})