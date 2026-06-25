import { useDB, eq } from '../../utils/db'
import { docs } from '../../database/schema'
import { sql } from 'drizzle-orm'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { updateDocSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const result = updateDocSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  await db.update(docs)
    .set({ ...body, updatedAt: sql`(datetime('now'))` })
    .where(eq(docs.id, id))

  await logActivity(event, 'updated doc', 'project', id, body.title ?? '')

  return { ok: true }
})
