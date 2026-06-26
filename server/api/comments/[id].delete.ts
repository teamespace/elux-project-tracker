import { useDB, eq } from '../../utils/db'
import { comments } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const comment = await db.select().from(comments).where(eq(comments.id, id)).get()
  if (!comment) throw createError({ statusCode: 404, statusMessage: 'Comment not found' })

  if (user.role !== 'admin' && comment.authorId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await db.delete(comments).where(eq(comments.id, id))
  await logActivity(event, 'deleted comment', 'comment', id)

  return { ok: true }
})
