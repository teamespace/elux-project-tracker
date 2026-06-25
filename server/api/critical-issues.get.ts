import { useDB } from '../utils/db'
import { criticalIssues } from '../database/schema'

export default defineEventHandler(async (_event) => {
  const db = useDB()
  return db.select().from(criticalIssues).all()
})
