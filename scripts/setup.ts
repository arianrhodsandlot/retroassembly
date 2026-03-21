import { mkdir } from 'node:fs/promises'
import { getDirectories } from '../src/constants/env.ts'
import { exec, prepareWranglerConfig } from './utils.ts'

async function main() {
  const { dataDirectory } = getDirectories()
  await Promise.all([
    exec`simple-git-hooks`,
    exec`react-router typegen`,
    mkdir(dataDirectory, { recursive: true }),
    prepareWranglerConfig({ force: true }),
  ])
  await Promise.all([exec`drizzle-kit generate`, exec`wrangler types src/types/worker-configuration.d.ts`])
  await exec`drizzle-kit migrate`
  await exec`wrangler d1 migrations apply --local retroassembly_library`
}

await main()
