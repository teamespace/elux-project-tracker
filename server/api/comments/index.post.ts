import { useDB } from '../../utils/db'
import { comments } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createCommentSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const result = createCommentSchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `comment-${Date.now()}`
  await db.insert(comments).values({
    id,
    parentType: body.parentType,
    parentId: body.parentId,
    authorId: user.id,
    text: body.text,
  })

  await logActivity(event, 'posted comment', 'comment', id, body.text.slice(0, 50))

  return { id }
})
