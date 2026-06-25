import { useDB } from '../../utils/db'
import { projects, projectMembers, users } from '../../database/schema'
import { eq } from '../../utils/db'

export default defineEventHandler(async (_event) => {
  const db = useDB()

  const allProjects = await db.select().from(projects).all()

  return Promise.all(allProjects.map(async (proj) => {
    const members = await db.select().from(projectMembers).where(eq(projectMembers.projectId, proj.id)).all()
    return {
      ...proj,
      assignees: members.map(m => ({ seed: m.seed, bg: m.bg, name: m.seed })),
    }
  }))
})
