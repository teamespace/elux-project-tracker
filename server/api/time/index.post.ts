import { useDB } from '../../utils/db'
import { timeEntries } from '../../database/schema'
import { requireAuth } from '../../utils/permissions'
import { logActivity } from '../../utils/activity'
import { createTimeEntrySchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const result = createTimeEntrySchema.safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Validation failed' })
  }

  const body = result.data
  const db = useDB()

  const id = `te-${Date.now()}`
  await db.insert(timeEntries).values({
    id,
    taskId: body.taskId,
    userId: user.id,
    hours: body.hours,
    note: body.note ?? '',
    loggedDate: body.loggedDate,
  })

  await logActivity(event, 'logged time', 'task', body.taskId, `${body.hours}h`)

  return { id }
})
