import { drizzle as drizzleBetterSQLite3 } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import * as librarySchema from '../databases/library/schema.ts'

export function createDrizzle() {
  const { DB_LIBRARY } = env<Env>(getContext(), 'workerd')
  if (DB_LIBRARY) {
    return {
      library: drizzleD1(DB_LIBRARY, { casing: 'snake_case', schema: librarySchema }),
    }
  }
  return {
    library: drizzleBetterSQLite3('data/library.db', {
      casing: 'snake_case',
      schema: librarySchema,
    }),
  }
}
