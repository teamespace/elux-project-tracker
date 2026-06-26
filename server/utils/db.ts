import { drizzle } from 'drizzle-orm/d1'

export { sql, eq, and, or, desc, asc, like, count } from 'drizzle-orm'

let _db: ReturnType<typeof drizzle> | null = null

export function useDB() {
  if (!_db) {
    _db = drizzle(hubDatabase())
  }
  return _db
}
