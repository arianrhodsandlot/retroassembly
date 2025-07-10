import { $ } from 'execa'
import fs from 'fs-extra'
import { dataDirectory } from '../constants/env.ts'

const $$ = $({ verbose: 'full' })
await $$`simple-git-hooks`

await fs.ensureDir(dataDirectory)

await $$`env`
// await $`drizzle-kit --config=src/databases/library/drizzle.config.ts migrate`
