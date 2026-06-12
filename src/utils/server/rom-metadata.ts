import type { InferInsertModel } from 'drizzle-orm'
import { isNotNil, pickBy } from 'es-toolkit'
import { DateTime } from 'luxon'
import type { romTable } from '#@/databases/schema.ts'

interface GameInfo {
  launchbox?: Record<string, any>
  libretro?: Record<string, any>
}

type RomMetadata = Pick<
  InferInsertModel<typeof romTable>,
  | 'gameDeveloper'
  | 'gameGenres'
  | 'gameName'
  | 'gamePlayers'
  | 'gamePublisher'
  | 'gameReleaseDate'
  | 'gameReleaseYear'
  | 'launchboxGameId'
  | 'libretroGameId'
  | 'rawGameMetadata'
>

function getGenres({ launchbox, libretro }: GameInfo) {
  return (
    launchbox?.genres
      ?.split(';')
      .map((genre: string) => genre.trim())
      .join(',') ||
    libretro?.genres
      ?.split(',')
      .map((genre: string) => genre.trim())
      .join(',')
  )
}

function getReleaseDate({ launchbox }: GameInfo) {
  if (launchbox?.releaseDate) {
    const date = DateTime.fromISO(launchbox.releaseDate)
    if (date.isValid) {
      return date.toJSDate()
    }
  }
}

function getReleaseYear({ launchbox, libretro }: GameInfo) {
  if (launchbox) {
    if (launchbox.releaseYear) {
      const result = Number.parseInt(launchbox.releaseYear || '', 10)
      if (result) {
        return result
      }
    }

    if (launchbox.releaseDate) {
      const result = new Date(launchbox.releaseDate).getFullYear()
      if (result) {
        return result
      }
    }
  }

  if (libretro) {
    const result = Number.parseInt(libretro.releaseyear || '', 10)
    if (result) {
      return result
    }
  }
}

/** Strip nullish fields from each sub-object of an msleuth identify result, in place. */
export function normalizeGameInfo(gameInfo: Record<string, any>) {
  for (const key of Object.keys(gameInfo)) {
    const item = gameInfo[key]
    if (item && typeof item === 'object') {
      gameInfo[key] = pickBy(item, (value) => isNotNil(value))
    }
  }
  return gameInfo
}

/** Map a normalized msleuth identify result to the `romTable` metadata columns. */
export function extractRomMetadata(gameInfo: GameInfo): RomMetadata {
  const { launchbox, libretro } = gameInfo
  return {
    gameDeveloper: launchbox?.developer || libretro?.developer,
    gameGenres: getGenres({ launchbox, libretro }),
    gameName: launchbox?.name || libretro?.name,
    gamePlayers: launchbox?.maxPlayers || libretro?.users,
    gamePublisher: launchbox?.publisher || libretro?.publisher,
    gameReleaseDate: getReleaseDate({ launchbox }),
    gameReleaseYear: getReleaseYear({ launchbox, libretro }),
    launchboxGameId: launchbox?.databaseId,
    libretroGameId: libretro?.id,
    rawGameMetadata: launchbox || libretro ? { launchbox, libretro } : undefined,
  }
}
