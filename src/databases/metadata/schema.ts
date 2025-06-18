import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { customAlphabet } from 'nanoid'
import { nolookalikes } from 'nanoid-dictionary'

const nanoid = customAlphabet(nolookalikes, 10)

export const launchboxGameTable = sqliteTable(
  'launchbox_games',
  {
    communityRating: real(),
    communityRatingCount: integer(),
    compactName: text().notNull(),
    cooperative: integer({ mode: 'boolean' }),
    databaseId: integer().primaryKey().notNull(),
    developer: text(),
    dos: text(),
    esrb: text(),
    genres: text(),
    goodcodesBaseCompactName: text().notNull(),
    maxPlayers: integer(),
    name: text().notNull(),
    overview: text(),
    platform: text(),
    publisher: text(),
    releaseDate: integer({ mode: 'timestamp_ms' }),
    releaseType: text(),
    releaseYear: text(),
    setupFile: text(),
    setupMd5: text(),
    startupFile: text(),
    startupMd5: text(),
    startupParameters: text(),
    steamAppId: text(),
    videoUrl: text(),
    wikipediaUrl: text(),
  },
  (table) => [
    index('lbg_compact_name_platform_idx').on(table.compactName, table.platform),
    index('lbg_goodcodes_base_compact_name_platform_idx').on(table.goodcodesBaseCompactName, table.platform),
    index('lbg_platform_idx').on(table.platform),
  ],
)

export const launchboxPlatformTable = sqliteTable(
  'launchbox_platforms',
  {
    category: text(),
    cpu: text(),
    developer: text(),
    display: text(),
    emulated: integer({ mode: 'boolean' }),
    graphics: text(),
    manufacturer: text(),
    maxControllers: text(),
    media: text(),
    memory: text(),
    name: text().primaryKey().notNull(),
    notes: text(),
    releaseDate: integer({ mode: 'timestamp_ms' }),
    sound: text(),
    useMameFiles: integer({ mode: 'boolean' }),
  },
  (table) => [index('idx_launchbox_platforms').on(table.name)],
)

export const launchboxPlatformAlternateNameTable = sqliteTable(
  'launchbox_platform_alternate_names',
  {
    alternate: text().notNull(),
    id: text('id').primaryKey().notNull().$defaultFn(nanoid),
    name: text(),
  },
  (table) => [index('idx_launchbox_platform_alternate_names').on(table.alternate, table.name)],
)

export const launchboxGameAlternateNameTable = sqliteTable(
  'launchbox_game_alternate_names',
  {
    alternateName: text(),
    compactName: text(),
    databaseId: integer(),
    id: text().primaryKey().notNull().$defaultFn(nanoid),
    region: text(),
  },
  (table) => [index('idx_launchbox_game_alternate_names').on(table.alternateName, table.compactName, table.databaseId)],
)

export const libretroGameTable = sqliteTable(
  'libretro_games',
  {
    compactName: text().notNull(),
    crc: text(),
    description: text(),
    developer: text(),
    esrbRating: text(),
    franchise: text(),
    genre: text(),
    goodcodesBaseCompactName: text().notNull(),
    id: text().primaryKey().notNull(),
    md5: text(),
    name: text(),
    origin: text(),
    platform: text(),
    publisher: text(),
    releasemonth: integer(),
    releaseyear: integer(),
    romName: text(),
    sha1: text(),
    size: integer(),
    users: integer(),
  },
  (table) => [
    index('idx_libretro_game').on(
      table.name,
      table.goodcodesBaseCompactName,
      table.md5,
      table.compactName,
      table.platform,
      table.romName,
    ),
  ],
)
