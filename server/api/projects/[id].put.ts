import { useDB, eq } from '../../utils/db'
import { projects } from '../../database/schema'
import { sql } from '../../utils/db'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { updateProjectSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const id = getRouterParam(event, 'id')!
  const result = updateProjectSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  await db.update(projects)
    .set({ ...body, updatedAt: sql`(datetime('now'))` })
    .where(eq(projects.id, id))

  await logActivity(event, 'updated project', 'project', id, body.name ?? '')

  return { ok: true }
})
