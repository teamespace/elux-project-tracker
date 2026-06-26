import { useDB, eq } from '../../utils/db'
import { projects, projectMembers, users } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createProjectSchema } from '../../utils/validation'

const BG_MAP: Record<string, string> = {
  Rasya: 'b6e3f4', Maya: 'ffd5dc', Dito: 'c0aede', Rara: 'f9a8d4',
}

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const result = createProjectSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `p-${Date.now()}`
  await db.insert(projects).values({
    id,
    key: body.key ?? id.toUpperCase(),
    name: body.name,
    description: body.description ?? '',
    status: body.status ?? 'not-started',
    statusLabel: body.statusLabel ?? 'NOT STARTED',
    priority: body.priority ?? 'medium',
    priorityLabel: body.priorityLabel ?? 'Medium',
    progress: 0,
    openTasks: 0,
    atRiskTasks: 0,
    doneT: 0,
    totalT: 0,
    dueDate: body.dueDate ?? '',
    ownerId: body.ownerId ?? null,
    color: body.color ?? 'bg-blue-500',
    category: body.category ?? '',
    labels: body.labels ?? '',
    riskLevel: body.riskLevel ?? 'low',
    riskReason: body.riskReason ?? '',
  })

  if (body.assignees && body.assignees.length > 0) {
    for (const name of body.assignees) {
      const user = await db.select().from(users).where(eq(users.name, name)).get()
      if (user) {
        await db.insert(projectMembers).values({
          projectId: id,
          userId: user.id,
          seed: name,
          bg: BG_MAP[name] || 'e5e7eb',
        })
      }
    }
  }

  await logActivity(event, 'created project', 'project', id, body.name)

  return { id }
})
