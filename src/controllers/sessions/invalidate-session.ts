import { eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { sessionTable, statusEnum } from '#@/databases/schema.ts'

export async function invalidateSession() {
  const c = getContext()
  const { token } = c.var
  if (token) {
    const { db } = c.var
    await db.library.update(sessionTable).set({ status: statusEnum.deleted }).where(eq(sessionTable.token, token))
  }
}
