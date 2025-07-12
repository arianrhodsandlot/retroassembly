import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { PreferenceSnippet } from '../constants/preference'
import { nanoid } from '../utils/misc.ts'

export const statusEnum = {
  deleted: 0,
  normal: 1,
}

const baseSchema = {
  createdAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  id: text('id').primaryKey().notNull().$defaultFn(nanoid),
  status: integer().notNull().default(statusEnum.normal),
  updatedAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date()),
}

const fileSchema = {
  ...baseSchema,
  fileId: text().notNull(),
  userId: text().notNull(),
}

export const userTable = sqliteTable(
  'users',
  {
    passwordHash: text().notNull(),
    registrationIp: text(),
    registrationUserAgent: text(),
    username: text().notNull().unique(),
    ...baseSchema,
  },
  (table) => [index('idx_users_username').on(table.username), index('idx_users_status').on(table.status)],
)

export const sessionTable = sqliteTable(
  'sessions',
  {
    expiresAt: integer({ mode: 'timestamp_ms' }).notNull(),
    ip: text(),
    lastActivityAt: integer({ mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    token: text().notNull().unique(),
    userAgent: text(),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [
    index('idx_sessions_token').on(table.token),
    index('idx_sessions_user').on(table.userId, table.status),
    index('idx_sessions_expires').on(table.expiresAt),
    index('idx_sessions_activity').on(table.lastActivityAt),
  ],
)

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
