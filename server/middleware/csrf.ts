export default defineEventHandler(async (event) => {
  if (event.method !== 'POST' && event.method !== 'PUT' &&
      event.method !== 'PATCH' && event.method !== 'DELETE') return

  // Dev mode: skip CSRF for local development convenience
  if (process.env.NODE_ENV === 'development') return

  // Auth routes don't need CSRF (no session yet)
  const url = getRequestURL(event)
  if (url.pathname === '/api/auth/login' || url.pathname === '/api/auth/logout') return

  const csrfHeader = getHeader(event, 'x-csrf-token')
  const csrfCookie = getCookie(event, 'csrf_token')

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    throw createError({ statusCode: 403, statusMessage: 'CSRF validation failed' })
  }
})
