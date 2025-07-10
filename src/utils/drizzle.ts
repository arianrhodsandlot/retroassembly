import { drizzle as drizzleBetterSQLite3 } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { env, getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { databasePath } from '../constants/env.ts'
import * as schema from '../databases/schema.ts'

export function createDrizzle() {
  if (getRuntimeKey() === 'workerd') {
    const { DB_LIBRARY } = env<Env>(getContext(), 'workerd')
    return {
      library: drizzleD1(DB_LIBRARY, { casing: 'snake_case', schema }),
    }
  }
  return {
    library: drizzleBetterSQLite3(databasePath, { casing: 'snake_case', schema }),
  }
}
