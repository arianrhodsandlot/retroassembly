import { defineConfig } from 'drizzle-kit'
import { databasePath } from './src/constants/env.ts'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: { url: databasePath },
  dialect: 'sqlite',
  out: 'src/databases/migrations',
  schema: 'src/databases/schema.ts',
})
