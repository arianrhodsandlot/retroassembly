import { and, eq } from 'drizzle-orm'
import { getContextData } from 'waku/middleware/context'
import { resolveUserPreference } from '../constants/preference.ts'
import { userPreferenceTable } from '../databases/library/schema.ts'

export async function getPreference() {
  const { currentUser, db } = getContextData()

  const results = await db.library
    .select({ emulator: userPreferenceTable.emulator, ui: userPreferenceTable.ui })
    .from(userPreferenceTable)
    .where(and(eq(userPreferenceTable.userId, currentUser.id), eq(userPreferenceTable.status, 1)))

  const [userPreference] = results

  return resolveUserPreference(userPreference)
}
