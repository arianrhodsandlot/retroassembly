import { count, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { userTable } from '@/databases/schema.ts'

export async function countUsers() {
  const { db } = getContext().var

  const [{ value }] = await db.library.select({ value: count() }).from(userTable).where(eq(userTable.status, 1))

  return value
}
