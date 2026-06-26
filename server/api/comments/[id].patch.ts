import { useDB, eq } from '../../utils/db'
import { comments } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { z } from 'zod'

const updateCommentSchema = z.object({
  text: z.string().min(1).max(5000),
})

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const result = updateCommentSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const id = getRouterParam(event, 'id')!
  const db = useDB()

  const comment = await db.select().from(comments).where(eq(comments.id, id)).get()
  if (!comment) throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
  if (comment.authorId !== user.id && user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  await db.update(comments).set({
    text: result.data.text,
  }).where(eq(comments.id, id))

  await logActivity(event, 'edited comment', 'comment', id)

  return { ok: true }
})
