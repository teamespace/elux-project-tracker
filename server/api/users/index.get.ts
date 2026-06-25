import { useDB } from '../../utils/db'
import { users } from '../../database/schema'

export default defineEventHandler(async (_event) => {
  const db = useDB()
  const all = await db.select({
    id: users.id,
    name: users.name,
    initials: users.initials,
    avatar: users.avatar,
    role: users.role,
    email: users.email,
  }).from(users).all()
  return all
})
