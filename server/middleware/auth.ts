export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Allow public routes
  if (
    url.pathname.startsWith('/api/auth/') ||
    url.pathname.startsWith('/_nuxt') ||
    url.pathname.startsWith('/__nuxt') ||
    !url.pathname.startsWith('/api/')
  ) return

  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Attach user to event.context for use in route handlers
  event.context.user = session.user
})
