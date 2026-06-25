import { useDB, eq } from '../../../utils/db'
import { templates, tasks, projects } from '../../../database/schema'
import { requireRole } from '../../../utils/permissions'
import { logActivity } from '../../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')
  const user = event.context.user

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const tpl = await db.select().from(templates).where(eq(templates.id, id)).get()
  if (!tpl) throw createError({ statusCode: 404, statusMessage: 'Template not found' })

  const payload = JSON.parse(tpl.payload)
  const body = await readBody(event)

  if (tpl.entityType === 'task') {
    const taskId = `task-${Date.now()}`
    await db.insert(tasks).values({
      id: taskId,
      title: `${tpl.name} - ${body.title ?? ''}`,
      description: payload.description ?? '',
      status: 'todo',
      statusLabel: 'To Do',
      priority: payload.priority ?? 'medium',
      priorityLabel: payload.priority ?? 'MED',
      assigneeId: body.assigneeId ?? null,
      projectId: body.projectId ?? null,
      projectName: body.projectName ?? '',
      dueDate: body.dueDate ?? '',
    })
    await logActivity(event, 'created task from template', 'task', taskId, tpl.name)
    return { taskId }
  }

  if (tpl.entityType === 'epic') {
    const projId = `p-${Date.now()}`
    await db.insert(projects).values({
      id: projId,
      key: (payload.key ?? '').toUpperCase(),
      name: payload.name ?? tpl.name,
      description: payload.description ?? '',
      status: 'not-started',
      statusLabel: 'NOT STARTED',
      ownerId: user.id,
    })
    await logActivity(event, 'created project from template', 'project', projId, tpl.name)
    return { projectId: projId }
  }

  return { ok: true }
})
