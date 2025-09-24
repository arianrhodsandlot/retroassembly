import { and, eq, gt } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { DateTime } from 'luxon'
import { sessionTable, statusEnum, userTable } from '@/databases/schema.ts'
import { createSupabase } from '@/utils/supabase.ts'

export async function getCurrentUser() {
  const supabase = createSupabase()
  if (supabase) {
    const { data } = await supabase.auth.getUser()
    return data?.user
  }

  const c = getContext()
  const { db, token } = c.var

  if (!token) {
    return
  }

  const [result] = await db.library
    .select()
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(
      and(
        eq(sessionTable.token, token),
        eq(sessionTable.status, statusEnum.normal),
        eq(userTable.status, statusEnum.normal),
        gt(sessionTable.expiresAt, new Date()),
      ),
    )
    .limit(1)

  if (!result) {
    return
  }

  // Auto-renewal logic with Luxon
  const now = DateTime.now()
  const lastActivity = DateTime.fromJSDate(new Date(result.sessions.lastActivityAt))
  const expiresAt = DateTime.fromJSDate(new Date(result.sessions.expiresAt))

  const timeSinceActivity = now.diff(lastActivity, 'milliseconds').milliseconds
  const hoursUntilExpiry = expiresAt.diff(now, 'hours').hours

  // Session renewal threshold (renew if expires within 24 hours)
  const RENEWAL_THRESHOLD_HOURS = 24
  const ACTIVITY_UPDATE_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

  let shouldUpdate = false
  let newExpiresAt = expiresAt
  let newLastActivityAt = lastActivity

  // Renew session if close to expiry
  if (hoursUntilExpiry <= RENEWAL_THRESHOLD_HOURS) {
    newExpiresAt = now.plus({ days: 30 }) // Extend by 30 days
    shouldUpdate = true
  }

  // Update activity if enough time has passed
  if (timeSinceActivity >= ACTIVITY_UPDATE_INTERVAL) {
    newLastActivityAt = now
    shouldUpdate = true
  }

  if (shouldUpdate) {
    await db.library
      .update(sessionTable)
      .set({
        expiresAt: newExpiresAt.toJSDate(),
        lastActivityAt: newLastActivityAt.toJSDate(),
      })
      .where(eq(sessionTable.id, result.sessions.id))
  }

  return {
    id: result.users.id,
    username: result.users.username,
  }
}
