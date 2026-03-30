import path from 'node:path'
import { test as base } from '@playwright/test'
import fs from 'fs-extra'
import { getCDNUrl } from '../../../src/utils/isomorphic/cdn.ts'

interface Rom {
  path: string
  title: string
  url: string
  platform: string
  platformName: string
}

const roms = (
  [
    { ext: 'nes', platform: 'nes', platformName: 'NES', repo: 'nes-games', title: 'babelblox' },
    { ext: 'nes', platform: 'nes', platformName: 'NES', repo: 'nes-games', title: 'flappybird' },
    { ext: 'sfc', platform: 'snes', platformName: 'Super NES', repo: 'snes-games', title: 'hilda' },
    { ext: 'sfc', platform: 'snes', platformName: 'Super NES', repo: 'snes-games', title: 'superbossgaiden' },
    { ext: 'gba', platform: 'gba', platformName: 'Game Boy Advance', repo: 'gba-games', title: 'anguna' },
    { ext: 'gba', platform: 'gba', platformName: 'Game Boy Advance', repo: 'gba-games', title: 'asteroidsb' },
    { ext: 'gbc', platform: 'gbc', platformName: 'Game Boy Color', repo: 'gbc-games', title: 'ucity' },
    { ext: 'gbc', platform: 'gbc', platformName: 'Game Boy Color', repo: 'gbc-games', title: 'brickster' },
  ] as const
).map((def) => {
  const romsDirectory = `tests/e2e/fixtures/files/roms/${def.platform}`
  const repoName = `retrobrews/${def.repo}` as const
  const url = getCDNUrl(repoName, `${def.title}.${def.ext}`)
  const { pathname } = new URL(url)
  const { base } = path.parse(pathname)
  const rom: Rom = {
    path: path.join(romsDirectory, base),
    platform: def.platform,
    platformName: def.platformName,
    title: def.title,
    url,
  }
  return rom
})

export const test = base.extend<{ roms: Rom[] }>({
  async roms({ page }, use) {
    await Promise.all(
      roms.map(async (rom) => {
        await fs.ensureDir(path.dirname(rom.path))
        const exists = await fs.pathExists(rom.path)
        if (!exists) {
          const response = await fetch(rom.url)
          const arrayBuffer = await response.arrayBuffer()
          await fs.writeFile(rom.path, Buffer.from(arrayBuffer))
        }
      }),
    )

    await use(roms)
  },
})
