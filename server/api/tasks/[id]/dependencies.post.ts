import { useDB, eq, and } from '../../../utils/db'
import { taskDependencies } from '../../../database/schema'
import { requireRole } from '../../../utils/permissions'
import { addDependencySchema } from '../../../utils/validation'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const taskId = getRouterParam(event, 'id')!
  const result = addDependencySchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const { dependsOnTaskId } = result.data
  if (taskId === dependsOnTaskId) {
    throw createError({ statusCode: 400, statusMessage: 'A task cannot depend on itself' })
  }

  const db = useDB()

  // Circular dependency check
  const allDeps = await db.select().from(taskDependencies).all()
  const graph = new Map<string, string[]>()
  for (const d of allDeps) {
    if (!graph.has(d.taskId)) graph.set(d.taskId, [])
    graph.get(d.taskId)!.push(d.dependsOnTaskId)
  }
  if (!graph.has(taskId)) graph.set(taskId, [])
  graph.get(taskId)!.push(dependsOnTaskId)

  function hasCycle(node: string, visited = new Set<string>(), stack = new Set<string>()): boolean {
    if (stack.has(node)) return true
    if (visited.has(node)) return false
    visited.add(node)
    stack.add(node)
    for (const neighbor of graph.get(node) ?? []) {
      if (hasCycle(neighbor, visited, stack)) return true
    }
    stack.delete(node)
    return false
  }

  if (hasCycle(taskId)) {
    throw createError({ statusCode: 400, statusMessage: 'Circular dependency detected' })
  }

  await db.insert(taskDependencies).values({ taskId, dependsOnTaskId })
  await logActivity(event, 'added dependency', 'task', taskId)

  return { ok: true }
})
