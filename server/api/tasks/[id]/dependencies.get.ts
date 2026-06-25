import { useDB, eq, or } from '../../../utils/db'
import { taskDependencies, tasks } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const deps = await db.select().from(taskDependencies)
    .where(or(eq(taskDependencies.taskId, id), eq(taskDependencies.dependsOnTaskId, id)))
    .all()

  const taskIds = [...new Set(deps.flatMap(d => [d.taskId, d.dependsOnTaskId]))]
  const allTasks = await db.select().from(tasks).all()
  const taskMap = Object.fromEntries(allTasks.map(t => [t.id, t]))

  const blockedBy = deps.filter(d => d.taskId === id).map(d => ({
    id: d.dependsOnTaskId,
    title: taskMap[d.dependsOnTaskId]?.title ?? '[Unknown]',
    status: taskMap[d.dependsOnTaskId]?.status ?? 'unknown',
  }))

  const blocks = deps.filter(d => d.dependsOnTaskId === id).map(d => ({
    id: d.taskId,
    title: taskMap[d.taskId]?.title ?? '[Unknown]',
    status: taskMap[d.taskId]?.status ?? 'unknown',
  }))

  return { blockedBy, blocks }
})
