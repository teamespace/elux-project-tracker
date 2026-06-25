import { useDB, eq, or } from '../../utils/db'
import { templates } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  // Return global templates + user's own
  return db.select().from(templates)
    .where(or(eq(templates.isGlobal, true), eq(templates.createdBy, userId)))
    .all()
})
