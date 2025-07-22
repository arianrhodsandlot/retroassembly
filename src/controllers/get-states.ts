import { and, desc, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { stateTable } from '../databases/schema.ts'

export type States = Awaited<ReturnType<typeof getStates>>
export type State = States[number]

export async function getStates({
  core,
  limit,
  rom,
  type,
}: { core?: string; limit?: number; rom: string; type?: 'auto' | 'manual' }) {
  const { currentUser, db } = getContext().var

  const conditions = [eq(stateTable.userId, currentUser.id), eq(stateTable.status, 1)]
  if (rom) {
    conditions.push(eq(stateTable.romId, rom))
  }
  if (type === 'auto' || type === 'manual') {
    conditions.push(eq(stateTable.type, type))
  }
  if (core) {
    conditions.push(eq(stateTable.core, core))
  }

  const where = and(...conditions)
  const query = db.library.select().from(stateTable).where(where).orderBy(desc(stateTable.createdAt))

  if (limit) {
    query.limit(limit)
  }

  const results = await query
  return results
}
