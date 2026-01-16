import fs from 'fs-extra'
import { getDirectories } from '../src/constants/env.ts'
import { exec, prepareWranglerConfig } from './utils.ts'

async function main() {
  const { dataDirectory } = getDirectories()
  await Promise.all([
    exec`simple-git-hooks`,
    exec`react-router typegen`,
    fs.ensureDir(dataDirectory),
    prepareWranglerConfig({ force: true }),
  ])
  await Promise.all([exec`drizzle-kit generate`, exec`wrangler types src/types/worker-configuration.d.ts`])
  await exec`drizzle-kit migrate`
  await exec`wrangler d1 migrations apply --local retroassembly_library`
}

await main()
