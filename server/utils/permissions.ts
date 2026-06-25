import type { H3Event } from 'h3'

type Role = 'admin' | 'manager' | 'member' | 'intern'

export function requireRole(event: H3Event, ...roles: Role[]) {
  const session = event.context.user
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!roles.includes(session.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }
}

export function requireAuth(event: H3Event) {
  const session = event.context.user
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  return session
}

export function requireOwnership(event: H3Event, ownerId: string) {
  const session = event.context.user
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (session.role === 'admin') return // Admin bypasses
  if (session.id !== ownerId) {
    throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }
}
