import { useDB, eq } from '../utils/db'
import { users } from '../database/schema'
import { requireRole } from '../utils/permissions'

export default defineEventHandler(async (event) => {
  requireRole(event, 'admin')

  const { name, email, role, password } = await readBody(event)

  if (!name || name.trim().length < 2) throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters' })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  if (!password || password.length < 6) throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters' })
  if (!['admin', 'manager', 'member', 'intern'].includes(role)) throw createError({ statusCode: 400, statusMessage: 'Invalid role' })

  const db = useDB()
  const existing = await db.select().from(users).where(eq(users.email, email)).get()
  if (existing) throw createError({ statusCode: 409, statusMessage: 'A user with this email already exists' })

  const initials = name.trim().split(/\s+/).map((s: string) => s[0].toUpperCase()).slice(0, 2).join('')
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const id = `user-${slug}-${Date.now()}`
  const avatar = `https://api.dicebear.com/9.x/micah/svg?seed=${initials}`
  const passwordHash = `plain:${password}`

  await db.insert(users).values({
    id,
    email,
    passwordHash,
    name: name.trim(),
    initials,
    avatar,
    role,
  })

  return {
    ok: true,
    user: { id, name: name.trim(), email, initials, avatar, role },
  }
})
