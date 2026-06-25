import { useDB } from '../../utils/db'
import { templates } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createTemplateSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')
  const user = event.context.user

  const result = createTemplateSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `tpl-${Date.now()}`
  await db.insert(templates).values({
    id,
    name: body.name,
    description: body.description ?? '',
    entityType: body.entityType,
    payload: body.payload ?? '{}',
    createdBy: user.id,
    isGlobal: body.isGlobal ?? false,
  })

  await logActivity(event, 'created template', 'project', id, body.name)

  return { id }
})
