import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { customAlphabet } from 'nanoid'
import nanoidDictionary from 'nanoid-dictionary'

const nanoid = customAlphabet(nanoidDictionary.nolookalikes, 10)

export const launchboxGameTable = sqliteTable(
  'launchbox_games',
  {
    community_rating: real(),
    community_rating_count: integer(),
    compact_name: text().notNull(),
    cooperative: integer({ mode: 'boolean' }),
    database_id: integer().primaryKey().notNull(),
    developer: text(),
    dos: text(),
    esrb: text(),
    genres: text(),
    goodcodes_base_compact_name: text().notNull(),
    max_players: integer(),
    name: text().notNull(),
    overview: text(),
    platform: text(),
    publisher: text(),
    release_date: integer({ mode: 'timestamp_ms' }),
    release_type: text(),
    release_year: text(),
    setup_file: text(),
    setup_md5: text(),
    startup_file: text(),
    startup_md5: text(),
    startup_parameters: text(),
    steam_app_id: text(),
    video_url: text(),
    wikipedia_url: text(),
  },
  (table) => [
    index('idx_launchbox_games').on(
      table.database_id,
      table.compact_name,
      table.goodcodes_base_compact_name,
      table.name,
      table.platform,
    ),
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
    max_controllers: text(),
    media: text(),
    memory: text(),
    name: text().primaryKey().notNull(),
    notes: text(),
    release_date: integer({ mode: 'timestamp_ms' }),
    sound: text(),
    use_mame_files: integer({ mode: 'boolean' }),
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
  (table) => [index('idx_launchbox_platform_alternate_names').on(table.id, table.alternate, table.name)],
)

export const launchboxGameAlternateNameTable = sqliteTable(
  'launchbox_game_alternate_names',
  {
    alternate_name: text(),
    compact_name: text(),
    database_id: integer(),
    id: text().primaryKey().notNull().$defaultFn(nanoid),
    region: text(),
  },
  (table) => [
    index('idx_launchbox_game_alternate_names').on(
      table.id,
      table.alternate_name,
      table.compact_name,
      table.database_id,
    ),
  ],
)

export const libretroGameTable = sqliteTable(
  'libretro_games',
  {
    compact_name: text().notNull(),
    crc: text(),
    description: text(),
    developer: text(),
    esrb_rating: text(),
    franchise: text(),
    genre: text(),
    goodcodes_base_compact_name: text().notNull(),
    id: text().primaryKey().notNull(),
    md5: text(),
    name: text(),
    origin: text(),
    platform: text(),
    publisher: text(),
    releasemonth: integer(),
    releaseyear: integer(),
    rom_name: text(),
    sha1: text(),
    size: integer(),
    users: integer(),
  },
  (table) => [index('idx_libretro_game').on(table.id, table.name, table.goodcodes_base_compact_name, table.rom_name)],
)
