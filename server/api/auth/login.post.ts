import { useDB, eq } from '../../utils/db'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const db = useDB()
  const user = await db.select().from(users).where(eq(users.email, email)).get()

  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  // For now compare plain — swap for bcrypt when you add password hashing
  // In dev seed, passwords are stored as plain text prefixed with "plain:"
  const storedPass = user.passwordHash
  const valid = storedPass.startsWith('plain:')
    ? storedPass.slice(6) === password
    : storedPass === password

  if (!valid) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      initials: user.initials,
      avatar: user.avatar ?? undefined,
      role: user.role as 'admin' | 'manager' | 'member' | 'intern',
    },
  })

  return { ok: true }
})
