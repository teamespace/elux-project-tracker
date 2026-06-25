import { useDB, eq } from '../../utils/db'
import { tasks } from '../../database/schema'
import { sql } from '../../utils/db'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { updateTaskSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const result = updateTaskSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  if (user.role === 'member') {
    const task = await db.select().from(tasks).where(eq(tasks.id, id)).get()
    if (task && task.assigneeId !== user.id) {
      throw createError({ statusCode: 403, statusMessage: 'You can only edit your own tasks' })
    }
  }

  await db.update(tasks)
    .set({ ...body, updatedAt: sql`(datetime('now'))` })
    .where(eq(tasks.id, id))

  await logActivity(event, 'updated task', 'task', id, body.title ?? '')

  return { ok: true }
})
