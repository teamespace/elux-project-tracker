import { useDB, eq } from '../utils/db'
import { users, tasks } from '../database/schema'

export default defineEventHandler(async (_event) => {
  const db = useDB()
  const allUsers = await db.select().from(users).all()
  const allTasks = await db.select().from(tasks).all()

  return allUsers.map(user => {
    const mine = allTasks.filter(t => t.assigneeId === user.id)
    const todo = mine.filter(t => t.status === 'todo').length
    const inProgress = mine.filter(t => t.status === 'in-progress').length
    const done = mine.filter(t => t.done || t.status === 'done').length
    const assigned = mine.length
    const capacity = 10
    const status: string = assigned >= 10 ? 'overloaded' : assigned >= 6 ? 'capacity' : assigned >= 3 ? 'balanced' : 'available'
    const statusLabel = assigned >= 10 ? 'Overloaded' : assigned >= 6 ? 'At capacity' : assigned >= 3 ? 'Balanced' : 'Available'
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      avatar: user.avatar,
      role: user.role,
      todo,
      inProgress,
      done,
      assigned,
      capacity,
      status,
      statusLabel,
    }
  })
})
