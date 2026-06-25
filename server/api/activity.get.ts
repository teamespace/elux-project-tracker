import { useDB } from '../utils/db'
import { activity } from '../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDB()

  const feed = await db.select().from(activity)
    .orderBy(desc(activity.createdAt))
    .limit(Number(query.limit ?? 20))
    .all()

  return feed
})
