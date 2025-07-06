import assert from 'node:assert'
import { template } from 'es-toolkit/compat'
import { $, dotenv, fs, glob } from 'zx'

$.verbose = true

const resetDirectories = ['src/databases/library/migrations']
await Promise.all(resetDirectories.map((directory) => $`rm -rf ${directory}`))

await $`drizzle-kit --config=src/databases/library/drizzle.config.ts generate --name=init`
await $`drizzle-kit --config=src/databases/library/drizzle.config.ts migrate`

// Dump data from the temporary database to local d1
const databaseNames = ['library']
await $`rm -rf .wrangler/state/v3/d1/miniflare-D1DatabaseObject`
// prepare wrangler config
const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
const compiled = template(wranglerTemplate)
const env = { ...process.env, ...dotenv.loadSafe('.dev.vars') }
const wranglerConfig = compiled(env)
await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')
for (const databaseName of databaseNames) {
  await $`wrangler d1 migrations apply retroassembly_${databaseName}`
}
const dbFiles = await glob('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite')
assert.strictEqual(dbFiles.length, 2)
const dbFileMap: Record<string, string> = {}
for (const dbFile of dbFiles) {
  const { stdout } = await $`sqlite3 ${dbFile} .table`
  const tables = stdout.split(/\s+/g)
  if (tables.includes('launchbox_games')) {
    dbFileMap.metadata = dbFile
  }
  if (tables.includes('roms')) {
    dbFileMap.library = dbFile
  }
}
for (const databaseName of databaseNames) {
  $`cp src/scripts/artifacts/${databaseName}.db ${dbFileMap[databaseName]}`
}
