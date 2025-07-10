import fs from 'fs-extra'
import { dataDirectory } from '../constants/env.ts'
import { exec, prepareWranglerConfig } from './utils.ts'

await exec`simple-git-hooks`
await exec`react-router typegen`

await fs.ensureDir(dataDirectory)
await exec`drizzle-kit generate`
await exec`drizzle-kit migrate`

await prepareWranglerConfig({ force: true })
await exec`wrangler types src/types/worker-configuration.d.ts`
await exec`wrangler d1 migrations apply --local retroassembly_library`
