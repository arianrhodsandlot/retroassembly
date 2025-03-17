import { eq } from 'drizzle-orm'
import { merge } from 'es-toolkit'
import { getContextData } from 'waku/middleware/context'
import { userPreferenceTable } from '@/databases/library/schema.ts'

export async function updatePreference(preference) {
  const { currentUser, db } = getContextData()

  const where = eq(userPreferenceTable.user_id, currentUser.id)
  const results = await db.library.select().from(userPreferenceTable).where(where)

  let newPreferenceResult
  if (results.length > 0) {
    const [{ emulator, ui }] = results
    const newPreference: any = {}
    if (emulator) {
      merge(emulator, preference.emulator)
      newPreference.emulator = emulator
    }
    if (ui) {
      merge(ui, preference.ui)
      newPreference.ui = ui
    }
    newPreferenceResult = await db.library
      .update(userPreferenceTable)
      .set({ ...newPreference, user_id: currentUser.id })
      .where(where)
      .returning()
  } else {
    newPreferenceResult = await db.library
      .insert(userPreferenceTable)
      .values({ ...preference, user_id: currentUser.id })
      .returning()
  }

  return newPreferenceResult.content
}
