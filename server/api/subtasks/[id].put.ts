import { useDB, eq } from '../../utils/db'
import { subtasks } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  done: z.boolean().optional(),
  dueDate: z.string().optional(),
  assigneeName: z.string().optional(),
  sortOrder: z.number().optional(),
})

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const data = updateSchema.parse(body)
  const db = useDB()

  await db.update(subtasks).set(data).where(eq(subtasks.id, id))
  await logActivity(event, 'updated subtask', 'subtask', id)
  return { ok: true }
})
