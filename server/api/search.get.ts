import { useDB, like } from '../utils/db'
import { tasks, projects, goals } from '../database/schema'
import { or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event) as { q: string }
  if (!q || q.length < 2) return { tasks: [], projects: [], goals: [] }

  const db = useDB()
  const pattern = `%${q}%`

  const [matchedTasks, matchedProjects, matchedGoals] = await Promise.all([
    db.select().from(tasks).where(like(tasks.title, pattern)).limit(5).all(),
    db.select().from(projects).where(like(projects.name, pattern)).limit(5).all(),
    db.select().from(goals).where(like(goals.title, pattern)).limit(5).all(),
  ])

  return { tasks: matchedTasks, projects: matchedProjects, goals: matchedGoals }
})
