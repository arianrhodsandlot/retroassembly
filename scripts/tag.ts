import { UTCDate } from '@date-fns/utc'
import { format } from 'date-fns'
import { $ } from 'execa'

async function getCurrentBranch() {
  const { stdout } = await $`git branch --show-current`
  return stdout.trim()
}

async function getTag() {
  const now = new UTCDate()
  const major = '1'
  const minor = format(now, 'yyMMdd')
  const patch = format(now, 'hhmm')
  let version = `${major}.${minor}.${patch}`
  const currentBranch = await getCurrentBranch()
  if (currentBranch !== 'main') {
    version += '-beta'
  }
  return version
}

async function main() {
  const tag = await getTag()
  await $({ verbose: 'short' })`git tag v${tag}`
}

await main()
