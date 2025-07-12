import ciInfo from 'ci-info'
import fs from 'fs-extra'
import { dataDirectory } from '../constants/env.ts'
import { exec, prepareWranglerConfig } from './utils.ts'

async function main() {
  if (ciInfo.isCI) {
    return
  }

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
