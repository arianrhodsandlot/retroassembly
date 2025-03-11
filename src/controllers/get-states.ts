import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { stateTable } from '../databases/library/schema.ts'

export async function getStates({ rom, type }: { rom: string; type?: 'auto' | 'manual' }) {
  const { currentUser, db } = getContextData()

  const conditions = [eq(stateTable.user_id, currentUser.id), eq(stateTable.status, 1)]
  if (rom) {
    conditions.push(eq(stateTable.rom_id, rom))
  }
  if (type === 'auto' || type === 'manual') {
    conditions.push(eq(stateTable.type, type))
  }
  const where = and(...conditions)
  const results = await db.library.select().from(stateTable).where(where)
  return results
}
