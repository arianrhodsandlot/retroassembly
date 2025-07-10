import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { customAlphabet } from 'nanoid'
import { nolookalikes } from 'nanoid-dictionary'
import type { PreferenceSnippet } from '@/constants/preference'

const nanoid = customAlphabet(nolookalikes, 10)

const baseSchema = {
  createdAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  id: text('id').primaryKey().notNull().$defaultFn(nanoid),
  /** 1 for normal status and 0 for deleted status */
  status: integer().notNull().default(1),
  updatedAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date()),
}

const fileSchema = {
  ...baseSchema,
  fileId: text().notNull(),
  userId: text().notNull(),
}

export const romTable = sqliteTable(
  'roms',
  {
    fileName: text().notNull(),
    gameDeveloper: text(),
    gameName: text(),
    gamePublisher: text(),
    gameReleaseYear: integer(),
    launchboxGameId: integer(),
    launchTimes: integer().default(0),
    libretroGameId: text(),
    platform: text().notNull(),
    ...fileSchema,
  },
  (table) => [index('idx_roms').on(table.userId, table.status, table.platform, table.fileName)],
)

export const stateTable = sqliteTable(
  'states',
  {
    core: text().notNull(),
    platform: text().notNull(),
    romId: text().notNull(),
    thumbnailFileId: text().notNull(),
    type: text({ enum: ['auto', 'manual'] }).notNull(),
    ...fileSchema,
  },
  (table) => [index('idx_states').on(table.userId, table.status, table.romId, table.platform)],
)

export const launchRecordTable = sqliteTable(
  'launch_records',
  {
    core: text().notNull(),
    platform: text().notNull(),
    romId: text().notNull(),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [index('idx_launch_records').on(table.userId, table.status, table.platform, table.romId, table.createdAt)],
)

export const userPreferenceTable = sqliteTable(
  'user_preferences',
  {
    emulator: text({ mode: 'json' }).$type<PreferenceSnippet['emulator']>(),
    input: text({ mode: 'json' }).$type<PreferenceSnippet['input']>(),
    ui: text({ mode: 'json' }).$type<PreferenceSnippet['ui']>(),
    user: text({ mode: 'json' }),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [index('idx_user_preferences').on(table.userId)],
)
