import { UTCDateMini } from '@date-fns/utc'
import { format } from 'date-fns'
import { $ } from 'execa'

function getTag() {
  const now = new UTCDateMini()
  const major = '1'
  const minor = format(now, 'yyMMdd')
  const patch = format(now, 'hhmm')
  let version = `${major}.${minor}.${patch}`
  if (!process.env.npm_lifecycle_script?.includes('latest')) {
    version += '-unstable'
  }
  return version
}

async function main() {
  const tag = getTag()
  await $({ verbose: 'short' })`git tag v${tag}`
}

await main()
