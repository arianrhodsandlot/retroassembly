import { drizzle } from 'drizzle-orm/d1'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import * as librarySchema from '../databases/library/schema.ts'

export function createDrizzle() {
  const { DB_LIBRARY } = env<Env>(getContext(), 'workerd')
  if (DB_LIBRARY) {
    return {
      library: drizzle(DB_LIBRARY, { casing: 'snake_case', schema: librarySchema }),
    }
  }
  throw new Error('Could not initialize db')
}
