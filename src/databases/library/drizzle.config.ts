import { defineConfig } from 'drizzle-kit'
import { databasePath } from '../../constants/env.ts'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: { url: databasePath },
  dialect: 'sqlite',
  out: 'src/databases/library/migrations',
  schema: 'src/databases/library/schema.ts',
})
