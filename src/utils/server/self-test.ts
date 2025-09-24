import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import fs from 'fs-extra'
import { getRuntimeKey } from 'hono/adapter'
import isDocker from 'is-docker'
import { getDirectories } from '../../constants/env.ts'
import { createDrizzle } from './drizzle.ts'

async function testDataDirectory() {
  const { dataDirectory } = getDirectories()
  const dataDirectoryExists = await fs.exists(dataDirectory)
  if (dataDirectoryExists) {
    return
  }

  const errorMessages = [`Data directory ${dataDirectory} does not exist.`]
  if (isDocker()) {
    errorMessages.push(
      `As you are using Docker, make sure to mount the data directory with "--volume <data_directory_path>:${dataDirectory}".`,
    )
  }
  for (const errorMessage of errorMessages) {
    console.error(errorMessage)
  }
  const errorMessage = errorMessages.join('\n')
  throw new Error(errorMessage)
}

function migrateDatabase() {
  if (getRuntimeKey() === 'node') {
    const db = createDrizzle().library
    migrate(db, {
      migrationsFolder: 'src/databases/migrations',
      migrationsSchema: 'src/databases/schema.ts',
    })
  }
}

async function main() {
  await testDataDirectory()
  migrateDatabase()
}

await main()
