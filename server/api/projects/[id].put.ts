import { useDB, eq } from '../../utils/db'
import { projects, projectMembers, users } from '../../database/schema'
import { sql } from '../../utils/db'
import { requireRole } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { updateProjectSchema } from '../../utils/validation'

const BG_MAP: Record<string, string> = {
  Rasya: 'b6e3f4', Maya: 'ffd5dc', Dito: 'c0aede', Rara: 'f9a8d4',
}

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin', 'manager')

  const id = getRouterParam(event, 'id')!
  const result = updateProjectSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const { assignees, ...projectFields } = body
  const db = useDB()

  await db.update(projects)
    .set({ ...projectFields, updatedAt: sql`(datetime('now'))` })
    .where(eq(projects.id, id))

  if (assignees !== undefined) {
    await db.delete(projectMembers).where(eq(projectMembers.projectId, id))
    for (const name of assignees) {
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

  await logActivity(event, 'updated project', 'project', id, body.name ?? '')

  return { ok: true }
})
