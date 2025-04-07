import { drizzle } from 'drizzle-orm/d1'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import * as librarySchema from '../databases/library/schema.ts'
import * as metadataSchema from '../databases/metadata/schema.ts'

export function createDrizzle() {
  const { DB_LIBRARY, DB_METADATA } = env<Env>(getContext(), 'workerd')
  if (DB_LIBRARY && DB_METADATA) {
    return {
      library: drizzle(DB_LIBRARY, { casing: 'snake_case', schema: librarySchema }),
      metadata: drizzle(DB_METADATA, { casing: 'snake_case', schema: metadataSchema }),
    }
  }
  throw new Error('Could not initialize db')
}
