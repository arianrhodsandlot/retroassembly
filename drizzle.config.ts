import { defineConfig } from 'drizzle-kit'
import { getDatabasePath } from './src/constants/env.ts'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: { url: getDatabasePath() },
  dialect: 'sqlite',
  out: 'src/databases/migrations',
  schema: 'src/databases/schema.ts',
})
