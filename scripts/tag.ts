import { $ } from 'execa'
import { DateTime } from 'luxon'

function getTag() {
  const now = DateTime.now().setZone('utc')
  const major = '4'
  const minor = now.toFormat('yyMMdd')
  const patch = now.toFormat('HHmm')
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
