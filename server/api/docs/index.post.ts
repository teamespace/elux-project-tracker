import { useDB } from '../../utils/db'
import { docs } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createDocSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const result = createDocSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `doc-${Date.now()}`
  await db.insert(docs).values({
    id,
    title: body.title,
    content: body.content ?? '',
    goalId: body.goalId ?? null,
    projectId: body.projectId ?? null,
    taskId: body.taskId ?? null,
    createdBy: user.id,
    labels: body.labels ?? '',
    isPublic: body.isPublic ?? false,
  })

  await logActivity(event, 'created doc', 'project', id, body.title)

  return { id }
})
