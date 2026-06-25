import { useDB, eq } from '../../utils/db'
import { subtasks } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = useDB()

  await db.update(subtasks).set(body).where(eq(subtasks.id, id))
  return { ok: true }
})
