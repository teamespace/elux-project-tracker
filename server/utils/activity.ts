import { useDB } from './db'
import { activity } from '../database/schema'
import type { H3Event } from 'h3'

type EntityType = 'goal' | 'project' | 'task' | 'subtask' | 'comment' | 'kpi'

export async function logActivity(
  event: H3Event,
  action: string,
  entityType: EntityType,
  entityId: string,
  target: string = '',
) {
  const session = event.context.user
  const db = useDB()

  await db.insert(activity).values({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actorId: session?.id ?? null,
    actorName: session?.name ?? 'Unknown',
    actorInitials: session?.initials ?? '?',
    actorAvatar: session?.avatar ?? null,
    action,
    target,
    entityType,
    entityId,
  })
}
