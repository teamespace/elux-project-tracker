import { useDB, eq } from '../utils/db'
import { tasks, projects, criticalIssues, activity } from '../database/schema'
import { desc, and } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const db = useDB()

  const allTasks = await db.select().from(tasks).all()
  const allProjects = await db.select().from(projects).all()
  const issues = await db.select().from(criticalIssues).all()
  const feed = await db.select().from(activity)
    .orderBy(desc(activity.createdAt))
    .limit(10)
    .all()

  const total = allTasks.length
  const done = allTasks.filter(t => t.done).length
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length
  const overdue = allTasks.filter(t => t.dueType === 'overdue' && !t.done).length
  const atRisk = allProjects.filter(p => p.status === 'at-risk').length

  return {
    stats: { total, done, inProgress, overdue, atRisk, totalProjects: allProjects.length },
    criticalIssues: issues,
    activity: feed,
  }
})
