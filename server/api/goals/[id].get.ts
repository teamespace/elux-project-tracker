import { useDB, eq } from '../../utils/db'
import { goals, goalLabels, kpis, goalProjects, users, projects, activity } from '../../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const goal = await db.select().from(goals).where(eq(goals.id, id)).get()
  if (!goal) throw createError({ statusCode: 404, statusMessage: 'Goal not found' })

  const owner = goal.ownerId
    ? await db.select().from(users).where(eq(users.id, goal.ownerId)).get()
    : null

  const labels = await db.select().from(goalLabels).where(eq(goalLabels.goalId, id)).all()

  const kpiList = await db.select().from(kpis).where(eq(kpis.goalId, id)).all()
  const enrichedKpis = await Promise.all(kpiList.map(async (k) => {
    const kOwner = k.ownerId
      ? await db.select().from(users).where(eq(users.id, k.ownerId)).get()
      : null
    return { ...k, owner: kOwner ? { initials: kOwner.initials, name: kOwner.name, avatar: kOwner.avatar } : null }
  }))

  const gps = await db.select().from(goalProjects).where(eq(goalProjects.goalId, id)).all()
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

  const activityList = await db.select().from(activity)
    .where(eq(activity.entityId, id))
    .orderBy(desc(activity.createdAt))
    .limit(20)
    .all()

  return {
    ...goal,
    owner: owner ? { initials: owner.initials, name: owner.name, avatar: owner.avatar } : null,
    labels: labels.map(l => ({ id: l.id, name: l.name, color: l.color })),
    kpis: enrichedKpis,
    linkedProjects: linkedProjectsList.filter(Boolean),
    activity: activityList.map(a => ({
      id: a.id,
      actor: { initials: a.actorInitials, name: a.actorName, avatar: a.actorAvatar },
      action: a.action,
      target: a.target,
      time: a.createdAt,
    })),
  }
})
