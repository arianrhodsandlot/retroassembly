import type { InferSelectModel } from 'drizzle-orm'
import type { romTable } from '@/databases/library/schema.ts'
import { msleuth } from '@/utils/msleuth.ts'

export async function getRomsMetadata<T extends InferSelectModel<typeof romTable>[]>(romResults: T) {
  const conditions = romResults.map(({ launchboxGameId: launchboxId, libretroGameId: libretroId }) => ({
    launchboxId,
    libretroId,
  }))
  let metadataList
  try {
    metadataList = await msleuth.query({ conditions })
  } catch (error) {
    console.warn(error)
  }

  return romResults.map((romResult, index) => ({
    ...romResult,
    launchboxGame: metadataList[index]?.launchbox,
    libretroGame: metadataList[index]?.libretro,
  }))
}
