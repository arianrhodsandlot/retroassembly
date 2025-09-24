import { and, eq, inArray, like, or } from 'drizzle-orm'
import Fuse from 'fuse.js'
import { getContext } from 'hono/context-storage'
import { romTable } from '@/databases/schema.ts'
import { getRomsMetadata } from '../../utils/server/misc.ts'

type SearchRomsReturning = Awaited<ReturnType<typeof searchRoms>>
export type SearchRoms = SearchRomsReturning['roms']
export type SearchRom = SearchRoms[number]
export type SearchRomsPagination = SearchRomsReturning['pagination']

const fuseOptions = {
  distance: 100,
  includeScore: true,
  keys: [
    { name: 'gameName', weight: 0.4 },
    { name: 'fileName', weight: 0.3 },
    { name: 'gameDeveloper', weight: 0.2 },
    { name: 'gamePublisher', weight: 0.2 },
    { name: 'platform', weight: 0.2 },
  ],
  minMatchCharLength: 1,
  threshold: 0.9,
}
const searchableFields = [romTable.fileName, romTable.gameName, romTable.gameDeveloper, romTable.gamePublisher] as const

function createLikeConditions(pattern: string) {
  return searchableFields.map((field) => like(field, pattern))
}

function createSearchConditions(query: string) {
  const conditions = createLikeConditions(`%${query}%`)
  if (query.length > 1) {
    conditions.push(...createLikeConditions(`%${[...query].join('%')}%`))
  }
  if (query.length > 2) {
    const words = query.split(/\s+/).filter((word) => word.length > 1)
    if (words.length > 1) {
      for (const word of words) {
        conditions.push(...createLikeConditions(`%${word}%`))
      }
    }
  }

  return or(...conditions)
}

export async function searchRoms(
  {
    page = 1,
    pageSize = 100,
    platform,
    query,
  }: {
    page?: number
    pageSize?: number
    platform?: string
    query: string
  } = {} as any,
) {
  const { currentUser, db, preference } = getContext().var
  const { library } = db

  const conditions = [
    eq(romTable.userId, currentUser.id),
    eq(romTable.status, 1),
    platform ? eq(romTable.platform, platform) : inArray(romTable.platform, preference.ui.platforms),
  ]
  const trimmedQuery = query.trim().replaceAll(/\s+/g, ' ')
  const searchConditions = createSearchConditions(trimmedQuery)
  if (searchConditions) {
    conditions.push(searchConditions)
  }
  const where = and(...conditions)

  const allRomResults = await library.select().from(romTable).where(where)

  const fuse = new Fuse(allRomResults, fuseOptions)
  const fuseResults = fuse.search(trimmedQuery)
  const sortedRoms = fuseResults.map((result) => result.item)

  const offset = (page - 1) * pageSize
  const romResults = sortedRoms.slice(offset, offset + pageSize)

  const total = sortedRoms.length

  const results = await getRomsMetadata(romResults)

  return {
    pagination: {
      current: page,
      pages: Math.ceil(total / pageSize),
      size: pageSize,
      total,
    },
    platform,
    query,
    roms: results,
    trimmedQuery,
  }
}
