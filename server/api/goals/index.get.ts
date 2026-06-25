import { useDB } from '../../utils/db'
import { goals, goalLabels, kpis, goalProjects, users, projects } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const db = useDB()

  const allGoals = await db.select().from(goals).all()

  const result = await Promise.all(allGoals.map(async (goal) => {
    const owner = goal.ownerId
      ? await db.select().from(users).where(eq(users.id, goal.ownerId)).get()
      : null

    const labels = await db.select().from(goalLabels).where(eq(goalLabels.goalId, goal.id)).all()
    const kpiList = await db.select().from(kpis).where(eq(kpis.goalId, goal.id)).all()
    const gps = await db.select().from(goalProjects).where(eq(goalProjects.goalId, goal.id)).all()

    const linkedProjectsList = await Promise.all(gps.map(async (gp) => {
      const proj = await db.select().from(projects).where(eq(projects.id, gp.projectId)).get()
      if (!proj) return null
      return {
        id: gp.projectId,
        title: gp.titleOverride ?? proj.name,
        project: proj.name,
        status: proj.status,
        statusLabel: proj.statusLabel,
        progress: proj.progress,
        taskCount: gp.taskCount,
      }
    }))

    return {
      ...goal,
      owner: owner ? { initials: owner.initials, name: owner.name, avatar: owner.avatar } : null,
      labels: labels.map(l => ({ id: l.id, name: l.name, color: l.color })),
      kpis: await Promise.all(kpiList.map(async (k) => {
        const kOwner = k.ownerId
          ? await db.select().from(users).where(eq(users.id, k.ownerId)).get()
          : null
        return {
          ...k,
          owner: kOwner ? { initials: kOwner.initials, name: kOwner.name, avatar: kOwner.avatar } : null,
        }
      })),
      linkedProjects: linkedProjectsList.filter(Boolean),
      activity: [], // load lazily on detail page if needed
    }
  }))

  return result
})
