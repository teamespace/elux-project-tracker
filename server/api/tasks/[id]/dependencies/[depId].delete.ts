import { useDB, eq, and } from '../../../../utils/db'
import { taskDependencies } from '../../../../database/schema'
import { requireRole } from '../../../../utils/permissions'
import { logActivity } from '../../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const taskId = getRouterParam(event, 'id')!
  const depId = getRouterParam(event, 'depId')!
  const db = useDB()

  await db.delete(taskDependencies)
    .where(and(eq(taskDependencies.taskId, taskId), eq(taskDependencies.dependsOnTaskId, depId)))

  await logActivity(event, 'removed dependency', 'task', taskId)

  return { ok: true }
})
