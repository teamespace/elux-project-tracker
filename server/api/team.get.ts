import { useDB, eq } from '../utils/db'
import { users, tasks } from '../database/schema'

export default defineEventHandler(async (_event) => {
  const db = useDB()
  const allUsers = await db.select().from(users).all()
  const allTasks = await db.select().from(tasks).all()

  return allUsers.map(user => {
    const mine = allTasks.filter(t => t.assigneeId === user.id)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      avatar: user.avatar,
      role: user.role,
      todo: mine.filter(t => t.status === 'todo').length,
      inProgress: mine.filter(t => t.status === 'in-progress').length,
      inReview: mine.filter(t => t.status === 'in-review').length,
      done: mine.filter(t => t.done).length,
      total: mine.length,
    }
  })
})
