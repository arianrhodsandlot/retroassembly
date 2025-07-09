import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: 'data/library.db',
  },
  dialect: 'sqlite',
  out: 'src/databases/library/migrations',
  schema: 'src/databases/library/schema.ts',
})
