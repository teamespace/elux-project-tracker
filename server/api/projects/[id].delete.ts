import { useDB, eq } from '../../utils/db'
import { projects } from '../../database/schema'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const proj = await db.select().from(projects).where(eq(projects.id, id)).get()
  if (!proj) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  await db.delete(projects).where(eq(projects.id, id))
  await logActivity(event, 'deleted project', 'project', id, proj.name)

  return { ok: true }
})
