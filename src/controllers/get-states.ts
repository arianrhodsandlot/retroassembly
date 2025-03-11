import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { state } from '../databases/library/schema.ts'

export async function getStates({ rom, type }: { rom: string; type?: 'auto' | 'manual' }) {
  const { currentUser, db } = getContextData()

  const conditions = [eq(state.user_id, currentUser.id), eq(state.status, 1)]
  if (rom) {
    conditions.push(eq(state.rom_id, rom))
  }
  if (type === 'auto' || type === 'manual') {
    conditions.push(eq(state.type, type))
  }
  const where = and(...conditions)
  const results = await db.library.select().from(state).where(where)
  return results
}
