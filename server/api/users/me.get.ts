import { useDB, eq } from '../../utils/db'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const userId = session?.user?.id
  if (!userId) throw createError({ statusCode: 401 })

  const db = useDB()
  const user = await db.select().from(users).where(eq(users.id, userId)).get()
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    initials: user.name.charAt(0).toUpperCase(),
    avatar: `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(user.name)}`,
  }
})