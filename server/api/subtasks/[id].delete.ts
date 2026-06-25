import { useDB, eq } from '../../utils/db'
import { subtasks } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDB()
  await db.delete(subtasks).where(eq(subtasks.id, id))
  return { ok: true }
})
