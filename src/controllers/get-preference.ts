import { eq } from 'drizzle-orm'
import { merge } from 'es-toolkit'
import { getContextData } from 'waku/middleware/context'
import { defaultPreference } from '../constants/preference.ts'
import { userPreferenceTable } from '../databases/library/schema.ts'

export async function getPreference() {
  const { currentUser, db } = getContextData()

  const where = eq(userPreferenceTable.user_id, currentUser.id)
  const results = await db.library
    .select({ emulator: userPreferenceTable.emulator, ui: userPreferenceTable.ui })
    .from(userPreferenceTable)
    .where(where)
  const preference = structuredClone(defaultPreference)
  const userPreference = results[0]
  merge(preference, (userPreference as any) || {})
  return preference
}
