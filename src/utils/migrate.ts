import { getRuntimeKey } from 'hono/adapter'
import { createDrizzle } from './drizzle.ts'

if (getRuntimeKey() === 'node') {
  const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')
  const db = createDrizzle().library
  migrate(db, {
    migrationsFolder: 'src/databases/migrations',
    migrationsSchema: 'src/databases/schema.ts',
  })
}
