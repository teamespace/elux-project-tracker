import { useDB, eq } from '../../utils/db'
import { templates } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const tpl = await db.select().from(templates).where(eq(templates.id, id)).get()
  if (!tpl) throw createError({ statusCode: 404, statusMessage: 'Template not found' })

  if (user.role !== 'admin' && tpl.createdBy !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await db.delete(templates).where(eq(templates.id, id))
  await logActivity(event, 'deleted template', 'project', id, tpl.name)

  return { ok: true }
})
