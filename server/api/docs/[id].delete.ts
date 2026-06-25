import { useDB, eq } from '../../utils/db'
import { docs } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const doc = await db.select().from(docs).where(eq(docs.id, id)).get()
  if (!doc) throw createError({ statusCode: 404, statusMessage: 'Doc not found' })

  await db.delete(docs).where(eq(docs.id, id))
  await logActivity(event, 'deleted doc', 'project', id, doc.title)

  return { ok: true }
})
