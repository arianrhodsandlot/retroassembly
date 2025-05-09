import assert from 'node:assert'
import { template } from 'es-toolkit/compat'
import { $, dotenv, fs, glob, path } from 'zx'

async function prepareZip(inputSubDirectory: string, url: string) {
  const inputDirectory = path.join('src/scripts/inputs', inputSubDirectory)
  await $`mkdir -p ${inputDirectory}`
  const { base, name } = path.parse(new URL(url).pathname)
  const zipDirectory = path.join(inputDirectory, name)
  const zipPath = path.join(inputDirectory, base)
  if (!(await fs.exists(zipDirectory))) {
    if (!(await fs.exists(zipPath))) {
      await $`curl ${url} -o ${zipPath}`
    }
    $`unzip ${zipPath} -d ${zipDirectory}`
  }
}

$.verbose = true

const resetDirectories = [
  'src/databases/library/migrations',
  'src/databases/metadata/migrations',
  'src/scripts/artifacts/library.db',
  'src/scripts/artifacts/metadata.db',
]
await Promise.all(resetDirectories.map((directory) => $`rm -rf ${directory}`))

// Prepare the input metadata files
await Promise.all([
  prepareZip('libretro', 'https://buildbot.libretro.com/assets/frontend/database-rdb.zip'),
  prepareZip('launchbox', 'https://gamesdb.launchbox-app.com/metadata.zip'),
])

// Initialize a temporary database
await $`mkdir -p src/scripts/artifacts`
await $`drizzle-kit --config=src/databases/metadata/drizzle.config.ts generate --name=init`
await $`drizzle-kit --config=src/databases/metadata/drizzle.config.ts migrate`

await $`drizzle-kit --config=src/databases/library/drizzle.config.ts generate --name=init`
await $`drizzle-kit --config=src/databases/library/drizzle.config.ts migrate`

// Prepare data for the temporary database
await Promise.all([
  $`node src/scripts/dev/extract-libretro-db.ts`,
  $`node src/scripts/dev/extract-launchbox-metadata.ts`,
])

// Dump data from the temporary database to local d1
const databaseNames = ['library', 'metadata']
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
