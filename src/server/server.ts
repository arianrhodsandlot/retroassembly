import { Hono } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { createDrizzle } from '@/utils/drizzle.ts'
import { app as api } from '../api/app.ts'
import { globalsMiddleware } from '../middlewares/hono/globals.ts'
import { app as pages } from '../pages/app.ts'

if (getRuntimeKey() === 'node') {
  const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')
  const db = createDrizzle().library
  migrate(db, {
    migrationsFolder: 'src/databases/library/migrations',
    migrationsSchema: 'src/databases/library/schema.ts',
  })
}

const app = new Hono()
app.use(contextStorage(), logger(), globalsMiddleware)

app.route('/api', api)
app.route('/', pages)

export default app
