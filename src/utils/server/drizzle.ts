import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { drizzle as drizzleNodeSQLite } from 'drizzle-orm/node-sqlite'
import { env, getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { getDatabasePath } from '../../constants/env.ts'
import * as schema from '../../databases/schema.ts'

const runtimeKey = getRuntimeKey()
const config = { casing: 'snake_case', schema } as const

function createDrizzleD1() {
  const c = getContext()
  const library = drizzleD1(env<Env>(c).DB_LIBRARY, config)
  return { library }
}

function createDrizzleBetterSQLite3() {
  const library = drizzleNodeSQLite(getDatabasePath(), config)
  return { library }
}

export function createDrizzle() {
  if (runtimeKey === 'workerd') {
    return (createDrizzleD1 as unknown as typeof createDrizzleBetterSQLite3)()
  }

  return createDrizzleBetterSQLite3()
}
